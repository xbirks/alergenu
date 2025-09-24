'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

export function HeaderB2B() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="Dashboard">
            <Image src="/icon_alergenu.png" alt="Alergenu Icon" width={32} height={32} />
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/dashboard/menu" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Carta
            </Link>
            <Link href="/dashboard/account" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Cuenta
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative rounded-full h-10 w-10">
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
