import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { allergenMap } from '@/lib/allergens';
import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ShieldX } from 'lucide-react';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { allergenColors } from './colors';

type ItemStatus = 'compatible' | 'incompatible';

export function MenuItemCard({ item, status }: { item: MenuItem; status: ItemStatus }) {
  const allPresentAllergens = [...item.allergens, ...item.traces];
  const { isAllergenSelected, selectedAllergens } = useAllergenProfile();

  const showIncompatibleWarning = selectedAllergens.size > 0 && status === 'incompatible';

  return (
    <div className={cn("py-4 border-b", status === 'incompatible' && selectedAllergens.size > 0 ? 'opacity-50' : '')}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <p className="text-base font-bold uppercase tracking-tight text-foreground">{item.name}</p>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1 ml-4">{item.description}</p>
          )}
        </div>
        <p className="text-sm font-semibold text-foreground whitespace-nowrap">
          {item.price.toFixed(2)}€
        </p>
      </div>

      {(allPresentAllergens.length > 0 || showIncompatibleWarning) && (
        <div className="flex flex-wrap gap-2 items-center mt-3 ml-4">
          {showIncompatibleWarning && (
             <Badge variant="destructive" className="flex items-center gap-1.5 pl-2 pr-2.5">
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
                    <Badge
                      className={cn(
                        'font-semibold border text-[0.65rem] h-5',
                        allergenColors[allergenId] || 'bg-gray-100 text-gray-800',
                        'hover:opacity-80',
                        isTrace ? 'border-dashed border-[1.5px] border-current' : 'border-transparent',
                        isSelected && status === 'incompatible' && 'ring-2 ring-destructive ring-offset-1 ring-offset-background'
                      )}
                    >
                      {allergen.name}
                    </Badge>
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
  );
}
