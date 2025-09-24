'use client';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { allergenMap } from '@/lib/allergens';
import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ShieldX } from 'lucide-react';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { allergenColors } from './colors';
import { AllergenIcon } from './AllergenIcon';
import { Separator } from '../ui/separator';

type ItemStatus = 'compatible' | 'incompatible';

export function MenuItemCard({ item, status, isDark = false }: { item: MenuItem; status: ItemStatus, isDark?: boolean }) {
  const allPresentAllergens = [...item.allergens, ...item.traces];
  const { isAllergenSelected, selectedAllergens } = useAllergenProfile();

  const showIncompatibleWarning = selectedAllergens.size > 0 && status === 'incompatible';

  const hasContent = item.description || allPresentAllergens.length > 0;

  return (
    <div className={cn("w-full py-4", status === 'incompatible' && selectedAllergens.size > 0 ? 'opacity-50' : '')}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className={cn("text-base font-semibold uppercase tracking-tight", isDark && "text-white")}>
            {item.name}
          </h3>
        </div>
        <p className={cn("text-base font-medium whitespace-nowrap", isDark && "text-white/90")}>
          {item.price.toFixed(2)}€
        </p>
      </div>

      {hasContent && (
        <div className="pt-1">
          {item.description && (
            <p className={cn("text-sm", isDark ? "text-white/70" : "text-muted-foreground")}>
              {item.description}
            </p>
          )}

          {(allPresentAllergens.length > 0 || showIncompatibleWarning) && (
            <div className="flex flex-wrap gap-2 items-center mt-3">
              {showIncompatibleWarning && (
                <Badge variant="destructive" className="flex items-center gap-1.5 pl-1.5 pr-2.5">
                  <ShieldX className="h-3.5 w-3.5" />
                  No apto
                </Badge>
              )}
              <TooltipProvider>
                {allPresentAllergens.map(allergenId => {
                  const allergen = allergenMap.get(allergenId);
                  if (!allergen) return null;

                  const isTrace = item.traces.includes(allergenId);
                  const isSelected = isAllergenSelected(allergenId);

                  return (
                    <Tooltip key={allergenId} delayDuration={100}>
                      <TooltipTrigger>
                        <AllergenIcon
                          allergenId={allergenId}
                          className={cn(
                            allergenColors[allergenId] || 'bg-gray-100 text-gray-800',
                            'hover:opacity-80 rounded-md',
                            isTrace ? 'border-dashed border-2' : 'border-2 border-transparent',
                            isSelected && status === 'incompatible' && 'ring-2 ring-destructive ring-offset-1 ring-offset-background'
                          )}
                          iconClassName="size-4"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{allergen.name}{isTrace ? ' (puede contener trazas)' : ''}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          )}
        </div>
      )}
       <Separator className={cn("mt-4", isDark && "bg-white/20")} />
    </div>
  );
}
