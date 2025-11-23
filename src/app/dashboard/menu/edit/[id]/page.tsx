'use client';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { MenuItem, MenuItemForm } from '@/components/lilunch/MenuItemForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'next/navigation'; // 1. Importar el hook useParams

// La interfaz ya no necesita recibir params
interface EditDishPageProps {}

export default function EditDishPage({}: EditDishPageProps) { // 2. Eliminar params de las props
  const params = useParams(); // 3. Usar el hook para obtener los parámetros
  const id = params.id as string; // Extraer el id

  const { user, loading: authLoading } = useAuth();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItem = async () => {
      if (!user || !id) return; // Asegurarse de que el id existe
      setLoading(true);
      try {
        // 4. Usar la variable 'id' del hook
        const docRef = doc(db, 'restaurants', user.uid, 'menuItems', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setMenuItem({ id: docSnap.id, ...data } as MenuItem);
        } else {
          setError('No se ha encontrado el plato.');
        }
      } catch (e) {
        console.error(e);
        setError('Ha ocurrido un error al cargar el plato.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
        fetchMenuItem();
    }

  }, [id, user, authLoading]); // 5. Actualizar la dependencia del useEffect

  const renderContent = () => {
    if (loading || authLoading) {
        return (
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center mt-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Cargando datos del plato...</p>
            </div>
        );
    }

    if (error) {
        return <div className="border-2 border-destructive/50 bg-destructive/10 rounded-lg p-12 text-center mt-8"><p className="text-destructive font-semibold">{error}</p></div>;
    }

    return <MenuItemForm existingMenuItem={menuItem} />;
  }

  return (
    <>
        <div className="mb-8">
            <Link href="/dashboard/menu" className="inline-flex items-center gap-x-2 text-gray-600 font-semibold rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Volver a mi carta
            </Link>
        </div>

        <div className='mb-10'>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">Editar plato</h1>
            <p className="text-lg text-muted-foreground">Modifica los detalles de tu plato. Los cambios se reflejarán al instante en tu carta.</p>
        </div>

        {renderContent()}
    </>
  );
}
