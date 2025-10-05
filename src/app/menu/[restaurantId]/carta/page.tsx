'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, collection, getDocs, query, where, limit, updateDoc, increment, orderBy } from 'firebase/firestore';
import { Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AllergenFilter } from '@/components/menu/allergen-filter';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AllergenIconDisplay } from '@/components/menu/allergen-icon-display';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ALLERGENS } from '@/lib/allergens';

interface Restaurant {
  restaurantName: string;
  slug: string;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  allergens: string[];
  traces: string[];
  isAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
  order: number;
}

interface GroupedMenu {
  [categoryName: string]: MenuItem[];
}

export default function PublicMenuPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const restaurantSlug = params.restaurantId as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [restaurantUid, setRestaurantUid] = useState<string | null>(null);
  const [groupedMenu, setGroupedMenu] = useState<GroupedMenu>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedAllergens, setSelectedAllergens] = useLocalStorage<string[]>('selectedAllergens', []);
  const [openIncompatible, setOpenIncompatible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (searchParams.get('alergico') === 'true') {
      setFilterSheetOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!restaurantSlug) return;

    const fetchMenuData = async () => {
      setLoading(true);
      try {
        const restaurantsRef = collection(db, 'restaurants');
        const q = query(restaurantsRef, where("slug", "==", restaurantSlug), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Este restaurante no existe o la URL no es correcta.');
          setLoading(false);
          return;
        }

        const restaurantDoc = querySnapshot.docs[0];
        const restaurantData = restaurantDoc.data() as Restaurant;
        const uid = restaurantDoc.id;
        setRestaurant(restaurantData);
        setRestaurantUid(uid);

        const restaurantDocRef = doc(db, 'restaurants', uid);
        try {
          await updateDoc(restaurantDocRef, { qrScans: increment(1) });
        } catch (scanError) {
          console.error("Failed to increment QR scan count: ", scanError);
        }

        const categoriesQuery = query(collection(db, 'restaurants', uid, 'categories'), orderBy('order', 'asc'));
        const categoriesSnap = await getDocs(categoriesQuery);
        const fetchedCategories = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(fetchedCategories);

        const menuItemsQuery = query(collection(db, 'restaurants', uid, 'menuItems'));
        const menuItemsSnap = await getDocs(menuItemsQuery);
        const fetchedItems = menuItemsSnap.docs
          .map(doc => {
            const data = doc.data();
            const allergenData = data.allergens || {};
            const contains: string[] = [];
            const traces: string[] = [];
            for (const key in allergenData) {
              if (allergenData[key] === 'yes') {
                contains.push(key);
              } else if (allergenData[key] === 'traces') {
                traces.push(key);
              }
            }
            return {
              id: doc.id,
              name: data.name,
              category: data.category,
              price: data.price,
              description: data.description,
              isAvailable: data.isAvailable,
              allergens: contains,
              traces: traces,
            } as MenuItem;
          })
          .filter(item => item.isAvailable);

        const grouped = fetchedItems.reduce((acc, item) => {
          const categoryName = item.category || 'Varios';
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(item);
          return acc;
        }, {} as GroupedMenu);
        setGroupedMenu(grouped);
      } catch (err) {
        console.error("Error al cargar el menú público: ", err);
        setError('No se pudo cargar la carta. Por favor, inténtalo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [restaurantSlug]);

  const { filteredGroupedMenu, incompatibleItemsByCategory } = useMemo(() => {
    if (selectedAllergens.length === 0) {
      return { filteredGroupedMenu: groupedMenu, incompatibleItemsByCategory: {} };
    }
    const filtered: GroupedMenu = {};
    const incompatible: GroupedMenu = {};
    for (const categoryName in groupedMenu) {
      const allItems = groupedMenu[categoryName];
      const compatibleItems: MenuItem[] = [];
      const incompatibleItems: MenuItem[] = [];
      allItems.forEach(item => {
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

  const orderedCategoryNames = useMemo(() => {
      const allCategoryNames = new Set([
        ...categories.map(c => c.name),
        ...Object.keys(groupedMenu)
      ]);
      const ordered = categories.map(c => c.name);
      const remaining = [...allCategoryNames].filter(name => !ordered.includes(name));
      return [...ordered, ...remaining].filter(name => 
          (filteredGroupedMenu[name] && filteredGroupedMenu[name].length > 0) ||
          (incompatibleItemsByCategory[name] && incompatibleItemsByCategory[name].length > 0)
      );
  }, [categories, groupedMenu, filteredGroupedMenu, incompatibleItemsByCategory]);

  if (loading || !restaurantUid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando carta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-destructive">Error</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <AllergenFilter
        isOpen={isFilterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        onFilterChange={setSelectedAllergens}
        restaurantUid={restaurantUid}
      />
      <header className="sticky top-0 z-40 w-full bg-white">
        <div className="flex h-20 max-w-5xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={`/menu/${restaurantSlug}`}>
            <Image src="/icon_alergenu.png" alt="Alergenu Logo" width={36} height={36} />
          </Link>
          <Button
            variant="outline"
            onClick={() => setFilterSheetOpen(true)}
            className="relative rounded-full text-base font-semibold text-gray-700 hover:bg-gray-100 px-4 py-2"
          >
            <Image src="/icons/web_icons/filtro_alergeno.svg" alt="Filtro" width={18} height={18} className="mr-2"/>
            Editar alergias
            {selectedAllergens.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#EA3939] text-xs font-bold text-white">
                {selectedAllergens.length}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <p className="text-base text-blue-600 mt-10">Bienvenido a la carta digital de</p>
          <h1 className="text-[40pt] font-bold tracking-tight text-gray-900 mt-1" style={{ fontFamily: 'Manrope', lineHeight: '110%' }}>
            {restaurant?.restaurantName || 'Restaurante'}
          </h1>
        </div>

        <div className="space-y-16 mt-10">
          {orderedCategoryNames.length > 0 ? (
              orderedCategoryNames.map(categoryName => {
                const compatibleItems = filteredGroupedMenu[categoryName] || [];
                const incompatibleItems = incompatibleItemsByCategory[categoryName] || [];
                const sectionId = categoryName.replace(/\s+/g, '-');

                return (
                  <section key={categoryName} id={sectionId}>
                    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
                      <h2 className="bg-blue-600 text-white text-2xl font-semibold px-4 sm:px-6 lg:px-4 py-4 tracking-normal">{categoryName}</h2>
                    </div>
                    <div className="space-y-6 mt-[40px]">
                      {compatibleItems.map(item => (
                        <div key={item.id} className="">
                          <div className="flex justify-between items-start gap-4 mt-[40px]">
                            <div className='flex-grow '>
                              <h3 className="font-semibold text-[14pt] text-gray-800 tracking-normal" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>{item.name}</h3>
                              {item.description && <p className="font-regular text-[13pt] text-gray-500 mt-1 tracking-regular" style={{ fontFamily: 'Manrope', lineHeight: '130%' }}>{item.description}</p>}
                            </div>
                            <p className="font-semibold text-[14pt] text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>{(item.price / 100).toFixed(2).replace('.', ',')}€</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.allergens?.map(id => <AllergenIconDisplay key={`${id}-contains`} allergenId={id} type="contains" />)}
                            {item.traces?.map(id => <AllergenIconDisplay key={`${id}-traces`} allergenId={id} type="traces" />)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {incompatibleItems.length > 0 && selectedAllergens.length > 0 && (
                      <Collapsible 
                        open={openIncompatible[sectionId] || false} 
                        onOpenChange={(isOpen) => setOpenIncompatible(prev => ({ ...prev, [sectionId]: isOpen }))}
                        className="mt-6 pt-6 border-t border-gray-200"
                      >
                        <CollapsibleTrigger className="flex items-center justify-start text-sm font-semibold w-full py-2 text-[#EA3939]">
                          Mostrar {incompatibleItems.length} plato(s) no compatible(s)
                          <ChevronDown className={`h-5 w-5 ml-1 transition-transform ${openIncompatible[sectionId] ? 'rotate-180' : ''}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4 space-y-6">
                          {incompatibleItems.map(item => (
                            <div key={item.id} className="opacity-60">
                              <div className="flex justify-between items-start gap-4 mt-[40px]">
                                <div className='flex-grow '>
                                  <h3 className="font-semibold text-[14pt] text-gray-800 tracking-normal" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>{item.name}</h3>
                                  {item.description && <p className="font-regular text-[13pt] text-gray-500 mt-1 tracking-regular" style={{ fontFamily: 'Manrope', lineHeight: '130%' }}>{item.description}</p>}
                                </div>
                                <p className="font-semibold text-[14pt] text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>{(item.price / 100).toFixed(2).replace('.', ',')}€</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 mt-3">
                                <span className="bg-[#EA3939] text-white text-xs font-bold mr-2 px-2 py-1 rounded-full">No apto</span>
                                <div className="flex flex-wrap items-center gap-2">
                                  {item.allergens?.map(id => <AllergenIconDisplay key={`${id}-contains`} allergenId={id} type="contains" isHighlighted={selectedAllergens.includes(id)} />)}
                                  {item.traces?.map(id => <AllergenIconDisplay key={`${id}-traces`} allergenId={id} type="traces" isHighlighted={selectedAllergens.includes(id)} />)}
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
                <h2 className="text-2xl font-semibold text-gray-800">Tu búsqueda no ha dado resultados</h2>
                <p className="mt-2 text-muted-foreground">No se han encontrado platos que coincidan con tus selecciones. Prueba a cambiar los filtros.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
