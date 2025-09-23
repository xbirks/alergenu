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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '../ui/scroll-area';

export function AllergensSheet({ children }: { children: React.ReactNode }) {
  const { isLoaded, isAllergenSelected, toggleAllergen } = useAllergenProfile();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>My Allergen Profile</SheetTitle>
          <SheetDescription>
            Select allergens to filter the menu. We'll highlight what's safe for you.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow">
          <div className="py-4 flex flex-wrap gap-3">
            {!isLoaded && <p>Loading your profile...</p>}
            {isLoaded &&
              ALLERGENS.map((allergen) => (
                <button
                  key={allergen.id}
                  onClick={() => toggleAllergen(allergen.id)}
                  aria-pressed={isAllergenSelected(allergen.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isAllergenSelected(allergen.id)
                      ? 'bg-primary text-primary-foreground border-transparent'
                      : 'bg-transparent hover:bg-accent'
                  )}
                >
                  {allergen.icon}
                  <span>{allergen.name}</span>
                </button>
              ))}
          </div>
        </ScrollArea>
        <SheetFooter>
          <p className="text-xs text-muted-foreground text-center">
            Your profile is saved on this device.
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
