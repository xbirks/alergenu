// src/app/admin/page.tsx
import { getAdminDb } from '@/lib/firebase/firebase-admin';
import { getAuthenticatedAppForUser } from '@/lib/firebase/firebase-auth';
import { redirect } from 'next/navigation';
import ImpersonationButton from './ImpersonationButton';

// Import UI components from dashboard style
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

// Import the new Client Component for the back button
import AdminBackButton from '@/components/admin/AdminBackButton';

type Restaurant = {
    id: string;
    name: string;
    slug: string;
    ownerUid: string; 
};

// Refactored RestaurantCard to use Tailwind and Card component
const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    return (
        <Card className="flex flex-col h-full rounded-2xl shadow-sm">
            <CardHeader className="flex-grow">
                <CardTitle className="text-xl font-semibold mb-2 text-gray-900">{restaurant.name}</CardTitle>
                <p className="text-sm text-muted-foreground font-regular font-mono">Slug: {restaurant.slug}</p>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col justify-end">
                {restaurant.ownerUid ? (
                    <div className="mt-4">
                        <ImpersonationButton uid={restaurant.ownerUid} />
                    </div>
                ) : (
                    <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md text-sm italic text-center mt-4">
                        (Usuario propietario no vinculado)
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default async function AdminPage() {
    const { currentUser, token } = await getAuthenticatedAppForUser();
    if (!currentUser || !token?.admin) {
        redirect('/');
    }

    let restaurants: Restaurant[] = [];
    try {
        const adminDb = getAdminDb();
        const restaurantsSnapshot = await adminDb.collection('restaurants').orderBy('restaurantName', 'asc').get();
        
        restaurants = restaurantsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.restaurantName || 'Nombre no definido',
                slug: data.slug || 'slug-no-definido',
                ownerUid: data.ownerId || data.uid || '' 
            };
        });
    } catch (error) {
        console.error('[Admin Page] Error fetching restaurants:', error);
    }

    return (
        <div className="flex flex-col gap-8 p-8 min-h-screen bg-gray-50">
            <AdminBackButton />

            <header className="mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-2">Panel de Administración</h1>
                <p className="text-lg text-muted-foreground font-regular">
                    Bienvenido, {currentUser.email}. Aquí puedes gestionar tus restaurantes clientes.
                </p>
            </header>
            
            <main className="w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Restaurantes Registrados ({restaurants.length})</h2>
                {restaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurants.map(restaurant => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No se encontraron restaurantes.</p>
                )}
            </main>
        </div>
    );
}
