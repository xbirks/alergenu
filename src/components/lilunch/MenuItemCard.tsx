import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { allergenMap } from '@/lib/allergens';
import { MenuItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ItemStatus = 'compatible' | 'precaution' | 'incompatible';

const statusStyles: Record<ItemStatus, string> = {
  compatible: 'border-transparent',
  precaution: 'border-warning/50 bg-warning/5',
  incompatible: 'border-destructive/50 bg-destructive/5',
};

export function MenuItemCard({ item, status }: { item: MenuItem; status: ItemStatus }) {
  const allPresentAllergens = [...item.allergens, ...item.traces];
  const placeholderImage = PlaceHolderImages.find(p => p.id === item.imageId);
  const lastUpdated = formatDistanceToNow(new Date(item.lastUpdated), { addSuffix: true });

  return (
    <Card className={`overflow-hidden shadow-md transition-all duration-300 ${statusStyles[status]}`}>
      <div className="flex flex-col sm:flex-row">
        {placeholderImage && (
          <div className="sm:w-1/3 relative h-48 sm:h-auto">
             <Image
                src={placeholderImage.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                data-ai-hint={placeholderImage.imageHint}
              />
          </div>
        )}
        <div className={placeholderImage ? "sm:w-2/3" : "w-full"}>
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
              <div className="text-lg font-semibold text-primary whitespace-nowrap">
                ${item.price.toFixed(2)}
              </div>
            </div>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-4">
            {allPresentAllergens.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Contains:</h4>
                <TooltipProvider>
                  <div className="flex flex-wrap gap-2">
                    {allPresentAllergens.map(allergenId => {
                      const allergen = allergenMap.get(allergenId);
                      if (!allergen) return null;
                      
                      const isTrace = item.traces.includes(allergenId);
                      return (
                        <Tooltip key={allergenId}>
                          <TooltipTrigger>
                            <Badge variant={isTrace ? 'outline' : 'secondary'} className={isTrace ? 'border-dashed' : ''}>
                              {allergen.icon}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{allergen.name}{isTrace ? ' (may contain)' : ''}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </TooltipProvider>
              </div>
            )}
            <p className="text-xs text-muted-foreground/80 w-full pt-2">Last updated {lastUpdated}</p>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
