'use client';

import { Button } from '@/components/ui/button';
import { SlidersHorizontal, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import Link from 'next/link';
import { useAllergenProfile } from '@/hooks/use-allergen-profile';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

export function Header() {
  const { selectedAllergens } = useAllergenProfile();
  const allergen_count = selectedAllergens.size;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <Link href="/welcome" className="flex items-center gap-2" aria-label="Home">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-foreground"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z"
              fill="currentColor"
            />
            <path
              d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" className="rounded-full h-10 shadow-sm bg-muted hover:bg-muted/80 text-muted-foreground relative">
              <Link href="/welcome">
                  <SlidersHorizontal className="h-4 w-4" />
                  Mis alergias
                  {allergen_count > 0 && (
                      <Badge variant="destructive" className={cn(
                          "absolute -top-1 -right-1 h-5 w-5 justify-center p-0",
                          allergen_count > 9 && "px-1 w-auto"
                      )}>
                          {allergen_count}
                      </Badge>
                  )}
              </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative rounded-full h-12 w-12 flex items-center gap-3">
              <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-muted text-muted-foreground">
                  <User className="h-5 w-5" />
              </AvatarFallback>
              </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
}
