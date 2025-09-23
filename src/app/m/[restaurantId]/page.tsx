'use client';

import { useState } from 'react';
import { Menu } from '@/components/lilunch/Menu';
import { getRestaurantById } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion, Shield, Smile } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AllergensSheet } from '@/components/lilunch/AllergensSheet';

export default function MenuPage() {
  const params = useParams();
  const restaurantId = Array.isArray(params.restaurantId)
    ? params.restaurantId[0]
    : params.restaurantId;
  const restaurant = getRestaurantById(restaurantId);

  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

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

  if (!welcomeDismissed) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-8 text-center">
        <div className="max-w-md">
           <Shield size={64} className="mx-auto text-primary mb-6" />
          <h1 className="text-4xl font-bold mb-4">Tu seguridad es nuestra prioridad</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Para personalizar tu menú, por favor, indícanos si tienes alguna alergia alimentaria.
          </p>
          <div className="space-y-4">
            <AllergensSheet>
               <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full bg-primary text-primary-foreground">
                Tengo alergias
              </Button>
            </AllergensSheet>
            <Button
              size="lg"
              variant="ghost"
              className="w-full h-14 text-lg font-semibold rounded-full flex items-center gap-2"
              onClick={() => setWelcomeDismissed(true)}
            >
              <Smile /> No soy alérgico
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <Menu restaurant={restaurant} />;
}
