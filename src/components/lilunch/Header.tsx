'use client';

import { Button } from '@/components/ui/button';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { AllergensSheet } from './AllergensSheet';

export function Header() {
  const { selectedAllergens } = useAllergenProfile();
  const selectedCount = selectedAllergens.size;

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <Link href="/m/1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Menú</h1>
        </Link>
        
        <div className="absolute left-1/2 -translate-x-1/2">
            <AllergensSheet>
              <Button variant="outline" className="rounded-full h-10 shadow-sm border-foreground/20 hover:bg-accent">
                Mis Alergias
                {selectedCount > 0 && (
                  <Badge variant="destructive" className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0">
                    {selectedCount}
                  </Badge>
                )}
              </Button>
            </AllergensSheet>
        </div>
        
        <div className="w-24"></div>
      </div>
    </header>
  );
}
