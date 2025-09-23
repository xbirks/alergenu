import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { allergenMap } from '@/lib/allergens';
import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

type ItemStatus = 'compatible' | 'precaution' | 'incompatible';

const statusStyles: Record<ItemStatus, string> = {
  compatible: 'bg-card',
  precaution: 'bg-warning/10 border-warning/50',
  incompatible: 'opacity-50 bg-card',
};

export function MenuItemCard({ item, status }: { item: MenuItem; status: ItemStatus }) {
  const allPresentAllergens = [...item.allergens, ...item.traces];

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
                    return (
                      <Tooltip key={allergenId} delayDuration={100}>
                        <TooltipTrigger>
                          <Badge 
                            variant={isTrace ? 'outline' : 'secondary'} 
                            className={cn(
                              "flex items-center gap-1.5",
                              isTrace ? 'border-dashed' : ''
                            )}
                          >
                            {allergen.icon}
                            <span className="hidden sm:inline">{allergen.name}</span>
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
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
