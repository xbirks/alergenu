'use client';

import { Menu } from '@/components/lilunch/Menu';
import { getRestaurantById } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';
import { useParams } from 'next/navigation';
import { CategoryNav } from '@/components/lilunch/CategoryNav';
import Image from 'next/image';

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
      <div className="container pt-6 pb-2 px-4 sm:px-6 text-center">
        <div className="w-full aspect-video overflow-hidden rounded-2xl mb-6">
            <Image
                src="https://picsum.photos/seed/cuisine/1600/900"
                alt="High-end cuisine"
                width={1600}
                height={900}
                className="w-full h-full object-cover"
                data-ai-hint="minimalist cooking"
            />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{restaurant.name}</h1>
        <p className="text-muted-foreground mt-2 mb-6 text-base max-w-lg mx-auto">
          Aquí tienes la carta de nuestro restaurante. Esperamos que disfrutes de tu elección.
        </p>
      </div>
      <CategoryNav categories={categories} />
      <Menu restaurant={restaurant} />
    </>
  );
}
