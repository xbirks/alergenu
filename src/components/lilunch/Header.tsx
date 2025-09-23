'use client';

import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import Link from 'next/link';

export function Header() {
  const { selectedAllergens } = useAllergenProfile();
  const selectedCount = selectedAllergens.size;

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Menú</h1>
        <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/welcome">
              <Button variant="outline" className="rounded-full h-10 shadow-sm border-foreground/20 hover:bg-accent">
                Mis Alergias
                {selectedCount > 0 && (
                  <Badge variant="destructive" className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0">
                    {selectedCount}
                  </Badge>
                )}
              </Button>
            </Link>
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
