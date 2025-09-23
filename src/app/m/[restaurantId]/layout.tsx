import { Header } from "@/components/lilunch/Header";
import { LegalFooter } from "@/components/lilunch/LegalFooter";
import { getRestaurantById } from "@/lib/data";
import { notFound } from "next/navigation";

export default function MenuLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { restaurantId: string };
}) {
  const restaurant = getRestaurantById(params.restaurantId);

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      <Header restaurantName={restaurant.name} />
      <main className="container py-8 sm:py-12">
        {children}
      </main>
      <div className="h-20" />
      <LegalFooter />
    </div>
  );
}
