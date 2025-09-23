'use client';

import { Badge } from '@/components/ui/badge';
import { allergenMap } from '@/lib/allergens';
import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ShieldX } from 'lucide-react';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { Separator } from '../ui/separator';

type ItemStatus = 'compatible' | 'incompatible';

export function MenuItemCard({ item, status }: { item: MenuItem; status: ItemStatus }) {
  const allPresentAllergens = [...item.allergens, ...item.traces];
  const { isAllergenSelected, selectedAllergens } = useAllergenProfile();

  const showIncompatibleWarning = selectedAllergens.size > 0 && status === 'incompatible';

  return (
    <div className={cn("w-full py-4", showIncompatibleWarning ? 'opacity-50' : '')}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-base font-bold uppercase tracking-tight text-foreground">{item.name}</h3>
        </div>
        <p className="text-base font-bold whitespace-nowrap text-foreground">
          {item.price.toFixed(2)}€
        </p>
      </div>

      <div className="pt-1 space-y-3">
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}

        {(allPresentAllergens.length > 0 || showIncompatibleWarning) && (
          <div className="flex flex-wrap gap-2 items-center">
            {showIncompatibleWarning && (
              <Badge variant="destructive" className="flex items-center gap-1.5 pl-1.5 pr-2.5">
                <ShieldX className="h-3.5 w-3.5" />
                No apto
              </Badge>
            )}
            {allPresentAllergens.map(allergenId => {
              const allergen = allergenMap.get(allergenId);
              if (!allergen) return null;

              const isTrace = item.traces.includes(allergenId);
              const isSelected = isAllergenSelected(allergenId);

              return (
                <Badge 
                  key={allergenId}
                  variant="outline"
                  className={cn(
                    "font-normal text-xs border-dashed text-muted-foreground",
                    isTrace ? "border-dashed" : "border-solid",
                    isSelected && status === 'incompatible' && 'ring-2 ring-destructive text-destructive-foreground bg-destructive border-destructive'
                  )}
                >
                  {allergen.name}{isTrace ? ' (trazas)' : ''}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      <Separator className="mt-4" />
    </div>
  );
}
