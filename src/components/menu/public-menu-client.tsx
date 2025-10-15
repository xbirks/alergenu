'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AllergenFilter } from './allergen-filter';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AllergenIconDisplay } from './allergen-icon-display';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Restaurant, Category, MenuItem, Allergen } from '@/lib/types';
import { LanguageSwitcher } from '@/components/language-switcher';

const staticTexts = {
  welcome: { es: "Bienvenido a la carta digital de", en: "Welcome to the digital menu of" },
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
};

const getTranslated = (i18nField: any, lang: string) => {
  if (i18nField && typeof i18nField === 'object') {
    return i18nField[lang] || i18nField.es || '';
  }
  return i18nField || '';
}

interface PublicMenuClientProps {
  restaurant: Restaurant;
  restaurantId: string;
  initialCategories: Category[];
  initialItems: MenuItem[];
  customAllergens: Allergen[];
}

interface GroupedMenu {
  [categoryName: string]: MenuItem[];
}

export function PublicMenuClient({ restaurant, restaurantId, initialCategories, initialItems, customAllergens }: PublicMenuClientProps) {
  const searchParams = useSearchParams();
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(searchParams.get('alergico') === 'true');
  const [selectedAllergens, setSelectedAllergens] = useLocalStorage<string[]>('selectedAllergens', []);
  const [openIncompatible, setOpenIncompatible] = useState<{ [key: string]: boolean }>({});
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useLocalStorage<string>('selectedLang', 'es');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const groupedMenu = useMemo(() => {
    return initialItems.reduce((acc: GroupedMenu, item: MenuItem) => {
      const categoryName = item.category || 'Varios';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      return acc;
    }, {} as GroupedMenu);
  }, [initialItems]);

  const { filteredGroupedMenu, incompatibleItemsByCategory } = useMemo(() => {
    if (selectedAllergens.length === 0) {
      return { filteredGroupedMenu: groupedMenu, incompatibleItemsByCategory: {} as GroupedMenu };
    }
    const filtered: GroupedMenu = {};
    const incompatible: GroupedMenu = {};
    for (const categoryName in groupedMenu) {
      const allItems = groupedMenu[categoryName];
      const compatibleItems: MenuItem[] = [];
      const incompatibleItems: MenuItem[] = [];
      allItems.forEach((item: MenuItem) => {
        const isCompatible = 
          (item.allergens.every(allergen => !selectedAllergens.includes(allergen))) &&
          (item.traces.every(trace => !selectedAllergens.includes(trace)));
        if (isCompatible) {
          compatibleItems.push(item);
        } else {
          incompatibleItems.push(item);
        }
      });
      if (compatibleItems.length > 0) {
        filtered[categoryName] = compatibleItems;
      }
      if (incompatibleItems.length > 0) {
        incompatible[categoryName] = incompatibleItems;
      }
    }
    return { filteredGroupedMenu: filtered, incompatibleItemsByCategory: incompatible };
  }, [groupedMenu, selectedAllergens]);

  const categoryTranslationMap = useMemo(() => {
    const map = new Map<string, any>();
    initialCategories.forEach(c => {
      map.set(c.name, c.name_i18n);
    });
    return map;
  }, [initialCategories]);

  const orderedCategoryNames = useMemo(() => {
    const categoryOrder = initialCategories.map(c => c.name);
    const allKnownCategories = new Set(Object.keys(groupedMenu));
    return categoryOrder.filter(name => allKnownCategories.has(name));
  }, [initialCategories, groupedMenu]);
  
  return (
    <div className="bg-white min-h-screen font-sans">
      <AllergenFilter
        isOpen={isFilterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        onFilterChange={setSelectedAllergens}
        restaurantUid={restaurantId}
        lang={lang}
      />
      <header className="sticky top-0 z-40 w-full bg-white">
        <div className="flex h-20 max-w-5xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={`/menu/${restaurant.slug}`}>
            <Image src="/icon_alergenu.png" alt="Alergenu Logo" width={36} height={36} className="flex-shrink-0" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher lang={lang} onLangChange={setLang} theme="light" />
            <Button
              variant="outline"
              onClick={() => setFilterSheetOpen(true)}
              className="relative rounded-full text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-100 px-3 sm:px-4 py-2"
            >
              <Image src="/icons/web_icons/filtro_alergeno.svg" alt="Filtro" width={18} height={18} className="mr-2"/>
              {staticTexts.editAllergies[lang]}
              {hasMounted && selectedAllergens.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#EA3939] text-xs font-bold text-white">
                  {selectedAllergens.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <p className="text-base text-blue-600 mt-10">{staticTexts.welcome[lang]}</p>
          <h1 className="text-[40pt] font-bold tracking-tight text-gray-900 mt-1" style={{ fontFamily: 'Manrope', lineHeight: '110%' }}>
            {restaurant.restaurantName || staticTexts.restaurantFallback[lang]}
          </h1>
        </div>

        <div className="space-y-16 mt-10">
          {orderedCategoryNames.length > 0 ? (
              orderedCategoryNames.map(categoryName => {
                const compatibleItems = filteredGroupedMenu[categoryName] || [];
                const incompatibleItems = incompatibleItemsByCategory[categoryName] || [];
                const sectionId = categoryName.replace(/\s+/g, '-');

                if (compatibleItems.length === 0 && incompatibleItems.length === 0) return null;

                return (
                  <section key={categoryName} id={sectionId}>
                    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
                      <h2 className="bg-blue-600 text-white text-2xl font-semibold px-4 sm:px-6 lg:px-4 py-4 tracking-normal">
                        {getTranslated(categoryTranslationMap.get(categoryName), lang)}
                      </h2>
                    </div>
                    <div className="space-y-6 mt-[40px]">
                      {compatibleItems.map((item: MenuItem) => (
                        <div key={item.id}>
                          <div className="flex justify-between items-start gap-4 mt-[40px]">
                            <div className='flex-grow '>
                              <h3 className="font-semibold text-[14pt] text-gray-800 tracking-normal" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>{getTranslated(item.name_i18n, lang)}</h3>
                              {item.description_i18n && <p className="font-regular text-[12pt] text-gray-500 mt-1 tracking-regular" style={{ fontFamily: 'Manrope', lineHeight: '130%' }}>{getTranslated(item.description_i18n, lang)}</p>}
                            </div>
                            <p className="font-semibold text-[14pt] text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>{(item.price / 100).toFixed(2).replace('.', ',')}€</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.allergens?.map((id: string) => <AllergenIconDisplay key={`${id}-contains`} allergenId={id} type="contains" lang={lang} />)}
                            {item.traces?.map((id: string) => <AllergenIconDisplay key={`${id}-traces`} allergenId={id} type="traces" lang={lang} />)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {incompatibleItems.length > 0 && selectedAllergens.length > 0 && (
                      <Collapsible 
                        open={openIncompatible[sectionId] || false} 
                        onOpenChange={(isOpen: boolean) => setOpenIncompatible(prev => ({ ...prev, [sectionId]: isOpen }))}
                        className="mt-6 pt-6 border-t border-gray-200"
                      >
                        <CollapsibleTrigger className="flex items-center justify-start text-sm font-semibold w-full py-2 text-[#EA3939]">
                          {staticTexts.showIncompatible[lang](incompatibleItems.length)}
                          <ChevronDown className={`h-5 w-5 ml-1 transition-transform ${openIncompatible[sectionId] ? 'rotate-180' : ''}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4 space-y-6">
                          {incompatibleItems.map((item: MenuItem) => (
                            <div key={item.id} className="opacity-60">
                              <div className="flex justify-between items-start gap-4 mt-[40px]">
                                <div className='flex-grow '>
                                  <h3 className="font-semibold text-[14pt] text-gray-800 tracking-normal" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>{getTranslated(item.name_i18n, lang)}</h3>
                                  {item.description_i18n && <p className="font-regular text-[12pt] text-gray-500 mt-1 tracking-regular" style={{ fontFamily: 'Manrope', lineHeight: '130%' }}>{getTranslated(item.description_i18n, lang)}</p>}
                                </div>
                                <p className="font-semibold text-[14pt] text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>{(item.price / 100).toFixed(2).replace('.', ',')}€</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 mt-3">
                                <span className="bg-[#EA3939] text-white text-xs font-bold mr-2 px-2 py-1 rounded-full">{staticTexts.notSuitable[lang]}</span>
                                <div className="flex flex-wrap items-center gap-2">
                                  {item.allergens?.map((id: string) => <AllergenIconDisplay key={`${id}-contains`} allergenId={id} type="contains" isHighlighted={selectedAllergens.includes(id)} lang={lang} />)}
                                  {item.traces?.map((id: string) => <AllergenIconDisplay key={`${id}-traces`} allergenId={id} type="traces" isHighlighted={selectedAllergens.includes(id)} lang={lang} />)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )}

                  </section>
                )
              })
            ) : (
            <div className="text-center py-16 px-6 bg-white rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800">{staticTexts.noResultsTitle[lang]}</h2>
                <p className="mt-2 text-muted-foreground">{staticTexts.noResultsDescription[lang]}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
