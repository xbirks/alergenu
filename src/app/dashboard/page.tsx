'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Eye, HeartHandshake } from 'lucide-react';

interface RestaurantData {
  restaurantName?: string;
  ownerName?: string;
  slug?: string;
  qrScans?: number;
  allergicSaves?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchRestaurantData = async () => {
      const docRef = doc(db, 'restaurants', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as RestaurantData;
        setRestaurantData(data);
        if (data.slug) {
          const menuUrl = `${window.location.origin}/menu/${data.slug}`;
          setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(menuUrl)}`);
        }
      } else {
        console.error('No restaurant data found for this user!');
      }
      setLoading(false);
    };

    fetchRestaurantData();
  }, [user, authLoading, router]);

  if (loading || authLoading || !restaurantData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-2">
         <h1 className="text-4xl font-extrabold tracking-tight"> 
            ¡Hola, {restaurantData.ownerName || 'bienvenido'}!
        </h1>
        <p className="text-lg text-muted-foreground font-regular">
            Gestiona la carta de <span className='font-bold text-primary'>{restaurantData.restaurantName}</span>.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Button 
            size="lg"
            className='w-full text-lg font-bold rounded-full h-14 bg-blue-600 hover:bg-blue-700'
            onClick={() => router.push('/dashboard/menu')}
        >
            Editar mi carta
        </Button>
        <Button
            size="lg"
            variant="outline"
            className='w-full text-lg font-bold rounded-full h-14'
            onClick={() => restaurantData?.slug && window.open(`/menu/${restaurantData.slug}`, '_blank')}
            disabled={!restaurantData?.slug}
        >
            <Eye className="mr-2 h-5 w-5" />
            Ver carta pública
        </Button>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Código QR de tu Carta</CardTitle>
          <CardDescription>
            Tus clientes usarán este código para ver la carta digital.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 text-center md:text-left">
          {qrCodeUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrCodeUrl}
              alt="Código QR del restaurante"
              width={160}
              height={160}
              className="rounded-lg"
            />
          )}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full font-bold h-12"
              onClick={() => alert('Descarga del QR pendiente de implementación.')}
            >
              Descargar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-blue-600"/>
                Personas alérgicas ayudadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-blue-600">{restaurantData.allergicSaves || 0}</div>
            <CardDescription className="text-sm">
             personas han usado el filtro
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
                <Eye className="h-5 w-5"/>
                Visitas al menú
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold">{restaurantData.qrScans || 0}</div>
            <CardDescription className="text-sm">
             visualizaciones totales
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
