import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { allergenMap } from '@/lib/allergens';
import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, ShieldX } from 'lucide-react';
import { AllergenIcon } from './AllergenIcon';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { allergenColors } from './colors';

type ItemStatus = 'compatible' | 'incompatible';

const statusStyles: Record<ItemStatus, string> = {
  compatible: 'bg-card',
  incompatible: 'opacity-50 bg-card',
};

export function MenuItemCard({ item, status }: { item: MenuItem; status: ItemStatus }) {
  const allPresentAllergens = [...item.allergens, ...item.traces];
  const { isAllergenSelected } = useAllergenProfile();

  const placeholderImage = PlaceHolderImages.find(p => p.id === item.imageId);

  return (
    <Card className={cn("overflow-hidden shadow-none border-none rounded-2xl transition-all duration-300", statusStyles[status])}>
      <div className="flex">
        <div className="flex-grow">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start gap-4">
              <div className='flex items-center gap-2'>
                {status === 'compatible' && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
                {status === 'incompatible' && <ShieldX className="h-5 w-5 text-destructive flex-shrink-0" />}
                <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
              </div>
              <div className="text-lg font-normal text-foreground whitespace-nowrap">
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
                                    'p-0.5',
                                    isTrace ? 'border-dashed border border-current' : '',
                                    isSelected && 'ring-2 ring-destructive ring-offset-2 ring-offset-background'
                                )}
                                iconClassName='size-3.5'
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
