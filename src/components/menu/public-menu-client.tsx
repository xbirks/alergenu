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

  const orderedCategoryNames = useMemo(() => {
    const categoryOrder = initialCategories.map(c => c.name);
    const allKnownCategories = new Set([...categoryOrder, ...Object.keys(groupedMenu)]);
    const ordered = categoryOrder.filter(name => allKnownCategories.has(name));
    const remaining = [...allKnownCategories].filter(name => !categoryOrder.includes(name)).sort();
    return [...ordered, ...remaining].filter(name => 
        (filteredGroupedMenu[name] && filteredGroupedMenu[name].length > 0) ||
        (incompatibleItemsByCategory[name] && incompatibleItemsByCategory[name].length > 0)
    );
  }, [initialCategories, groupedMenu, filteredGroupedMenu, incompatibleItemsByCategory]);
  
  return (
    <div className="bg-white min-h-screen font-sans">
      <AllergenFilter
        isOpen={isFilterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        onFilterChange={setSelectedAllergens}
        restaurantUid={restaurantId}
      />
      <header className="sticky top-0 z-40 w-full bg-white">
        <div className="flex h-20 max-w-5xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={`/menu/${restaurant.slug}`}>
            <Image src="/icon_alergenu.png" alt="Alergenu Logo" width={36} height={36} className="flex-shrink-0" />
          </Link>
          <Button
            variant="outline"
            onClick={() => setFilterSheetOpen(true)}
            className="relative rounded-full text-base font-semibold text-gray-700 hover:bg-gray-100 px-4 py-2"
          >
            <Image src="/icons/web_icons/filtro_alergeno.svg" alt="Filtro" width={18} height={18} className="mr-2"/>
            Editar alergias
            {hasMounted && selectedAllergens.length > 0 && (
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
            {restaurant.restaurantName || 'Restaurante'}
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
                      {compatibleItems.map((item: MenuItem) => (
                        <div key={item.id} className="">
                          <div className="flex justify-between items-start gap-4 mt-[40px]">
                            <div className='flex-grow '>
                              <h3 className="font-semibold text-[14pt] text-gray-800 tracking-normal" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>{item.name}</h3>
                              {item.description && <p className="font-regular text-[13pt] text-gray-500 mt-1 tracking-regular" style={{ fontFamily: 'Manrope', lineHeight: '130%' }}>{item.description}</p>}
                            </div>
                            <p className="font-semibold text-[14pt] text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>{(item.price / 100).toFixed(2).replace('.', ',')}€</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.allergens?.map((id: string) => <AllergenIconDisplay key={`${id}-contains`} allergenId={id} type="contains" />)}
                            {item.traces?.map((id: string) => <AllergenIconDisplay key={`${id}-traces`} allergenId={id} type="traces" />)}
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
                          Mostrar {incompatibleItems.length} plato(s) no compatible(s)
                          <ChevronDown className={`h-5 w-5 ml-1 transition-transform ${openIncompatible[sectionId] ? 'rotate-180' : ''}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4 space-y-6">
                          {incompatibleItems.map((item: MenuItem) => (
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
                                  {item.allergens?.map((id: string) => <AllergenIconDisplay key={`${id}-contains`} allergenId={id} type="contains" isHighlighted={selectedAllergens.includes(id)} />)}
                                  {item.traces?.map((id: string) => <AllergenIconDisplay key={`${id}-traces`} allergenId={id} type="traces" isHighlighted={selectedAllergens.includes(id)} />)}
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
