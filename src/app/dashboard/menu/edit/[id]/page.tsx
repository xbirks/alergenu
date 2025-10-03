'use client';

import { Button } from '@/components/ui/button';
import { MenuItemForm } from '@/components/lilunch/MenuItemForm';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Estructura del plato para recibir los datos de Firestore
interface MenuItemFetch {
    id: string;
    name: string;
    category: string;
    price: number;
    description?: string;
    allergens?: string[]; // El tipo que llega de Firebase
    isAvailable: boolean;
}

// Helper para convertir el array de alérgenos a un mapa, como espera el formulario
const toAllergenMap = (
  arr?: string[]
): Record<string, "yes" | "no" | "traces"> | undefined => {
  return arr?.reduce((acc, key) => {
    acc[key] = "yes"; // Asumimos 'yes' para los alérgenos presentes en el array
    return acc;
  }, {} as Record<string, "yes" | "no" | "traces">);
};


export default function EditMenuItemPage() {
    const router = useRouter();
    const params = useParams();
    const { id: menuItemId } = params; // Obtenemos el ID del plato de la URL

    const { user, loading: authLoading } = useAuth();
    const [menuItem, setMenuItem] = useState<MenuItemFetch | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (authLoading || !user || typeof menuItemId !== 'string') return;

        const fetchMenuItem = async () => {
            try {
                const docRef = doc(db, 'restaurants', user.uid, 'menuItems', menuItemId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setMenuItem({ id: docSnap.id, ...docSnap.data() } as MenuItemFetch);
                } else {
                    // El plato no existe o no pertenece a este usuario
                    setNotFound(true);
                }
            } catch (err) {
                console.error("Error al obtener el plato:", err);
                setError('No se pudo cargar la información del plato.');
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItem();
    }, [user, authLoading, menuItemId]);

    const renderContent = () => {
        if (loading || authLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-center mt-10">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Cargando información del plato...</p>
                </div>
            );
        }

        if (notFound) {
             return (
                <div className="text-center mt-10">
                    <h2 className="text-2xl font-bold mb-2">Plato no encontrado</h2>
                    <p className="text-muted-foreground mb-6">El plato que intentas editar no existe o no tienes permiso para acceder a él.</p>
                    <Button onClick={() => router.push('/dashboard/menu')}>Volver a la carta</Button>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center mt-10 text-destructive">
                    <p className="font-semibold">{error}</p>
                    <Button variant="outline" onClick={() => router.push('/dashboard/menu')} className="mt-4">Volver a la carta</Button>
                </div>
            );
        }

        if (menuItem) {
            // Transformamos los datos para que coincidan con lo que espera el formulario
            const menuItemWithDefaults = {
                ...menuItem,
                allergens: toAllergenMap(menuItem.allergens), // <-- ARREGLO APLICADO
                isAvailable: menuItem.isAvailable === false ? false : true,
            };
            return <MenuItemForm existingMenuItem={menuItemWithDefaults} />;
        }

        return null; // No debería llegar aquí
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto">
            <header className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Volver</span>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Editar Plato</h1>
                    <p className="text-muted-foreground">Modifica la información de tu plato.</p>
                </div>
            </header>
            <main>{renderContent()}</main>
        </div>
    );
}
