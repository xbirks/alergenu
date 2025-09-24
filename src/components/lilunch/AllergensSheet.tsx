'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ALLERGENS } from '@/lib/allergens';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { AllergenIcon } from './AllergenIcon';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { allergenButtonColors } from './colors';
import { SlidersHorizontal } from 'lucide-react';
import { Badge } from '../ui/badge';

export function AllergensSheet() {
  const { isLoaded, isAllergenSelected, toggleAllergen, selectedAllergens } = useAllergenProfile();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const allergen_count = selectedAllergens.size;

  useEffect(() => {
    if (searchParams.get('alergias') === 'true') {
      setIsOpen(true);
      // Clean the URL to avoid re-triggering on reload or back navigation
      const current = new URL(window.location.href);
      current.searchParams.delete('alergias');
      router.replace(current.pathname + current.search, { scroll: false });
    }
  }, [searchParams, router]);

  const handleDone = () => {
    setIsOpen(false);
    window.location.reload();
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="rounded-full h-12 w-12 flex-shrink-0 p-0 text-muted-foreground relative shadow-sm bg-muted hover:bg-muted/80">
            <SlidersHorizontal className="h-5 w-5" />
            <span className="sr-only">Mis alergias</span>
            {allergen_count > 0 && (
                <Badge variant="destructive" className={cn(
                    "absolute -top-1 -right-1 h-5 w-5 justify-center p-0 text-xs",
                    allergen_count > 9 && "px-1 w-auto"
                )}>
                    {allergen_count}
                </Badge>
            )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full" side="bottom">
        <SheetHeader className="text-center px-6">
          <SheetTitle className="text-2xl font-semibold">Mis Alergias</SheetTitle>
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
                      'flex items-center gap-2 rounded-full border-2 px-4 py-2 text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                      isSelected
                        ? `${colors.selected} text-primary-foreground`
                        : `${colors.unselected} bg-card border-border`
                    )}
                  >
                    <AllergenIcon allergenId={allergen.id} iconClassName={cn(isSelected ? 'text-primary-foreground' : 'text-current')} />
                    <span className="font-medium">{allergen.name}</span>
                  </button>
                )
              })}
          </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t">
          <Button size="lg" className="w-full h-14 text-lg font-medium rounded-full" onClick={handleDone}>Hecho</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
