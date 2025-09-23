'use client';

import { Menu } from '@/components/lilunch/Menu';
import { getRestaurantById } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function MenuPage() {
  const params = useParams();
  const restaurantId = Array.isArray(params.restaurantId)
    ? params.restaurantId[0]
    : params.restaurantId;
  const restaurant = getRestaurantById(restaurantId);

  if (!restaurant || !restaurant.menu || restaurant.menu.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <Card className="w-full max-w-md text-center shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Menú no disponible</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <FileQuestion className="w-16 h-16 text-muted-foreground" />
            <p className="text-muted-foreground">
              No pudimos encontrar un menú publicado para este restaurante.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Menu restaurant={restaurant} />;
}
