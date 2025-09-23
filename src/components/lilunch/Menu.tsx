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
      <div className="space-y-8">
        {[1, 2].map(i => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <div className="grid gap-6">
              {[1, 2].map(j => (
                 <Skeleton key={j} className="h-48 w-full rounded-2xl" />
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
    if (allergenNames.length === 0) return "Contains your allergens";
    return `Contains ${allergenNames.slice(0, 2).join(', ')}${allergenNames.length > 2 ? ' and more' : ''}`;
  }

  return (
    <div className="space-y-12">
      {categorizedMenu.map(category => (
        <section key={category.id} className="space-y-6">
          <h2 className="font-headline text-3xl font-semibold border-b pb-4">{category.name}</h2>
          
          {category.compatible.length > 0 && (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">Compatible</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                  These items don't contain your selected allergens.
                </AlertDescription>
              </Alert>
              <div className="grid gap-6">
                {category.compatible.map(({ item }) => <MenuItemCard key={item.id} item={item} status="compatible" />)}
              </div>
            </div>
          )}

          {category.precaution.length > 0 && (
             <div className="space-y-4">
              <Alert variant="default" className="bg-warning/5 border-warning/50">
                <ShieldAlert className="h-4 w-4 text-warning" />
                <AlertTitle className="text-amber-800 dark:text-amber-300">Use Precaution</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-400">
                  These items may contain traces of your selected allergens.
                </AlertDescription>
              </Alert>
              <div className="grid gap-6">
                {category.precaution.map(({ item }) => <MenuItemCard key={item.id} item={item} status="precaution" />)}
              </div>
            </div>
          )}

           {category.incompatible.length > 0 && (
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="incompatible" className="border-b-0">
                <Alert variant="destructive" className="rounded-b-none">
                  <AccordionTrigger className="w-full p-0 hover:no-underline">
                      <div className="flex items-center">
                        <ShieldX className="h-4 w-4 mr-2" />
                        <AlertTitle>{getIncompatibleTriggerText(category.incompatible)}</AlertTitle>
                      </div>
                  </AccordionTrigger>
                </Alert>
                <AccordionContent>
                   <div className="grid gap-6 pt-6">
                    {category.incompatible.map(({ item }) => <MenuItemCard key={item.id} item={item} status="incompatible" />)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {category.compatible.length === 0 && category.precaution.length === 0 && category.incompatible.length === 0 && (
             <p className="text-muted-foreground">No items in this category.</p>
          )}

        </section>
      ))}
    </div>
  );
}
