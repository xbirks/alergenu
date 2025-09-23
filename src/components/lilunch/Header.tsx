'use client';

import { Button } from '@/components/ui/button';
import { AllergensSheet } from './AllergensSheet';
import { User } from 'lucide-react';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';

export function Header() {
  const { selectedAllergens } = useAllergenProfile();
  const selectedCount = selectedAllergens.size;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-foreground text-background">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Menú</h1>
        <div className="absolute left-1/2 -translate-x-1/2">
            <AllergensSheet>
              <Button variant="outline" className="rounded-full h-10 shadow-sm bg-foreground border-background/20 hover:bg-background/10 text-background">
                Mis Alergias
                {selectedCount > 0 && (
                  <Badge variant="destructive" className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0">
                    {selectedCount}
                  </Badge>
                )}
              </Button>
            </AllergensSheet>
        </div>
        <Button variant="ghost" size="icon" className="relative rounded-full h-12 w-12 flex items-center gap-3 text-background hover:bg-background/10 hover:text-background">
            <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted text-muted-foreground">
                <User className="h-5 w-5" />
            </AvatarFallback>
            </Avatar>
        </Button>
      </div>
    </header>
  );
}
