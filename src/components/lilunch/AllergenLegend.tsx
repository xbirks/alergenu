'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ALLERGENS } from '@/lib/allergens';
import { AllergenIcon } from '@/components/icons/allergens';
import { cn } from '@/lib/utils';
import { allergenColors } from './colors';

export function AllergenLegend() {
  return (
    <div className="pt-8">
      <Separator />
      <Card className="mt-8 bg-muted/50 rounded-2xl shadow-none border-none">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold tracking-tight text-left mb-6 uppercase">Leyenda de Alérgenos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-5">
            {ALLERGENS.map(allergen => (
              <div key={allergen.id} className="flex items-center gap-3">
                <AllergenIcon 
                  allergenId={allergen.id}
                  className={cn(allergenColors[allergen.id], 'rounded-md', 'size-4')}
                />
                <span className="font-medium text-sm">{allergen.name}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground text-sm pt-8">
            <div className="w-5 h-5 border-dashed border-2 border-muted-foreground rounded-md flex-shrink-0" />
            <span>Indica que un plato puede contener trazas.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
