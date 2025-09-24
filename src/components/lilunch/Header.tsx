'use client';

import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import Link from 'next/link';
import { AllergensSheet } from './AllergensSheet';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <Link href="/welcome" className="flex items-center gap-2" aria-label="Home">
          <Image src="/icon_alergenu.png" alt="Alergenu Icon" width={32} height={32} />
        </Link>
        <div className="flex items-center gap-2">
          <AllergensSheet />
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
