'use client';

import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { Separator } from '../ui/separator';
import { AllergenIcon } from './AllergenIcon';
import { allergenColors } from './colors';

type ItemStatus = 'compatible' | 'incompatible';

export function MenuItemCard({ item, status }: { item: MenuItem; status: ItemStatus }) {
  const allPresentAllergens = [...item.allergens, ...item.traces];
  const { isAllergenSelected, selectedAllergens } = useAllergenProfile();

  const showIncompatibleWarning = selectedAllergens.size > 0 && status === 'incompatible';

  return (
    <div className={cn("w-full py-4", showIncompatibleWarning ? 'opacity-50' : '')}>
       <div className="flex justify-between items-start gap-4">
          <h3 className="flex-1 text-base font-bold uppercase tracking-wide text-foreground">{item.name}</h3>
          <p className="text-base font-bold whitespace-nowrap text-foreground">
            {item.price.toFixed(2)}€
          </p>
      </div>


      <div className="pt-1 space-y-3">
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}

        {(allPresentAllergens.length > 0) && (
          <div className="flex flex-wrap gap-2 items-center pt-2">
            {allPresentAllergens.map(allergenId => {
              const isTrace = item.traces.includes(allergenId);
              const isSelected = isAllergenSelected(allergenId);

              return (
                <AllergenIcon 
                  key={allergenId}
                  allergenId={allergenId}
                  className={cn(
                    'rounded-md',
                    allergenColors[allergenId] || 'bg-muted',
                     isSelected && status === 'incompatible' ? 'ring-2 ring-destructive' : '',
                     isTrace ? 'border-dashed border-2 !border-muted-foreground' : ''
                  )}
                  iconClassName="size-4"
                  />
              );
            })}
          </div>
        )}
      </div>
       <Separator className="mt-4" />
    </div>
  );
}
