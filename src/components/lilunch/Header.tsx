'use client';

import { Button } from '@/components/ui/button';
import { User, ChevronDown } from 'lucide-react';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { Avatar, AvatarFallback } from '../ui/avatar';
import Link from 'next/link';

export function Header() {
  const { selectedAllergens } = useAllergenProfile();
  const hasSelection = selectedAllergens.size > 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <div className="w-12"></div>
        <div className="absolute left-1/2 -translate-x-1/2">
            <Button asChild variant="secondary" className="rounded-full h-10 shadow-sm bg-muted hover:bg-muted/80 text-muted-foreground">
              <Link href="/welcome">
                Mis Alergias
                <ChevronDown className="h-4 w-4 ml-1" />
              </Link>
            </Button>
        </div>
        <Button variant="ghost" size="icon" className="relative rounded-full h-12 w-12 flex items-center gap-3">
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
