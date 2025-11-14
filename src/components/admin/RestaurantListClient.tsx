
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { List, UtensilsCrossed, Mail, MoreVertical, Award } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { assignSubscriptionPlan } from '@/app/admin/actions';
import ImpersonationButton from '@/app/admin/ImpersonationButton';

// Define the Restaurant type for client-side usage
type Restaurant = {
    id: string;
    name: string;
    slug: string;
    email: string;
    ownerUid: string;
    plan: 'gratuito' | 'autonomia' | 'premium' | 'desconocido';
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unknown' | 'trial_expired';
    endDate: Date | null;
    dishCount: number;
    categoryCount: number;
};

// Helper to format plan names
const formatPlanName = (plan: Restaurant['plan']) => {
    switch (plan) {
        case 'gratuito': return 'Gratuito';
        case 'autonomia': return 'Autonomía';
        case 'premium': return 'Premium';
        default: return 'Desconocido';
    }
};

// Helper to format dates
const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// A component for statistics cards at the top
const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

// A component for the status badge with colors
const StatusBadge = ({ status }: { status: Restaurant['status'] }) => {
    const styles = {
        active: 'bg-green-100 text-green-800 border-green-200',
        trialing: 'bg-blue-100 text-blue-800 border-blue-200',
        past_due: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        canceled: 'bg-red-100 text-red-800 border-red-200',
        unknown: 'bg-gray-100 text-gray-800 border-gray-200',
        trial_expired: 'bg-orange-100 text-orange-800 border-orange-200', 
    };
    const text = {
        active: 'Activo',
        trialing: 'En prueba',
        past_due: 'Vencido',
        canceled: 'Cancelado',
        unknown: 'Desconocido',
        trial_expired: 'Prueba Caducada',
    }
    return <Badge className={`font-semibold ${styles[status]}`}>{text[status]}</Badge>;
};


const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    const { toast } = useToast();
    const [assigning, setAssigning] = useState<boolean>(false);

    const endDateText = restaurant.status === 'trialing' ? 'Prueba termina el' : 'Renueva el';

    const handleAssignPlan = async (plan: 'gratuito' | 'autonomia' | 'premium') => {
        setAssigning(true);
        const { success, message } = await assignSubscriptionPlan(restaurant.id, plan);
        if (success) {
            toast({ title: "Plan Asignado", description: message, variant: "success" });
        } else {
            toast({ title: "Error al asignar plan", description: message, variant: "destructive" });
        }
        setAssigning(false);
        window.location.reload(); // Force a refresh to show updated data
    };

    return (
        <Card className="flex flex-col h-full rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold text-gray-900">{restaurant.name}</CardTitle>
                    <StatusBadge status={restaurant.status} />
                </div>
                <p className="text-sm text-muted-foreground font-mono truncate">slug: {restaurant.slug}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="font-mono truncate" title={restaurant.email}>{restaurant.email}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Plan:</span>
                        <span className="font-bold">{formatPlanName(restaurant.plan)}</span>
                    </div>
                     {restaurant.endDate && (
                        <div className="flex justify-between">
                           <span className="font-semibold text-gray-600">{endDateText}:</span>
                           <span>{formatDate(restaurant.endDate)}</span>
                        </div>
                    )}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                     <div className="flex items-center justify-between text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                            <List className="h-4 w-4 text-muted-foreground" />
                            <span>Categorías</span>
                        </div>
                        <span className="font-bold">{restaurant.categoryCount}</span>
                    </div>
                     <div className="flex items-center justify-between text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                           <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                           <span>Platos</span>
                        </div>
                        <span className="font-bold">{restaurant.dishCount}</span>
                    </div>
                </div>
            </CardContent>
            <CardContent className="pt-0 flex justify-end items-center gap-2">
                {restaurant.ownerUid && <ImpersonationButton uid={restaurant.ownerUid} />}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={assigning}><MoreVertical className="h-5 w-5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="px-4 py-2 font-semibold">Asignar Plan (Manual)</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAssignPlan('gratuito')} disabled={assigning} className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-green-500" /> Plan Gratuito (Forever)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAssignPlan('autonomia')} disabled={assigning} className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-500" /> Plan Autonomía (Forever)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAssignPlan('premium')} disabled={assigning} className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-purple-500" /> Plan Premium (Forever)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardContent>
        </Card>
    );
};

export function RestaurantListClient({ restaurants }: { restaurants: Restaurant[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.length > 0 ? (
                restaurants.map(restaurant => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))
            ) : (
                <Card className="text-center p-12 rounded-2xl col-span-full">
                    <p className="text-muted-foreground">No se encontraron restaurantes. Es un buen momento para buscar nuevos clientes.</p>
                </Card>
            )}
        </div>
    );
}
