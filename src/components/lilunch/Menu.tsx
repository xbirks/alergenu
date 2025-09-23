'use client';

import { useMemo } from 'react';
import { Restaurant, MenuItem, MenuCategory } from '@/lib/types';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { MenuItemCard } from './MenuItemCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, ShieldAlert, ShieldX } from 'lucide-react';
import { allergenMap } from '@/lib/allergens';
import { Skeleton } from '@/components/ui/skeleton';

type CategorizedItem = {
  item: MenuItem;
  status: 'compatible' | 'precaution' | 'incompatible';
  blockingAllergens?: string[];
};

export function Menu({ restaurant }: { restaurant: Restaurant }) {
  const { selectedAllergens, isLoaded } = useAllergenProfile();

  const categorizedMenu = useMemo(() => {
    if (!isLoaded) return null;

    return restaurant.menu.map(category => {
      const items = category.items.map(item => {
        const incompatibleAllergens = item.allergens.filter(a => selectedAllergens.has(a));
        if (incompatibleAllergens.length > 0) {
          return { item, status: 'incompatible', blockingAllergens: incompatibleAllergens } as CategorizedItem;
        }

        const precautionAllergens = item.traces.filter(a => selectedAllergens.has(a));
        if (precautionAllergens.length > 0) {
          return { item, status: 'precaution' } as CategorizedItem;
        }

        return { item, status: 'compatible' } as CategorizedItem;
      });

      return {
        ...category,
        compatible: items.filter(i => i.status === 'compatible'),
        precaution: items.filter(i => i.status === 'precaution'),
        incompatible: items.filter(i => i.status === 'incompatible'),
      };
    });
  }, [restaurant.menu, selectedAllergens, isLoaded]);

  if (!isLoaded || !categorizedMenu) {
    return (
      <div className="container space-y-8 px-4 sm:px-6">
        {[1, 2].map(i => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-10 w-1/3 rounded-lg" />
            <div className="space-y-4">
              {[1, 2, 3].map(j => (
                 <Skeleton key={j} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getIncompatibleTriggerText = (items: CategorizedItem[]): string => {
    const allBlockingAllergens = new Set<string>();
    items.forEach(i => i.blockingAllergens?.forEach(a => allBlockingAllergens.add(a)));
    const allergenNames = Array.from(allBlockingAllergens).map(id => allergenMap.get(id)?.name);
    if (allergenNames.length === 0) return "Contiene tus alérgenos";
    return `Contiene ${allergenNames.slice(0, 2).join(', ')}${allergenNames.length > 2 ? ' y más' : ''}`;
  }

  return (
    <div className="container space-y-10 px-4 sm:px-6">
      {categorizedMenu.map(category => (
        <section key={category.id} className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">{category.name}</h2>
          
          {category.compatible.length > 0 && (
            <div className="space-y-4">
              <div className="grid gap-4">
                {category.compatible.map(({ item }) => <MenuItemCard key={item.id} item={item} status="compatible" />)}
              </div>
            </div>
          )}

          {category.precaution.length > 0 && (
             <Accordion type="single" collapsible className="w-full space-y-4">
               <AccordionItem value="precaution" className="border-none">
                <Alert variant="default" className="bg-warning/10 border-warning/50 rounded-lg">
                  <AccordionTrigger className="w-full p-0 hover:no-underline justify-start gap-2">
                    <ShieldAlert className="h-5 w-5 text-warning" />
                    <AlertTitle className="text-amber-800 dark:text-amber-300 font-semibold">Usar con precaución</AlertTitle>
                  </AccordionTrigger>
                </Alert>
                <AccordionContent className="pt-4">
                   <div className="grid gap-4">
                    {category.precaution.map(({ item }) => <MenuItemCard key={item.id} item={item} status="precaution" />)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

           {category.incompatible.length > 0 && (
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="incompatible" className="border-none">
                <Alert variant="destructive" className="rounded-lg">
                  <AccordionTrigger className="w-full p-0 hover:no-underline justify-start gap-2">
                      <ShieldX className="h-5 w-5" />
                      <AlertTitle>{getIncompatibleTriggerText(category.incompatible)}</AlertTitle>
                  </AccordionTrigger>
                </Alert>
                <AccordionContent className="pt-4">
                   <div className="grid gap-4">
                    {category.incompatible.map(({ item }) => <MenuItemCard key={item.id} item={item} status="incompatible" />)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {category.compatible.length === 0 && category.precaution.length === 0 && category.incompatible.length > 0 && selectedAllergens.size > 0 && (
             <p className="text-muted-foreground text-center py-4">No hay platos compatibles en esta categoría según tu perfil.</p>
          )}

        </section>
      ))}
    </div>
  );
}
