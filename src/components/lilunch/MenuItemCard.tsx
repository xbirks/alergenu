import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { allergenMap, ALLERGENS } from '@/lib/allergens';
import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Shield, AlertTriangle } from 'lucide-react';
import { AllergenIcon } from './AllergenIcon';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';

type ItemStatus = 'compatible' | 'precaution' | 'incompatible';

const statusStyles: Record<ItemStatus, string> = {
  compatible: 'bg-card',
  precaution: 'bg-warning/10 border-warning/50',
  incompatible: 'opacity-50 bg-card',
};

const allergenColors: Record<string, string> = {
    gluten: 'bg-orange-100 text-orange-600',
    crustaceans: 'bg-rose-100 text-rose-600',
    eggs: 'bg-yellow-100 text-yellow-600',
    fish: 'bg-blue-100 text-blue-600',
    peanuts: 'bg-amber-100 text-amber-700',
    soybeans: 'bg-lime-100 text-lime-700',
    milk: 'bg-sky-100 text-sky-700',
    'tree-nuts': 'bg-orange-100 text-orange-700',
    celery: 'bg-green-100 text-green-700',
    mustard: 'bg-yellow-100 text-yellow-700',
    sesame: 'bg-zinc-100 text-zinc-700',
    sulphites: 'bg-purple-100 text-purple-700',
    lupin: 'bg-violet-100 text-violet-700',
    molluscs: 'bg-cyan-100 text-cyan-700',
};


export function MenuItemCard({ item, status }: { item: MenuItem; status: ItemStatus }) {
  const allPresentAllergens = [...item.allergens, ...item.traces];
  const { isAllergenSelected } = useAllergenProfile();

  return (
    <Card className={cn("overflow-hidden shadow-none border rounded-2xl transition-all duration-300", statusStyles[status])}>
      <div className="flex">
        <div className="flex-grow">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start gap-4">
              <div className='flex items-center gap-2'>
                {status === 'compatible' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                {status === 'precaution' && <AlertTriangle className="h-5 w-5 text-warning" />}
                <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
              </div>
              <div className="text-lg font-bold text-primary whitespace-nowrap">
                {item.price.toFixed(2)}€
              </div>
            </div>
            {item.description && (
              <CardDescription className="text-sm !mt-1 pl-7">{item.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-4 pt-2">
            {allPresentAllergens.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center pl-7">
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
                                    allergenColors[allergenId] || 'bg-gray-100 text-gray-600',
                                    isTrace ? 'border-dashed border-2 border-current' : '',
                                    isSelected && !isTrace && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                )}
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
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
