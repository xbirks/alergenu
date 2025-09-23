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

export function Menu({ restaurant }: { restaurant: Restaurant }) {
  const { selectedAllergens, isLoaded } = useAllergenProfile();

  const categorizedMenu = useMemo(() => {
    if (!isLoaded) return null;

    return restaurant.menu.map(category => {
      const compatibleItems: MenuItem[] = [];
      const incompatibleItems: MenuItem[] = [];
      
      category.items.forEach(item => {
        const isIncompatible = item.allergens.some(a => selectedAllergens.has(a)) || item.traces.some(a => selectedAllergens.has(a));
        if (isIncompatible && selectedAllergens.size > 0) {
          incompatibleItems.push(item);
        } else {
          compatibleItems.push(item);
        }
      });

      return {
        ...category,
        compatibleItems,
        incompatibleItems,
        hasContent: category.items.length > 0,
      };
    });
  }, [restaurant.menu, selectedAllergens, isLoaded]);

  if (!isLoaded || !categorizedMenu) {
    return (
      <div className="container space-y-8 px-4 sm:px-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-1/3 rounded-lg" />
            <div className="flex flex-col">
              {[1, 2, 3].map(j => (
                 <div key={j} className="py-4">
                  <div className="flex justify-between items-start gap-4">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-4 w-3/4 mt-2" />
                  <Separator className="mt-4" />
                 </div>
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

        const compatibleCards = category.compatibleItems.map(item => <MenuItemCard key={item.id} item={item} status="compatible" />);
        const incompatibleCards = category.incompatibleItems.map(item => <MenuItemCard key={item.id} item={item} status="incompatible" />);
        
        return (
        <section key={category.id} id={category.id} className="space-y-4 pt-4 -mt-4">
          <h2 className="text-3xl font-bold tracking-tight">{category.name}</h2>
          
          <div className="flex flex-col">
            {compatibleCards.length > 0 ? compatibleCards : null}
            
            {incompatibleCards.length > 0 && selectedAllergens.size > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="incompatible" className="border-none">
                   <Separator />
                  <Alert variant="destructive" className="p-0 border-none rounded-none bg-background hover:bg-muted/50 transition-colors">
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline justify-start gap-2 font-semibold">
                      <span>{`Mostrar ${incompatibleCards.length} plato(s) no compatibles`}</span>
                    </AccordionTrigger>
                  </Alert>
                  <AccordionContent>
                    <div className="flex flex-col">
                       <Separator />
                      {incompatibleCards}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {(compatibleCards.length > 0) && <Separator className="mt-0" />}

            {compatibleCards.length === 0 && selectedAllergens.size > 0 && incompatibleCards.length > 0 &&(
               <div className="border-dashed border-2 rounded-2xl text-center my-4">
                 <div className="p-6">
                   <Info className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                   <p className="text-muted-foreground font-medium">No hay platos compatibles en esta categoría para tu selección de alérgenos.</p>
                   <p className="text-muted-foreground text-sm mt-1">Consulta al personal para posibles adaptaciones.</p>
                 </div>
               </div>
            )}
          </div>
          {category.hasContent && <Separator />}
        </section>
      )})}

      <Card className="bg-muted/50 rounded-2xl shadow-none border-none">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold tracking-tight text-left mb-6 uppercase">Leyenda de Alérgenos</h3>
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
