'use client';

import { useMemo } from 'react';
import { Restaurant, MenuItem } from '@/lib/types';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { MenuItemCard } from './MenuItemCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { ALLERGENS } from '@/lib/allergens';
import { Skeleton } from '@/components/ui/skeleton';
import { AllergenIcon } from './AllergenIcon';
import { Separator } from '../ui/separator';
import { Card, CardContent } from '../ui/card';
import { allergenColors } from './colors';
import { cn } from '@/lib/utils';

type CategorizedItem = {
  item: MenuItem;
  status: 'compatible' | 'incompatible';
  blockingAllergens?: string[];
};

export function Menu({ restaurant }: { restaurant: Restaurant }) {
  const { selectedAllergens, isLoaded } = useAllergenProfile();

  const categorizedMenu = useMemo(() => {
    if (!isLoaded || !restaurant) return null;

    return restaurant.menu.map(category => {
      const compatibleItems: CategorizedItem[] = [];
      const incompatibleItems: CategorizedItem[] = [];

      category.items.forEach(item => {
        const incompatibleDirect = item.allergens.filter(a => selectedAllergens.has(a));
        const incompatibleTraces = item.traces.filter(a => selectedAllergens.has(a));
        const blockingAllergens = [...new Set([...incompatibleDirect, ...incompatibleTraces])];

        if (blockingAllergens.length > 0) {
          incompatibleItems.push({ item, status: 'incompatible', blockingAllergens });
        } else {
          compatibleItems.push({ item, status: 'compatible' });
        }
      });
      
      return {
        ...category,
        compatible: compatibleItems,
        incompatible: incompatibleItems,
        hasContent: compatibleItems.length > 0 || incompatibleItems.length > 0,
      };
    });
  }, [restaurant, selectedAllergens, isLoaded]);

  if (!isLoaded || !categorizedMenu) {
    return (
      <div className="container space-y-8 px-4 sm:px-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-4 pt-8">
            <Skeleton className="h-10 w-1/3 rounded-lg" />
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map(j => (
                 <Skeleton key={j} className="h-24 w-full rounded-none" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container space-y-6 px-4 sm:px-6">
      {categorizedMenu.map(category => {
        if (!category.hasContent) return null;

        const isDrinks = category.id === 'drinks';
        const isWines = category.id === 'wines';
        
        return (
        <section 
          key={category.id} 
          id={category.id} 
          className={cn(
            "space-y-4 scroll-mt-24 pt-8",
            (isDrinks || isWines) && "px-6 py-8 -mx-4 sm:-mx-6 rounded-3xl",
            isDrinks && "bg-gray-900 text-white",
            isWines && "bg-rose-50"
          )}
        >
          <h2 className="text-2xl font-bold tracking-tight">{category.name}</h2>
          
          <div className="flex flex-col">
            {category.compatible.map(({ item }) => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                status="compatible" 
                isDark={isDrinks}
              />
            ))}
            
            {category.incompatible.length > 0 && selectedAllergens.size > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="incompatible" className="border-none">
                  <Alert variant="destructive" className={cn(
                    "p-0 border-none rounded-none transition-colors",
                     isDrinks ? "bg-gray-900 hover:bg-gray-800" : "bg-background hover:bg-muted/50"
                  )}>
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline justify-start gap-2 font-medium">
                      <span className={cn(
                          "text-destructive underline underline-offset-2 decoration-destructive/50", 
                          isDrinks && "text-red-400 decoration-red-400/50"
                        )}
                      >
                        {`Mostrar ${category.incompatible.length} plato(s) no compatibles`}
                      </span>
                    </AccordionTrigger>
                  </Alert>
                  <AccordionContent>
                    <div className="flex flex-col mt-4">
                      {category.incompatible.map(({ item }) => (
                        <MenuItemCard 
                          key={item.id} 
                          item={item} 
                          status="incompatible"
                          isDark={isDrinks}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            
            {category.compatible.length === 0 && selectedAllergens.size > 0 && (
              <div className="border-dashed border-2 rounded-2xl text-center my-4">
                  <div className="p-6">
                    <Info className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground font-medium">No hay platos compatibles en esta categoría para tu selección de alérgenos.</p>
                    <p className="text-muted-foreground text-sm mt-1">Consulta al personal para posibles adaptaciones.</p>
                  </div>
                </div>
            )}
          </div>

        </section>
      )})}


      <Separator className="my-8" />

      <Card className="bg-muted/50 rounded-2xl shadow-none border-none">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold tracking-tight text-left mb-6 uppercase">Leyenda de Alérgenos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-5">
            {ALLERGENS.map(allergen => (
              <div key={allergen.id} className="flex items-center gap-3">
                <AllergenIcon 
                  allergenId={allergen.id}
                  className={cn(allergenColors[allergen.id], 'rounded-md')}
                  iconClassName="size-4"
                />
                <span className="font-medium text-sm">{allergen.name}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground text-sm pt-8">
            <div className="w-5 h-5 border-dashed border-2 border-muted-foreground rounded-md flex-shrink-0" />
            <span>Indica que un plato puede contener trazas.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
