'use client';

import { Header } from '@/components/lilunch/Header';
import { LegalFooter } from '@/components/lilunch/LegalFooter';
import { CategoryNav } from '@/components/lilunch/CategoryNav';
import { getRestaurantById } from '@/lib/data';
import { usePathname, useRouter, useSearchParams, useParams } from 'next/navigation';
import { AllergensSheet } from '@/components/lilunch/AllergensSheet';
import { useEffect, useState } from 'react';

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const restaurantId = Array.isArray(params.restaurantId) ? params.restaurantId[0] : params.restaurantId;
  const restaurant = getRestaurantById(restaurantId);
  const categories = restaurant?.menu.map(c => ({ id: c.id, name: c.name })) || [];
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isAllergensSheetOpen, setIsAllergensSheetOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('alergias') === 'true') {
      setIsAllergensSheetOpen(true);
      // Clean up URL without reloading
      const newPath = pathname;
      window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath);
    }
  }, [searchParams, pathname, router]);

  return (
    <div className="relative min-h-screen bg-background">
      <AllergensSheet open={isAllergensSheetOpen} onOpenChange={setIsAllergensSheetOpen}>
        <Header />
      </AllergensSheet>
      <CategoryNav categories={categories} />
      <main className="pb-24 pt-4">{children}</main>
      <LegalFooter />
    </div>
  );
}
