'use client';

import { useMemo, useState } from 'react';
import { Restaurant, MenuItem } from '@/lib/types';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { MenuItemCard } from './MenuItemCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { ShieldX, Info, CheckCircle2 } from 'lucide-react';
import { allergenMap, ALLERGENS } from '@/lib/allergens';
import { Skeleton } from '@/components/ui/skeleton';
import { AllergenIcon } from './AllergenIcon';
import { Separator } from '../ui/separator';
import { Card, CardContent } from '../ui/card';
import { allergenColors } from './colors';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

type CategorizedItem = {
  item: MenuItem;
  status: 'compatible' | 'incompatible';
  blockingAllergens?: string[];
};

export function Menu({ restaurant }: { restaurant: Restaurant }) {
  const { selectedAllergens, isLoaded } = useAllergenProfile();
  const [showAll, setShowAll] = useState(false);

  const categorizedMenu = useMemo(() => {
    if (!isLoaded) return null;

    return restaurant.menu.map(category => {
      const items = category.items.map(item => {
        const incompatibleDirect = item.allergens.filter(a => selectedAllergens.has(a));
        const incompatibleTraces = item.traces.filter(a => selectedAllergens.has(a));
        const blockingAllergens = [...new Set([...incompatibleDirect, ...incompatibleTraces])];

        if (blockingAllergens.length > 0) {
          return { item, status: 'incompatible', blockingAllergens } as CategorizedItem;
        }

        return { item, status: 'compatible' } as CategorizedItem;
      });

      const compatible = items.filter(i => i.status === 'compatible');
      const incompatible = items.filter(i => i.status === 'incompatible');

      return {
        ...category,
        compatible,
        incompatible,
        hasContent: compatible.length > 0 || incompatible.length > 0,
      };
    });
  }, [restaurant.menu, selectedAllergens, isLoaded]);

  if (!isLoaded || !categorizedMenu) {
    return (
      <div className="container space-y-8 px-4 sm:px-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-10 w-1/3 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(j => (
                 <Skeleton key={j} className="h-32 w-full rounded-2xl" />
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
    
    const allergensWithTraces = Array.from(allBlockingAllergens).map(allergenId => {
        const hasDirect = items.some(i => i.item.allergens.includes(allergenId));
        const hasTraces = items.some(i => i.item.traces.includes(allergenId) && !i.item.allergens.includes(allergenId));
        
        let text = allergenMap.get(allergenId)?.name;
        if (hasDirect && hasTraces) {
            text += ' y trazas';
        } else if (hasTraces && !hasDirect) {
            text += ' (trazas)';
        }
        return text;
    });

    if (allergensWithTraces.length > 2) {
        return `Contiene ${allergensWithTraces.slice(0, 2).join(', ')} y más`;
    }
    
    return `Contiene ${allergensWithTraces.join(', ')}`;
  }

  return (
    <div className="container space-y-4 px-4 sm:px-6">
      {categorizedMenu.map(category => {
        if (!category.hasContent) return null;

        const originalItems = restaurant.menu.find(c => c.id === category.id)?.items || [];
        const allItems = [...category.compatible, ...category.incompatible].sort((a,b) => originalItems.indexOf(a.item) - originalItems.indexOf(b.item));

        return (
        <section key={category.id} id={category.id} className="space-y-4 pt-4 -mt-4">
            <div className="flex items-start gap-3 mb-2">
                {selectedAllergens.size === 0 ? (
                    <div className="w-6 h-6" />
                ) : category.incompatible.length === 0 ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                ) : (
                    <ShieldX className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                )}
                <h2 className="text-3xl font-bold tracking-tight">{category.name}</h2>
            </div>
          
          {showAll ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allItems.map(({ item, status }) => <MenuItemCard key={item.id} item={item} status={status} />)}
              </div>
          ) : (
            <>
            {category.compatible.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.compatible.map(({ item }) => <MenuItemCard key={item.id} item={item} status="compatible" />)}
                </div>
            )}

            {category.incompatible.length > 0 && (
              <Accordion type="single" collapsible className="w-full" disabled={selectedAllergens.size === 0}>
                <AccordionItem value="incompatible" className="border-none">
                  <Alert variant="destructive" className="p-0 border-none rounded-2xl">
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline justify-start gap-2">
                        <ShieldX className="h-4 w-4" />
                        <AlertTitle>{getIncompatibleTriggerText(category.incompatible)}</AlertTitle>
                    </AccordionTrigger>
                  </Alert>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {category.incompatible.map(({ item }) => <MenuItemCard key={item.id} item={item} status="incompatible" />)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            
            {category.compatible.length === 0 && selectedAllergens.size > 0 && (
              <Card className="border-dashed border-2 rounded-2xl text-center shadow-none my-4 md:col-span-2">
                  <CardContent className="p-6">
                    <Info className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground font-medium">No hay platos compatibles en esta categoría para tu selección de alérgenos.</p>
                    <p className="text-muted-foreground text-sm mt-1">Consulta al personal para posibles adaptaciones.</p>
                  </CardContent>
                </Card>
            )}
            </>
          )}

        </section>
      )})}

      {selectedAllergens.size > 0 && (
         <div className="flex items-center justify-center space-x-2 py-4">
            <Switch id="show-all-switch" checked={showAll} onCheckedChange={setShowAll} />
            <Label htmlFor="show-all-switch" className="font-medium">
              {showAll ? "Mostrando todos los platos" : "Ocultar platos no compatibles"}
            </Label>
          </div>
      )}


      <Separator className="my-8" />

      <Card className="bg-muted/50 rounded-2xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold tracking-tight text-left mb-6">Leyenda de Alérgenos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-5">
            {ALLERGENS.map(allergen => (
              <div key={allergen.id} className="flex items-center gap-3">
                <AllergenIcon 
                  allergenId={allergen.id}
                  className={cn(allergenColors[allergen.id], 'rounded-lg')}
                  iconClassName="size-5"
                />
                <span className="font-medium text-sm">{allergen.name}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground text-sm pt-8">
            <div className="w-6 h-6 border-dashed border-2 border-muted-foreground rounded-lg flex-shrink-0" />
            <span>Indica que un plato puede contener trazas.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
