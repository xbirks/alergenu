'use client';

import { Button } from '@/components/ui/button';
import { AllergensSheet } from './AllergensSheet';
import { ShieldAlert } from 'lucide-react';

export function Header({ restaurantName }: { restaurantName: string }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold sm:text-2xl">Lilunch</h1>
           <span className="hidden sm:block text-xl text-muted-foreground font-normal">/</span>
          <h2 className="hidden sm:block text-xl font-normal text-muted-foreground">{restaurantName}</h2>
        </div>
        <AllergensSheet>
          <Button variant="outline">
            <ShieldAlert className="mr-2 h-4 w-4" />
            My Allergens
          </Button>
        </AllergensSheet>
      </div>
    </header>
  );
}
