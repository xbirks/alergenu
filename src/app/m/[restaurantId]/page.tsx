'use client';

import { Menu } from '@/components/lilunch/Menu';
import { getRestaurantById } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';
import { useParams } from 'next/navigation';
import { CategoryNav } from '@/components/lilunch/CategoryNav';

export default function MenuPage() {
  const params = useParams();
  const restaurantId = Array.isArray(params.restaurantId)
    ? params.restaurantId[0]
    : params.restaurantId;
  const restaurant = getRestaurantById(restaurantId);

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <Card className="w-full max-w-md text-center shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Restaurante no encontrado</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <FileQuestion className="w-16 h-16 text-muted-foreground" />
            <p className="text-muted-foreground">
              No pudimos encontrar la información de este restaurante.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = restaurant.menu.map(c => ({ id: c.id, name: c.name }));

  return (
    <>
      <div className="container py-6 px-4 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">{restaurant.name}</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Aquí tienes la carta de nuestro restaurante. Esperamos que disfrutes de tu elección.
        </p>
      </div>
      <CategoryNav categories={categories} />
      <Menu restaurant={restaurant} />
    </>
  );
}
