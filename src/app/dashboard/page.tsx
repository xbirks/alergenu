'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription'; // Import useSubscription
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { QrCard } from '@/components/dashboard/QrCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Eye, HeartHandshake } from 'lucide-react';
import { VideoModal } from '@/components/ui/video-modal'; // Importar el modal de vídeo

interface RestaurantData {
  restaurantName?: string;
  ownerName?: string;
  slug?: string;
  qrScans?: number;
  allergicSaves?: number;
}

// El componente principal del dashboard
function DashboardComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth(false);
  const { subscriptionStatus, isLoading: subscriptionLoading } = useSubscription(); // Use useSubscription
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado para controlar el modal del vídeo de bienvenida
  const [isFirstLoginVideoOpen, setIsFirstLoginVideoOpen] = useState(false);

  useEffect(() => {
    // Comprobar si es el primer login desde la URL
    if (searchParams.get('first_login') === 'true') {
      setIsFirstLoginVideoOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (authLoading || subscriptionLoading) return; // Wait for both auth and subscription to load

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

        // **LÓGICA DE REDIRECCIÓN CORREGIDA**
        // Solo redirigir si la prueba ha expirado explícitamente
        if (subscriptionStatus === 'trial_expired' && !subscriptionLoading && data.slug) {
          router.push(`/trial-expired/${data.slug}`);
          return;
        }

      } else {
        console.error('No restaurant data found for this user!');
        // Si no hay datos del restaurante Y la suscripción no es 'active' ni 'trialing',
        // podría ser un caso de error o un estado incompleto.
        if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing' && !subscriptionLoading) {
          router.push('/login'); // Redirigir a login como fallback seguro
          return;
        }
      }
      setLoading(false);
    };

    fetchRestaurantData();
  }, [user, authLoading, router, subscriptionStatus, subscriptionLoading]);

  if (loading || authLoading || subscriptionLoading || !restaurantData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  // Definir los detalles del vídeo
  const videoUrl = "https://www.youtube.com/embed/z5GEeM1CD3M";
  const videoTitle = "¡Bienvenido a Alergenu! Un tour rápido";

  return (
    <>
      {/* Modal del vídeo de bienvenida */}
      <VideoModal
        open={isFirstLoginVideoOpen}
        onOpenChange={setIsFirstLoginVideoOpen}
        videoUrl={videoUrl}
        title={videoTitle}
      />

      <div className="flex flex-col gap-8">
        <div className="grid gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight">
            ¡Hola, {restaurantData.ownerName || 'bienvenido'}!
          </h1>
          <p className="text-lg text-muted-foreground font-regular">
            Gestiona la carta de <span className='font-bold text-primary'>{restaurantData.restaurantName}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <Button
            id="tour-edit-menu-button"
            size="lg"
            className='w-full text-lg font-bold rounded-full h-14 bg-blue-600 hover:bg-blue-700'
            onClick={() => router.push('/dashboard/menu')}
          >
            Editar mi carta
          </Button>
          <Button
            size="lg"
            className='w-full text-lg font-bold rounded-full h-14 bg-blue-800 hover:bg-blue-900 text-white'
            onClick={() => router.push('/dashboard/daily-menu')}
          >
            Menú del día
          </Button>
          <Button
            id="tour-view-public-menu-button"
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

        {restaurantData.slug && <QrCard slug={restaurantData.slug} />}

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-blue-600" />
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
                <Eye className="h-5 w-5" />
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
    </>
  );
}

// Envolvemos el componente en Suspense para poder usar useSearchParams
export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>}>
      <DashboardComponent />
    </Suspense>
  );
}
