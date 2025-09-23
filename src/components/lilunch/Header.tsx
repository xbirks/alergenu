'use client';

import { Button } from '@/components/ui/button';
import { AllergensSheet } from './AllergensSheet';
import { ShieldAlert, User } from 'lucide-react';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';

export function Header() {
  const { selectedAllergens } = useAllergenProfile();
  const selectedCount = selectedAllergens.size;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Menú</h1>
        <AllergensSheet>
          <Button variant="ghost" className="relative rounded-full h-12 w-auto px-3 flex items-center gap-3">
             <div className="relative">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/20 text-primary">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              {selectedCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0">
                  {selectedCount}
                </Badge>
              )}
            </div>
            <span className="text-base hidden sm:block">Mis Alergias</span>
          </Button>
        </AllergensSheet>
      </div>
    </header>
  );
}
