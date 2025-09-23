'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ALLERGENS } from '@/lib/allergens';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { AllergenIcon } from './AllergenIcon';

const allergenButtonColors: Record<string, { selected: string; unselected: string }> = {
    gluten: { selected: 'bg-orange-500 border-orange-500', unselected: 'hover:bg-orange-50' },
    crustaceans: { selected: 'bg-rose-500 border-rose-500', unselected: 'hover:bg-rose-50' },
    eggs: { selected: 'bg-yellow-500 border-yellow-500', unselected: 'hover:bg-yellow-50' },
    fish: { selected: 'bg-blue-500 border-blue-500', unselected: 'hover:bg-blue-50' },
    peanuts: { selected: 'bg-amber-600 border-amber-600', unselected: 'hover:bg-amber-50' },
    soybeans: { selected: 'bg-lime-600 border-lime-600', unselected: 'hover:bg-lime-50' },
    milk: { selected: 'bg-sky-500 border-sky-500', unselected: 'hover:bg-sky-50' },
    'tree-nuts': { selected: 'bg-orange-600 border-orange-600', unselected: 'hover:bg-orange-50' },
    celery: { selected: 'bg-green-600 border-green-600', unselected: 'hover:bg-green-50' },
    mustard: { selected: 'bg-yellow-600 border-yellow-600', unselected: 'hover:bg-yellow-50' },
    sesame: { selected: 'bg-zinc-600 border-zinc-600', unselected: 'hover:bg-zinc-50' },
    sulphites: { selected: 'bg-purple-600 border-purple-600', unselected: 'hover:bg-purple-50' },
    lupin: { selected: 'bg-violet-600 border-violet-600', unselected: 'hover:bg-violet-50' },
    molluscs: { selected: 'bg-cyan-600 border-cyan-600', unselected: 'hover:bg-cyan-50' },
  };

export function AllergensSheet({ children, onDone }: { children: React.ReactNode, onDone?: () => void }) {
  const { isLoaded, isAllergenSelected, toggleAllergen } = useAllergenProfile();

  const handleDone = () => {
    if (onDone) {
      onDone();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col" side="bottom">
        <SheetHeader className="text-center">
          <SheetTitle className="text-2xl font-bold">Mis Alergias</SheetTitle>
          <SheetDescription>
            Selecciona los alérgenos a evitar. Resaltaremos lo que es seguro para ti.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow my-4">
          <div className="flex flex-wrap justify-center gap-3 p-4">
            {!isLoaded && <p>Cargando perfil...</p>}
            {isLoaded &&
              ALLERGENS.map((allergen) => {
                const isSelected = isAllergenSelected(allergen.id);
                const colors = allergenButtonColors[allergen.id] || { selected: 'bg-primary border-primary', unselected: 'hover:bg-accent/50' };
                return (
                  <button
                    key={allergen.id}
                    onClick={() => toggleAllergen(allergen.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex items-center gap-2 rounded-full border-2 px-4 py-2 text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      isSelected
                        ? `${colors.selected} text-primary-foreground`
                        : `${colors.unselected} bg-card border-border`
                    )}
                  >
                    <AllergenIcon allergenId={allergen.id} iconClassName={cn(isSelected ? 'text-primary-foreground' : 'text-current')} />
                    <span>{allergen.name}</span>
                  </button>
                )
              })}
          </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t">
           <SheetClose asChild>
            <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full" onClick={handleDone}>Hecho</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
