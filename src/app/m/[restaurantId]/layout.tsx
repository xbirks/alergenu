import { Header } from '@/components/lilunch/Header';
import { LegalFooter } from '@/components/lilunch/LegalFooter';
import { CategoryNav } from '@/components/lilunch/CategoryNav';
import { getRestaurantById } from '@/lib/data';
import { AllergensSheetAuto } from '@/components/lilunch/AllergensSheetAuto';

export default async function MenuLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { restaurantId: string };
}) {
  const restaurant = getRestaurantById(params.restaurantId);
  const categories = restaurant?.menu.map(c => ({ id: c.id, name: c.name })) || [];

  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      <CategoryNav categories={categories} />
      <main className="pb-24 pt-4">{children}</main>
      <LegalFooter />
      <AllergensSheetAuto />
    </div>
  );
}
