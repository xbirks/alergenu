'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ALLERGENS } from '@/lib/allergens';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { AllergenIcon } from './AllergenIcon';
import { useState, useEffect } from 'react';
import { allergenButtonColors } from './colors';

export function AllergensSheet({ children }: { children: React.ReactNode }) {
  const { isLoaded, isAllergenSelected, toggleAllergen } = useAllergenProfile();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const shouldShow = localStorage.getItem('lilunch-show-allergens');
    if (shouldShow === 'true') {
      setIsOpen(true);
      localStorage.removeItem('lilunch-show-allergens');
    }
  }, []);

  const handleDone = () => {
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild onClick={() => setIsOpen(true)}>{children}</SheetTrigger>
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
                      'flex items-center gap-2 rounded-full border-2 px-4 py-2 text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
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
          <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full" onClick={handleDone}>Hecho</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
