'use client';

import { useState } from 'react';
import type { Restaurant, MenuItem } from '@/lib/types';
import { AllergenSelector, StaticAllergenIcon } from '@/components/lilunch/AllergenSelector';
import { CategoryTabs } from '@/components/lilunch/CategoryTabs';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface GroupedMenu {
  [category: string]: MenuItem[];
}

interface PublicMenuClientProps {
  restaurant: Restaurant;
  menu: GroupedMenu;
}

export default function PublicMenuClient({ restaurant, menu }: PublicMenuClientProps) {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [hiddenCategories, setHiddenCategories] = useState<Record<string, boolean>>({});

  const categories = Object.keys(menu);

  const isAllergenPresent = (item: MenuItem) => 
    selectedAllergens.length > 0 && item.allergens?.some(a => selectedAllergens.includes(a));

  const handleToggleCategoryVisibility = (category: string) => {
    setHiddenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="relative h-48">
        <Image 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop"
          alt={`Imagen de ${restaurant.restaurantName}`}
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
            <h1 className="text-4xl font-bold">{restaurant.restaurantName}</h1>
            <p className="mt-2 text-lg">Aquí tienes la carta de nuestro restaurante. ¡Disfrútala!</p>
        </div>
      </header>
      
      <div className="flex justify-between items-center p-4 bg-white border-b sticky top-0 z-20">
        <AllergenSelector selectedAllergens={selectedAllergens} onSelectionChange={setSelectedAllergens} />
        <div></div>
      </div>

      <CategoryTabs categories={categories} onSelectCategory={() => {}} />

      <main className="p-4">
        {Object.keys(menu).length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500">La carta de este restaurante aún no está disponible.</p>
              <p className="text-sm text-gray-400 mt-2">¡Vuelve a consultar más tarde!</p>
            </div>
        ) : categories.map(category => {
          const compatibleItems = menu[category].filter(item => !isAllergenPresent(item));
          const nonCompatibleItems = menu[category].filter(item => isAllergenPresent(item));
          
          return (
            <section key={category} id={category} className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <div className="space-y-4">
                {compatibleItems.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-transparent">
                     <div className="flex justify-between font-bold">
                        <h3 className="text-lg">{item.name}</h3>
                        <p className="text-lg">{item.price.toFixed(2)}€</p>
                     </div>
                     {item.description && <p className="text-gray-600 text-sm mt-1">{item.description}</p>}
                     {item.allergens && item.allergens.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {item.allergens.map(id => <StaticAllergenIcon key={id} id={id} className="h-5 w-5 text-gray-400" />)}
                        </div>
                     )}
                  </div>
                ))}
                
                {nonCompatibleItems.length > 0 && (
                  <div>
                    <Button variant="link" className="text-red-500 p-0 h-auto" onClick={() => handleToggleCategoryVisibility(category)}>
                      {hiddenCategories[category] ? 'Mostrar' : 'Ocultar'} {nonCompatibleItems.length} plato(s) no compatibles
                    </Button>
                    {!hiddenCategories[category] && nonCompatibleItems.map(item => (
                      <div key={item.id} className="bg-red-50/50 p-4 rounded-lg mt-2 opacity-70 border-l-4 border-red-500">
                        <div className="flex justify-between font-bold">
                            <h3 className="text-lg text-gray-700 line-through">{item.name}</h3>
                            <p className="text-lg text-gray-800">{item.price.toFixed(2)}€</p>
                        </div>
                        {item.description && <p className="text-gray-600 text-sm mt-1">{item.description}</p>}
                        {item.allergens && item.allergens.length > 0 && (
                            <div className="flex gap-2 mt-2 items-center">
                              {item.allergens.map(id => (
                                  <div key={id} className={`${selectedAllergens.includes(id) ? 'text-red-500 scale-110' : 'text-gray-400'}`}>
                                    <StaticAllergenIcon id={id} className="h-5 w-5" />
                                  </div>
                              ))}
                            </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </main>
       <footer className="text-center py-6 mt-8 border-t bg-white">
          <p className="text-sm text-gray-500">Desarrollado con <span className="text-blue-600 font-bold">LiLunch</span></p>
      </footer>
    </div>
  );
}
