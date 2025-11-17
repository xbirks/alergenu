'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AllergenFilter } from './allergen-filter';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AllergenIconDisplay } from './allergen-icon-display';
import { AllergenLegend } from './allergen-legend';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Restaurant, Category, MenuItem, Allergen, MenuItemExtra } from '@/lib/types';
import { LanguageSwitcher } from '@/components/language-switcher';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { CategorySlider } from './category-slider';

// --- TIPOS DE DATOS --- //

interface DailyMenuDish {
  name: string;
  allergens: { [key: string]: 'yes' | 'traces' };
}

interface DailyMenuCourse {
  title: string;
  dishes: DailyMenuDish[];
}

interface DailyMenu {
  courses: DailyMenuCourse[];
  price: number;
  note: string;
  isPublished: boolean;
  startTime: string;
  endTime: string;
}

interface ProcessedExtra extends MenuItemExtra {
  isCompatible: boolean;
}

interface ProcessedMenuItem extends MenuItem {
  processedExtras: ProcessedExtra[];
}

interface PublicMenuClientProps {
  restaurant: Restaurant;
  restaurantId: string;
  initialCategories: Category[];
  initialItems: MenuItem[];
  customAllergens: Allergen[];
  lastUpdatedAt: string | null;
}

interface GroupedMenu {
  [categoryName: string]: MenuItem[];
}

// --- HELPERS & TEXTOS --- //

const generateSafeId = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/ñ/g, 'n')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9 -]/g, '') 
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const staticTexts = {
  welcome: { es: "Bienvenido a la carta digital de", en: "Welcome to the digital menu of" },
  lastUpdated: { es: "Última actualización", en: "Last updated" },
  editAllergies: { es: "Editar alergias", en: "Edit allergies" },
  showIncompatible: { 
    es: (count: number) => `Mostrar ${count} plato(s) no compatible(s)`,
    en: (count: number) => `Show ${count} incompatible item(s)` 
  },
  notSuitable: { es: "No apto", en: "Not suitable" },
  noResultsTitle: { es: "Tu búsqueda no ha dado resultados", en: "Your search returned no results" },
  noResultsDescription: { 
    es: "No se han encontrado platos que coincidan con tus selecciones. Prueba a cambiar los filtros.", 
    en: "No dishes matching your selections were found. Try changing the filters." 
  },
  uncategorized: { es: "Varios", en: "Miscellaneous" },
  restaurantFallback: { es: "Restaurante", en: "Restaurant" },
  dailyMenuTitle: { es: "Menú del Día", en: "Daily Menu" },
  dailyMenuToChoose: { es: "A elegir.", en: "To choose." },
  extrasTitle: { es: "Suplementos", en: "Extras" },
};

const getTranslated = (i18nField: any, lang: string) => {
  if (i18nField && typeof i18nField === 'object') {
    return i18nField[lang] || i18nField.es || '';
  }
  return i18nField || '';
}

// --- COMPONENTE PRINCIPAL --- //

export function PublicMenuClient({ restaurant, restaurantId, initialCategories, initialItems, customAllergens, lastUpdatedAt }: PublicMenuClientProps) {
  const searchParams = useSearchParams();
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(searchParams.get('alergico') === 'true');
  const [selectedAllergens, setSelectedAllergens] = useLocalStorage<string[]>('selectedAllergens', []);
  const [openIncompatible, setOpenIncompatible] = useState<{ [key: string]: boolean }>({});
  const [openIncompatibleDaily, setOpenIncompatibleDaily] = useState<{ [key: string]: boolean }>({});
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useLocalStorage<string>('selectedLang', 'es');

  const [dailyMenu, setDailyMenu] = useState<DailyMenu | null>(null);
  const [isLoadingDailyMenu, setIsLoadingDailyMenu] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setHasMounted(true);
    setCurrentDate(new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }));

    const fetchDailyMenu = async () => {
      try {
        const dailyMenuRef = doc(db, 'restaurants', restaurantId, 'dailyMenus', 'current');
        const docSnap = await getDoc(dailyMenuRef);
        if (docSnap.exists()) {
          setDailyMenu(docSnap.data() as DailyMenu);
        } 
      } catch (error) {
        console.error("Error fetching daily menu:", error);
      } finally {
        setIsLoadingDailyMenu(false);
      }
    };

    fetchDailyMenu();
  }, [restaurantId]);

  const processedDailyMenu = useMemo(() => {
    if (!dailyMenu) return null;
    // Daily menu processing logic can be enhanced here as well
    return dailyMenu;
  }, [dailyMenu, selectedAllergens]);

  const isDailyMenuVisible = useMemo(() => {
    if (isLoadingDailyMenu) return false;
    if (!dailyMenu || !dailyMenu.isPublished) return false;
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= dailyMenu.startTime && currentTime <= dailyMenu.endTime;
  }, [dailyMenu, isLoadingDailyMenu, now]);

  const groupedMenu = useMemo(() => {
    return initialItems.reduce((acc: GroupedMenu, item: MenuItem) => {
        const categoryName = getTranslated(item.category_i18n, 'es') || item.category || 'Varios';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(item);
        return acc;
    }, {} as GroupedMenu);
  }, [initialItems]);

  const { compatibleGroupedMenu, incompatibleItemsByCategory } = useMemo(() => {
    if (selectedAllergens.length === 0) {
        const allCompatible = Object.keys(groupedMenu).reduce((acc, categoryName) => {
            acc[categoryName] = groupedMenu[categoryName].map(item => ({
                ...item,
                processedExtras: (item.extras || []).map(extra => ({ ...extra, isCompatible: true }))
            }));
            return acc;
        }, {} as { [key: string]: ProcessedMenuItem[] });
        return { compatibleGroupedMenu: allCompatible, incompatibleItemsByCategory: {} as GroupedMenu };
    }

    const compatible: { [key: string]: ProcessedMenuItem[] } = {};
    const incompatible: GroupedMenu = {};

    for (const categoryName in groupedMenu) {
        const items = groupedMenu[categoryName];
        const compatibleItems: ProcessedMenuItem[] = [];
        const incompatibleItems: MenuItem[] = [];

        items.forEach(item => {
            const mainItemAllergenIds = [...(item.allergens || []), ...(item.traces || [])];
            const isMainItemCompatible = !mainItemAllergenIds.some(id => selectedAllergens.includes(id));

            if (isMainItemCompatible) {
                const processedExtras = (item.extras || []).map(extra => {
                    const extraAllergenIds = Object.keys(extra.allergens || {});
                    const isExtraCompatible = !extraAllergenIds.some(id => selectedAllergens.includes(id));
                    return { ...extra, isCompatible: isExtraCompatible };
                });
                compatibleItems.push({ ...item, processedExtras });
            } else {
                incompatibleItems.push(item);
            }
        });

        if (compatibleItems.length > 0) { compatible[categoryName] = compatibleItems; }
        if (incompatibleItems.length > 0) { incompatible[categoryName] = incompatibleItems; }
    }

    return { compatibleGroupedMenu: compatible, incompatibleItemsByCategory: incompatible };
  }, [groupedMenu, selectedAllergens]);

  const categoryTranslationMap = useMemo(() => {
    const map = new Map<string, any>();
    initialCategories.forEach(c => {
      map.set(c.name, c.name_i18n);
      map.set(getTranslated(c.name_i18n, 'es'), c.name_i18n);
    });
    return map;
  }, [initialCategories]);

  const orderedCategoryNames = useMemo(() => {
    const officialOrderMap = new Map(initialCategories.map((c, i) => [getTranslated(c.name_i18n, 'es') || c.name, i]));
    const allKnownCategories = Object.keys(groupedMenu);

    allKnownCategories.sort((a, b) => {
        const orderA = officialOrderMap.get(a);
        const orderB = officialOrderMap.get(b);
        if (orderA !== undefined && orderB !== undefined) return orderA - orderB;
        if (orderA !== undefined) return -1;
        if (orderB !== undefined) return 1;
        return a.localeCompare(b);
    });

    return allKnownCategories;
  }, [initialCategories, groupedMenu, lang]);

  const formattedLastUpdate = useMemo(() => {
    if (!lastUpdatedAt) return null;
    const date = new Date(lastUpdatedAt);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString(lang, options);
  }, [lastUpdatedAt, lang]);
  
  return (
    <div className="bg-white min-h-screen font-sans">
      <AllergenFilter isOpen={isFilterSheetOpen} onOpenChange={setFilterSheetOpen} onFilterChange={setSelectedAllergens} restaurantUid={restaurantId} lang={lang} />
      <header className="sticky top-0 z-40 w-full bg-white">
        <div className="flex h-20 max-w-5xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={`/menu/${restaurant.slug}`}><Image src="/icon_alergenu.png" alt="Alergenu Logo" width={36} height={36} className="flex-shrink-0" /></Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher lang={lang} onLangChange={setLang} theme="light" />
            <Button variant="outline" onClick={() => setFilterSheetOpen(true)} className="relative rounded-full text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-100 px-3 sm:px-4 py-2">
              <Image src="/icons/web_icons/filtro_alergeno.svg" alt="Filtro" width={18} height={18} className="mr-2"/>
              {staticTexts.editAllergies[lang]}
              {hasMounted && selectedAllergens.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#EA3939] text-xs font-bold text-white">{selectedAllergens.length}</span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <p className="text-base text-blue-600 mt-10">{staticTexts.welcome[lang]}</p>
          <h1 className="text-[40pt] font-bold tracking-tight text-gray-900 mt-1" style={{ fontFamily: 'Manrope', lineHeight: '110%' }}>{restaurant.restaurantName || staticTexts.restaurantFallback[lang]}</h1>
          {formattedLastUpdate && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500"><Clock className="h-4 w-4" /><span>{staticTexts.lastUpdated[lang]} {formattedLastUpdate}</span></div>
          )}
        </div>

        <CategorySlider orderedCategoryNames={orderedCategoryNames} categoryTranslationMap={categoryTranslationMap} isDailyMenuVisible={isDailyMenuVisible} lang={lang} getTranslated={getTranslated} filteredGroupedMenu={compatibleGroupedMenu} generateSafeId={generateSafeId} />

        <div className="space-y-16 mt-10">
          {orderedCategoryNames.map(categoryName => {
            const compatibleItems = compatibleGroupedMenu[categoryName] || [];
            const incompatibleItems = incompatibleItemsByCategory[categoryName] || [];
            const sectionId = generateSafeId(categoryName);

            if (!sectionId || (compatibleItems.length === 0 && incompatibleItems.length === 0)) return null;

            return (
              <section key={categoryName} id={sectionId} className="scroll-mt-28">
                <div className="-mx-4 sm:-mx-6 lg:-mx-8"><h2 className="bg-blue-600 text-white text-2xl font-semibold px-4 sm:px-6 lg:px-4 py-4 tracking-normal">{getTranslated(categoryTranslationMap.get(categoryName), lang) || categoryName}</h2></div>
                <div className="space-y-6 mt-[40px]">
                  {compatibleItems.map((item: ProcessedMenuItem) => (
                    <div key={item.id}>
                      <div className="flex justify-between items-start gap-4 mt-[40px]">
                        <div className='flex-grow '><h3 className="font-semibold text-[14pt] text-gray-800 tracking-normal" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>{getTranslated(item.name_i18n, lang)}</h3>{item.description_i18n && <p className="font-regular text-[12pt] text-gray-500 mt-1 tracking-regular" style={{ fontFamily: 'Manrope', lineHeight: '130%' }}>{getTranslated(item.description_i18n, lang)}</p>}</div>
                        <p className="font-semibold text-[14pt] text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>{(item.price / 100).toFixed(2).replace('.', ',')}€</p>
                      </div>
                      {item.processedExtras && item.processedExtras.length > 0 && (
                        <div className="pl-4 mt-3 space-y-3">
                          {item.processedExtras.map((extra, index) => (
                            <div key={index} className={`flex justify-between items-center gap-4 ${!extra.isCompatible ? 'opacity-50' : ''}`}>
                              <div className="flex items-center gap-2">
                                <p className="font-regular text-[12pt] text-gray-500 tracking-regular">{getTranslated(extra.name_i18n, lang)}</p>
                                {extra.allergens && Object.keys(extra.allergens).length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {Object.entries(extra.allergens).map(([id, status]) => (
                                      <div key={id} style={{ transform: 'scale(0.7)', transformOrigin: 'left center' }}><AllergenIconDisplay allergenId={id} type={status === 'yes' ? 'contains' : 'traces'} isHighlighted={!extra.isCompatible && selectedAllergens.includes(id)} lang={lang} /></div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <p className="font-regular text-[12pt] text-gray-500 whitespace-nowrap">+{(extra.price / 100).toFixed(2).replace('.', ',')}€</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.allergens?.map((id: string) => <AllergenIconDisplay key={`${id}-contains`} allergenId={id} type="contains" lang={lang} />)}
                        {item.traces?.map((id: string) => <AllergenIconDisplay key={`${id}-traces`} allergenId={id} type="traces" lang={lang} />)}
                      </div>
                    </div>
                  ))}
                </div>
                {incompatibleItems.length > 0 && selectedAllergens.length > 0 && (
                  <Collapsible open={openIncompatible[sectionId] || false} onOpenChange={(isOpen: boolean) => setOpenIncompatible(prev => ({ ...prev, [sectionId]: isOpen }))} className="mt-6 pt-6 border-t border-gray-200">
                    <CollapsibleTrigger className="flex items-center justify-start text-sm font-semibold w-full py-2 text-[#EA3939]">{staticTexts.showIncompatible[lang](incompatibleItems.length)}<ChevronDown className={`h-5 w-5 ml-1 transition-transform ${openIncompatible[sectionId] ? 'rotate-180' : ''}`} /></CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-6">
                      {incompatibleItems.map((item: MenuItem) => (
                        <div key={item.id} className="opacity-60">
                          <div className="flex justify-between items-start gap-4 mt-[40px]"><div className='flex-grow '><h3 className="font-semibold text-[14pt] text-gray-800 tracking-normal">{getTranslated(item.name_i18n, lang)}</h3>{item.description_i18n && <p className="font-regular text-[12pt] text-gray-500 mt-1">{getTranslated(item.description_i18n, lang)}</p>}</div><p className="font-semibold text-[14pt] text-gray-800 whitespace-nowrap">{(item.price / 100).toFixed(2).replace('.', ',')}€</p></div>
                          {item.extras && item.extras.length > 0 && (
                            <div className="pl-4 mt-3 space-y-3">
                              {item.extras.map((extra, index) => (
                                <div key={index} className="flex justify-between items-center gap-4">
                                   <div className="flex items-center gap-2">
                                      <p className="font-regular text-[12pt] text-gray-500">{getTranslated(extra.name_i18n, lang)}</p>
                                      {extra.allergens && Object.keys(extra.allergens).length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                          {Object.entries(extra.allergens).map(([id, status]) => (
                                            <div key={id} style={{ transform: 'scale(0.7)', transformOrigin: 'left center' }}><AllergenIconDisplay allergenId={id} type={status === 'yes' ? 'contains' : 'traces'} isHighlighted={selectedAllergens.includes(id)} lang={lang} /></div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  <p className="font-regular text-[12pt] text-gray-500 whitespace-nowrap">+{(extra.price / 100).toFixed(2).replace('.', ',')}€</p>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-3 mt-3"><span className="bg-[#EA3939] text-white text-xs font-bold mr-2 px-2 py-1 rounded-full">{staticTexts.notSuitable[lang]}</span><div className="flex flex-wrap items-center gap-2">
                            {item.allergens?.map((id: string) => <AllergenIconDisplay key={`${id}-contains`} allergenId={id} type="contains" isHighlighted={selectedAllergens.includes(id)} lang={lang} />)}
                            {item.traces?.map((id: string) => <AllergenIconDisplay key={`${id}-traces`} allergenId={id} type="traces" isHighlighted={selectedAllergens.includes(id)} lang={lang} />)}
                          </div></div>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </section>
            )
          })}
        </div>
        <AllergenLegend lang={lang} />
      </main>
    </div>
  );
}
