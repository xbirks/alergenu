'use client';

import { Button } from '@/components/ui/button';
import { User, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import Link from 'next/link';
import { AllergensSheet } from './AllergensSheet';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <div className="w-12"></div>
        <div className="absolute left-1/2 -translate-x-1/2">
            <AllergensSheet />
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
