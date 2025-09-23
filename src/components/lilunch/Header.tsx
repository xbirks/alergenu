'use client';

import { Button } from '@/components/ui/button';
import { AllergensSheet } from './AllergensSheet';
import { ShieldAlert } from 'lucide-react';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { Badge } from '../ui/badge';

export function Header() {
  const { selectedAllergens } = useAllergenProfile();
  const selectedCount = selectedAllergens.size;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Menú</h1>
        <AllergensSheet>
          <Button variant="ghost" className="relative rounded-full h-12 px-4">
            <ShieldAlert className="mr-2 h-5 w-5" />
            <span className="text-base">Mis Alergias</span>
            {selectedCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full">
                {selectedCount}
              </Badge>
            )}
          </Button>
        </AllergensSheet>
      </div>
    </header>
  );
}
