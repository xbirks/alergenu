'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Restaurant, Category, MenuItem as MenuItemType, Allergen } from '@/lib/types';
import { AllergenSelector, StaticAllergenIcon } from '@/components/lilunch/AllergenSelector';
import { CategoryTabs } from '@/components/lilunch/CategoryTabs';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
  es: {
    welcome: 'Aquí tienes la carta de nuestro restaurante. ¡Disfrútala!',
    emptyMenuTitle: 'Carta no disponible',
    emptyMenuSubtitle: 'El menú de este restaurante aún no está listo. ¡Vuelve a consultar más tarde!',
    showIncompatible: 'Mostrar',
    hideIncompatible: 'Ocultar',
    incompatiblePlates: 'plato(s) no compatibles',
    notFit: 'No apto',
    developedWith: 'Desarrollado con',
    language: 'Idioma',
    errorTitle: 'Error de Carga',
    errorMessage: 'No se pudo cargar el menú en el idioma solicitado. Por favor, inténtalo de nuevo.',
  },
  en: {
    welcome: 'Here is our restaurant\'s menu. Enjoy it!',
    emptyMenuTitle: 'Menu not available',
    emptyMenuSubtitle: 'This restaurant\'s menu is not ready yet. Please check back later!',
    showIncompatible: 'Show',
    hideIncompatible: 'Hide',
    incompatiblePlates: 'incompatible dish(es)',
    notFit: 'Not suitable',
    developedWith: 'Powered by',
    language: 'Language',
    errorTitle: 'Loading Error',
    errorMessage: 'Could not load the menu in the requested language. Please try again.',
  }
};

interface PublicMenuClientProps {
  restaurant: Restaurant;
  restaurantId: string;
  initialCategories: Category[];
  initialItems: MenuItemType[];
  customAllergens: Allergen[];
  initialLang: string;
}

export default function PublicMenuClient({
  restaurant,
  restaurantId,
  initialCategories,
  initialItems,
  customAllergens,
  initialLang
}: PublicMenuClientProps) {
  const [lang, setLang] = useState(initialLang);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [items, setItems] = useState<MenuItemType[]>(initialItems);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [hiddenCategories, setHiddenCategories] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useMemo(() => translations[lang as keyof typeof translations] || translations.es, [lang]);

  const handleLangChange = async (newLang: string) => {
    if (newLang === lang || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/menu/${restaurantId}?lang=${newLang}`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      
      if (!data || !Array.isArray(data.categories) || !Array.isArray(data.items)) {
        throw new Error('Invalid data structure from API');
      }

      setCategories(data.categories);
      setItems(data.items);
      setLang(newLang); 
    } catch (e) {
      console.error('Language switch failed:', e);
      const errorLang = translations[lang as keyof typeof translations] || translations.es;
      setError(errorLang.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const menuByCategory = useMemo(() => {
    return items.reduce((acc, item) => {
      const categoryId = item.categoryId || 'uncategorized';
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(item);
      return acc;
    }, {} as Record<string, MenuItemType[]>);
  }, [items]);

  const isAllergenPresent = (item: MenuItemType) => 
    selectedAllergens.length > 0 && 
    Object.keys(item.allergens ?? {}).some(a => selectedAllergens.includes(a));

  const handleToggleCategoryVisibility = (category: string) => {
    setHiddenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  }

  const getTranslated = (field: any, lang: string) => {
      if (typeof field === 'object' && field !== null) {
          return field[lang] || field.es || '';
      }
      return field || '';
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price / 100);
  }

  const sortedCategories = useMemo(() => 
      [...categories].sort((a, b) => a.order - b.order),
  [categories]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="relative h-48 bg-gray-800">
        <Image 
          src={restaurant.coverImageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop"}
          alt={`Imagen de ${restaurant.restaurantName}`}
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
            <h1 className="text-4xl font-bold tracking-tight">{restaurant.restaurantName}</h1>
            <p className="mt-2 text-lg max-w-2xl">{t.welcome}</p>
        </div>
      </header>
      
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white border-b sticky top-0 z-20 gap-4">
        <AllergenSelector 
          selectedAllergens={selectedAllergens} 
          onSelectionChange={setSelectedAllergens}
          allergens={customAllergens}
          lang={lang}
        />
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">{t.language}:</span>
            <Button size="sm" variant={lang === 'es' ? 'default' : 'outline'} onClick={() => handleLangChange('es')} className="rounded-full">ES</Button>
            <Button size="sm" variant={lang === 'en' ? 'default' : 'outline'} onClick={() => handleLangChange('en')} className="rounded-full">EN</Button>
        </div>
      </div>

      <CategoryTabs categories={sortedCategories.map(c => ({...c, name: getTranslated(c.name_i18n, lang)}))} onSelectCategory={() => {}} />

      <main className="p-4">
        {loading ? (
            <div className="flex justify-center items-center py-16"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>
        ) : error ? (
             <div className="text-center py-16 px-4 bg-red-50 rounded-lg">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
                <h2 className="mt-4 text-xl font-bold text-red-800">{t.errorTitle}</h2>
                <p className="mt-2 text-red-600">{error}</p>
            </div>
        ) : Object.keys(menuByCategory).length === 0 ? (
            <div className="text-center py-16 px-4">
              <h2 className="text-2xl font-semibold text-gray-700">{t.emptyMenuTitle}</h2>
              <p className="text-md text-gray-500 mt-2">{t.emptyMenuSubtitle}</p>
            </div>
        ) : sortedCategories.map(category => {
          const categoryItems = menuByCategory[category.id] || [];
          if (categoryItems.length === 0) return null;

          const compatibleItems = categoryItems.filter(item => !isAllergenPresent(item));
          const nonCompatibleItems = categoryItems.filter(item => isAllergenPresent(item));
          
          return (
            <section key={category.id} id={getTranslated(category.name_i18n, lang)} className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 tracking-tight">{getTranslated(category.name_i18n, lang)}</h2>
              <div className="space-y-4">
                {compatibleItems.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-transparent hover:shadow-md transition-shadow">
                     <div className="flex justify-between font-bold">
                        <h3 className="text-lg text-gray-800">{getTranslated(item.name_i18n, lang)}</h3>
                        <p className="text-lg text-gray-900">{formatPrice(item.price)}</p>
                     </div>
                     {getTranslated(item.description_i18n, lang) && <p className="text-gray-600 text-sm mt-1">{getTranslated(item.description_i18n, lang)}</p>}
                     {Object.keys(item.allergens || {}).length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {Object.keys(item.allergens).map(id => <StaticAllergenIcon key={id} allergenId={id} customAllergens={customAllergens} lang={lang} />)}
                        </div>
                     )}
                  </div>
                ))}
                
                {nonCompatibleItems.length > 0 && (
                  <div>
                    <Button variant="link" className="text-red-600 p-0 h-auto hover:text-red-800" onClick={() => handleToggleCategoryVisibility(category.id)}>
                      {hiddenCategories[category.id] ? t.showIncompatible : t.hideIncompatible} {nonCompatibleItems.length} {t.incompatiblePlates}
                    </Button>
                    {!hiddenCategories[category.id] && nonCompatibleItems.map(item => (
                      <div key={item.id} className="bg-red-50/70 p-4 rounded-lg mt-2 opacity-80 border-l-4 border-red-400">
                        <div className="flex justify-between font-bold">
                            <h3 className="text-lg text-gray-500 line-through">{getTranslated(item.name_i18n, lang)}</h3>
                            <p className="text-lg text-gray-700">{formatPrice(item.price)}</p>
                        </div>
                        <div className="text-sm font-semibold text-red-600 mt-1">{t.notFit}</div>
                        {Object.keys(item.allergens || {}).length > 0 && (
                            <div className="flex gap-2 mt-3 items-center">
                              {Object.keys(item.allergens).map(id => (
                                  <div key={id} className={cn('transition-transform', selectedAllergens.includes(id) ? 'text-red-500 scale-110' : 'text-gray-400')}>
                                    <StaticAllergenIcon allergenId={id} customAllergens={customAllergens} lang={lang} />
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
          <p className="text-sm text-gray-500">{t.developedWith} <a href='https://lilunch.com' target='_blank' rel='noopener noreferrer' className="text-blue-600 font-bold hover:underline">LiLunch</a></p>
      </footer>
    </div>
  );
}
