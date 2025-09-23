'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { allergenMap } from '@/lib/allergens';
import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ShieldX } from 'lucide-react';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { allergenColors } from './colors';
import { AllergenIcon } from './AllergenIcon';

type ItemStatus = 'compatible' | 'incompatible';

export function MenuItemCard({ item, status }: { item: MenuItem; status: ItemStatus }) {
  const allPresentAllergens = [...item.allergens, ...item.traces];
  const { isAllergenSelected, selectedAllergens } = useAllergenProfile();

  const showIncompatibleWarning = selectedAllergens.size > 0 && status === 'incompatible';

  const hasContent = item.description || allPresentAllergens.length > 0 || showIncompatibleWarning;

  return (
    <Card className={cn("w-full shadow-md rounded-2xl", status === 'incompatible' && selectedAllergens.size > 0 ? 'bg-muted/60 opacity-70' : 'bg-card')}>
        <CardHeader className="flex flex-row justify-between items-start gap-4 p-4">
            <div className="flex-1">
                <h3 className="text-lg font-semibold leading-tight">{item.name}</h3>
            </div>
            <p className="text-lg font-bold text-primary whitespace-nowrap">
                {item.price.toFixed(2)}€
            </p>
        </CardHeader>

        {hasContent && (
            <CardContent className="p-4 pt-0">
                {item.description && (
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                )}

                {(allPresentAllergens.length > 0 || showIncompatibleWarning) && (
                    <div className="flex flex-wrap gap-2 items-center">
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
                                                'hover:opacity-80 rounded-lg',
                                                isTrace ? 'border-dashed border-2' : 'border-2 border-transparent',
                                                isSelected && status === 'incompatible' && 'ring-2 ring-destructive ring-offset-1 ring-offset-background'
                                            )}
                                            iconClassName="size-6"
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
        )}
    </Card>
  );
}
