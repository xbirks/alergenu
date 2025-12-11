import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminBackButton from '@/components/admin/AdminBackButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, Clock, QrCode } from 'lucide-react';
import { getAdminDb } from '@/lib/firebase/firebase-admin';
import { getAuthenticatedAppForUser } from '@/lib/firebase/firebase-auth';
import { Timestamp } from 'firebase-admin/firestore';
import { RestaurantListClient } from '@/components/admin/RestaurantListClient';

type Restaurant = {
    id: string;
    name: string;
    slug: string;
    email: string;
    ownerUid: string;
    ownerName: string;
    plan: 'gratuito' | 'autonomia' | 'premium' | 'desconocido';
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unknown' | 'trial_expired';
    endDate: Date | null;
    dishCount: number;
    categoryCount: number;
    allergensHelpedCount: number;
    visitsCount: number;
    createdAt: Date | null;
};

const StatCard = ({ title, value, icon: Icon, href }: { title: string, value: string | number, icon: React.ElementType, href?: string }) => {
    const cardContent = (
        <Card className="rounded-2xl shadow-sm transition-transform transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );

    if (href) {
        return <Link href={href} className="block">{cardContent}</Link>;
    }

    return cardContent;
};

export default async function AdminPage() {
    const { currentUser, token } = await getAuthenticatedAppForUser();
    if (!currentUser || !token?.admin) {
        redirect('/');
    }

    let restaurants: Restaurant[] = [];
    let activeSubscriptions = 0;
    let trialingUsers = 0;

    try {
        const adminDb = getAdminDb();
        const restaurantsSnapshot = await adminDb.collection('restaurants').orderBy('restaurantName', 'asc').get();

        const restaurantDataPromises = restaurantsSnapshot.docs.map(async (doc) => {
            const data = doc.data();

            const categoriesPromise = adminDb.collection('restaurants').doc(doc.id).collection('categories').count().get();
            const dishesPromise = adminDb.collection('restaurants').doc(doc.id).collection('menuItems').count().get();

            const [categoriesSnapshot, dishesSnapshot] = await Promise.all([categoriesPromise, dishesPromise]);

            const status = data.subscriptionStatus || (data.trialEndsAt ? 'trialing' : 'unknown');
            const trialEndsAtDate = data.trialEndsAt instanceof Timestamp ? data.trialEndsAt.toDate() : null;
            let finalStatus = status;
            if (status === 'trialing' && trialEndsAtDate && new Date() > trialEndsAtDate) {
                finalStatus = 'trial_expired';
            }

            if (finalStatus === 'active') activeSubscriptions++;
            if (finalStatus === 'trialing') trialingUsers++;

            let endDate: Date | null = null;
            if (data.currentPeriodEnd && data.currentPeriodEnd instanceof Timestamp) {
                endDate = data.currentPeriodEnd.toDate();
            } else if (data.trialEndsAt && data.trialEndsAt instanceof Timestamp) {
                endDate = data.trialEndsAt.toDate();
            }

            let createdAtDate: Date | null = null;
            if (data.createdAt && data.createdAt instanceof Timestamp) {
                createdAtDate = data.createdAt.toDate();
            }

            return {
                id: doc.id,
                name: data.restaurantName || 'Nombre no definido',
                slug: data.slug || 'slug-no-definido',
                email: data.email || 'Email no registrado',
                ownerUid: data.ownerId || data.uid || '',
                ownerName: data.ownerName || 'No especificado',
                plan: data.selectedPlan || 'desconocido',
                status: finalStatus,
                endDate,
                categoryCount: categoriesSnapshot.data().count,
                dishCount: dishesSnapshot.data().count,
                allergensHelpedCount: data.allergicSaves || 0,
                visitsCount: data.qrScans || 0,
                createdAt: createdAtDate,
            };
        });

        restaurants = await Promise.all(restaurantDataPromises);

    } catch (error) {
        console.error('[Admin Page] Error fetching restaurants:', error);
    }

    return (
        <div className="flex flex-col gap-8 p-4 sm:p-8 min-h-screen bg-white">
            <AdminBackButton />

            <header className="pb-4 border-b border-gray-200">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-2">Panel de Administración</h1>
                <p className="text-md sm:text-lg text-muted-foreground font-regular">
                    Bienvenido de vuelta, Andrés. Gestiona tus restaurantes clientes.
                </p>
            </header>

            <main className="w-full">
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    <StatCard title="Total Restaurantes" value={restaurants.length} icon={Users} />
                    <StatCard title="Suscripciones Activas" value={activeSubscriptions} icon={CheckCircle} />
                    <StatCard title="Usuarios en Prueba" value={trialingUsers} icon={Clock} />
                    <StatCard title="QR Redirects" value="Gestionar" icon={QrCode} href="/admin/qr-redirects" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">Restaurantes Registrados</h2>
                <RestaurantListClient restaurants={restaurants} />
            </main>
        </div>
    );
}