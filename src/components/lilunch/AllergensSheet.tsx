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

export function AllergensSheet({ children }: { children: React.ReactNode }) {
  const { isLoaded, isAllergenSelected, toggleAllergen } = useAllergenProfile();

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
              ALLERGENS.map((allergen) => (
                <button
                  key={allergen.id}
                  onClick={() => toggleAllergen(allergen.id)}
                  aria-pressed={isAllergenSelected(allergen.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border-2 px-4 py-2 text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isAllergenSelected(allergen.id)
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-card hover:bg-accent/50 border-border'
                  )}
                >
                  {allergen.icon}
                  <span>{allergen.name}</span>
                </button>
              ))}
          </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t">
           <SheetClose asChild>
            <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full">Hecho</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
