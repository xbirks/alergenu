'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { List, UtensilsCrossed, Mail, MoreVertical, Award, Eye, HeartHandshake, Hourglass, User, ArrowUpDown, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { assignSubscriptionPlan, startFreeTrial, deleteUserAction } from '@/app/admin/actions';
import ImpersonationButton from '@/app/admin/ImpersonationButton';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Define the Restaurant type for client-side usage
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
    const [deleting, setDeleting] = useState<boolean>(false); // New state for delete loading
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false); // New state for dialog visibility
    const router = useRouter();

    const endDateText = restaurant.status === 'trialing' ? 'Prueba termina el' : 'Renueva el';

    const handleAssignPlan = async (plan: 'autonomia' | 'premium') => {
        setAssigning(true);
        const { success, message } = await assignSubscriptionPlan(restaurant.id, plan);
        if (success) {
            toast({ title: "Plan Asignado", description: message, variant: "default" });
        } else {
            toast({ title: "Error al asignar plan", description: message, variant: "destructive" });
        }
        setAssigning(false);
        window.location.reload(); // Force a refresh to show updated data
    };

    const handleStartTrial = async () => {
        setAssigning(true);
        const { success, message } = await startFreeTrial(restaurant.id);
        if (success) {
            toast({ title: "Prueba Gratuita Iniciada", description: message, variant: "default" });
        } else {
            toast({ title: "Error al iniciar prueba", description: message, variant: "destructive" });
        }
        setAssigning(false);
        window.location.reload(); // Force a refresh to show updated data
    };

    const handleDeleteUser = async () => {
        setDeleting(true);
        try {
            const { success, message } = await deleteUserAction(restaurant.ownerUid);
            if (success) {
                toast({ title: "Usuario Eliminado", description: message, variant: "default" });
                window.location.reload();
            } else {
                toast({ title: "Error al eliminar", description: message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error crítico", description: "Fallo inesperado al eliminar usuario", variant: "destructive" });
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleViewPublicMenu = () => {
        if (restaurant.slug) {
            window.open(`/menu/${restaurant.slug}`, '_blank');
        } else {
            toast({ title: 'Generando enlace', description: 'Espera un segundo y vuelve a intentarlo.', variant: 'destructive' });
        }
    };

    return (
        <>
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta de usuario de
                            <span className="font-bold text-gray-900"> {restaurant.name} </span>
                            (ID: {restaurant.id}), sus restaurantes y todos los platos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault(); // Prevent auto-closing needed for async
                                handleDeleteUser();
                            }}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={deleting}
                        >
                            {deleting ? 'Eliminando...' : 'Sí, eliminar usuario'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-600">Propietario:</span>
                            <div className="flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-medium text-gray-800">{restaurant.ownerName}</span>
                            </div>
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
                        <div className="flex items-center justify-between text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                                <HeartHandshake className="h-4 w-4 text-muted-foreground" />
                                <span>Alérgicos Ayudados</span>
                            </div>
                            <span className="font-bold">{restaurant.allergensHelpedCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span>Visitas</span>
                            </div>
                            <span className="font-bold">{restaurant.visitsCount}</span>
                        </div>
                    </div>
                </CardContent>
                <CardContent className="pt-0 flex flex-col gap-3">
                    {restaurant.ownerUid && <ImpersonationButton uid={restaurant.ownerUid} />}
                    <Button
                        onClick={handleViewPublicMenu}
                        disabled={!restaurant.slug}
                        size="lg"
                        variant="outline"
                        className={cn("w-full font-bold rounded-full h-14 text-lg", !restaurant.slug && "opacity-50 cursor-not-allowed")}
                    >
                        <Eye className="mr-2 h-4 w-4" />Ver Carta Pública
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="lg" className="w-full font-bold rounded-full h-14 text-lg" disabled={assigning}>
                                <MoreVertical className="mr-2 h-4 w-4" />Otras Acciones
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60">
                            <DropdownMenuLabel className="px-4 py-2 font-semibold">Gestionar Plan</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleStartTrial} disabled={assigning || restaurant.status === 'trialing'} className="flex items-center gap-2">
                                <Hourglass className="h-4 w-4 text-orange-500" /> Iniciar Prueba Gratuita (3 meses)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAssignPlan('autonomia')} disabled={assigning} className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-blue-500" /> Asignar Plan Autonomía (Manual)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAssignPlan('premium')} disabled={assigning} className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-purple-500" /> Asignar Plan Premium (Manual)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={assigning}
                                className="flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" /> Eliminar Usuario
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardContent>
            </Card>
        </>
    );
};

export function RestaurantListClient({ restaurants }: { restaurants: Restaurant[] }) {
    const [sortBy, setSortBy] = useState<string>('newest');

    // Sorting logic
    const sortedRestaurants = [...restaurants].sort((a, b) => {
        switch (sortBy) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'newest':
                const timeA = a.createdAt?.getTime() || 0;
                const timeB = b.createdAt?.getTime() || 0;
                return timeB - timeA; // Newest first
            case 'oldest':
                const timeA2 = a.createdAt?.getTime() || 0;
                const timeB2 = b.createdAt?.getTime() || 0;
                return timeA2 - timeB2; // Oldest first
            case 'status':
                const statusOrder = { active: 1, trialing: 2, past_due: 3, unknown: 4, canceled: 5, trial_expired: 6 };
                return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
            case 'plan':
                const planOrder = { premium: 1, autonomia: 2, gratuito: 3, desconocido: 4 };
                return (planOrder[a.plan] || 99) - (planOrder[b.plan] || 99);
            default:
                return 0;
        }
    });

    return (
        <div className="space-y-6">
            {/* Sorting Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="sort-select" className="text-sm font-semibold text-gray-700">Ordenar por:</Label>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort-select" className="w-[240px] rounded-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name-asc">Alfabético (A-Z)</SelectItem>
                        <SelectItem value="name-desc">Alfabético (Z-A)</SelectItem>
                        <SelectItem value="newest">Más nuevos primero</SelectItem>
                        <SelectItem value="oldest">Más antiguos primero</SelectItem>
                        <SelectItem value="status">Por estado</SelectItem>
                        <SelectItem value="plan">Por plan</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedRestaurants.length > 0 ? (
                    sortedRestaurants.map(restaurant => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))
                ) : (
                    <Card className="text-center p-12 rounded-2xl col-span-full">
                        <p className="text-muted-foreground">No se encontraron restaurantes. Es un buen momento para buscar nuevos clientes.</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
