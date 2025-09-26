'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, collection, getDocs, query, where, limit, updateDoc, increment } from 'firebase/firestore';
import { Loader2, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AllergenFilter } from '@/components/menu/allergen-filter';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AllergenIconDisplay } from '@/components/menu/allergen-icon-display';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";


interface Restaurant {
  restaurantName: string;
  slug: string;
  coverImage?: string;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  allergens?: string[];
  traces?: string[];
  isAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
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

        // Increment QR scans
        const restaurantDocRef = doc(db, 'restaurants', uid);
        try {
          await updateDoc(restaurantDocRef, { qrScans: increment(1) });
        } catch (scanError) {
          console.error("Failed to increment QR scan count: ", scanError);
        }

        const categoriesQuery = query(collection(db, 'restaurants', uid, 'categories'));
        const categoriesSnap = await getDocs(categoriesQuery);
        const fetchedCategories = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        fetchedCategories.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(fetchedCategories);

        const menuItemsQuery = query(collection(db, 'restaurants', uid, 'menuItems'));
        const menuItemsSnap = await getDocs(menuItemsQuery);
        const fetchedItems = menuItemsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as MenuItem))
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
          (!item.allergens || item.allergens.every(allergen => !selectedAllergens.includes(allergen))) &&
          (!item.traces || item.traces.every(trace => !selectedAllergens.includes(trace)));

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
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-sm">
        <div className="container flex h-16 max-w-2xl items-center justify-between px-4">
          <Link href={`/menu/${restaurantSlug}`}>
            <Image src="/icon_alergenu.png" alt="Alergenu Logo" width={36} height={36} />
          </Link>
          <Button
            className="rounded-full relative text-base font-medium bg-gray-100 hover:bg-gray-200 text-gray-800"
            onClick={() => setFilterSheetOpen(true)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Mis alergias
            {selectedAllergens.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
                {selectedAllergens.length}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-sm">
          <Image
            src={restaurant?.coverImage || "https://www.ermo.es/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FDelibreads-1.70184391.jpg&w=2048&q=75"}
            alt={restaurant?.restaurantName || 'Restaurant'}
            width={800}
            height={500}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            {restaurant?.restaurantName || 'Restaurante'}
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Aquí tienes la carta de nuestro restaurante. Esperamos que disfrutes de tu elección.
          </p>
        </div>

        {orderedCategoryNames.length > 0 ? (
            orderedCategoryNames.map(categoryName => {
              const compatibleItems = filteredGroupedMenu[categoryName] || [];
              const incompatibleItems = incompatibleItemsByCategory[categoryName] || [];
              const sectionId = categoryName.replace(/\s+/g, '-');

              return (
                <section key={categoryName} id={sectionId} className="mb-12">
                  <h2 className="text-4xl font-bold tracking-tight text-gray-800 mb-6">{categoryName}</h2>
                  <div className="divide-y divide-gray-200">
                    {compatibleItems.map(item => (
                      <div key={item.id} className="py-6">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium uppercase tracking-normal text-gray-800">{item.name}</h3>
                          <p className="text-lg font-semibold text-gray-800 whitespace-nowrap pl-4">{item.price.toFixed(2).replace('.', ',')}€</p>
                        </div>
                        {item.description && <p className="text-base text-gray-500 mt-1">{item.description}</p>}
                        <div className="flex flex-wrap gap-2 mt-4">
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
                      className="-mt-4 pt-6 border-t border-gray-200"
                    >
                      <CollapsibleTrigger className="flex items-center justify-start text-sm text-red-600 font-medium w-full py-2">
                        Mostrar {incompatibleItems.length} plato(s) no compatible(s)
                        <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${openIncompatible[sectionId] ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="-mx-4">
                        {incompatibleItems.map(item => (
                          <div key={item.id} className="py-6 px-4 bg-gray-50/80 opacity-70">
                             <div className="flex justify-between items-start">
                                <h3 className="text-lg font-medium uppercase tracking-normal text-gray-700">{item.name}</h3>
                                <p className="text-lg font-semibold text-gray-700 whitespace-nowrap pl-4">{item.price.toFixed(2).replace('.', ',')}€</p>
                              </div>
                            {item.description && <p className="text-base text-gray-500 mt-1">{item.description}</p>}
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/20">
                                  NO APTO
                                </span>
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
          <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800">Tu búsqueda no ha dado resultados</h2>
              <p className="mt-2 text-muted-foreground">No se han encontrado platos que coincidan con tus selecciones. Prueba a cambiar los filtros.</p>
          </div>
        )}
      </main>
    </div>
  );
}
