'use client';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { MenuItemForm } from '@/components/lilunch/MenuItemForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface MenuItem {
    id: string;
    name: string;
    category: string;
    price: number;
    description?: string;
    allergens?: { [key: string]: 'no' | 'traces' | 'yes' };
    isAvailable: boolean;
}

interface EditDishPageProps {
  params: { id: string };
}

export default function EditDishPage({ params }: EditDishPageProps) {
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        // NOTE: This assumes you have a way to get the current user's UID.
        // In a real app, you would get this from your auth context.
        const uid = 'lL9Qr1d2YgVd2rT6b74p'; // Placeholder UID
        const docRef = doc(db, 'restaurants', uid, 'menuItems', params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMenuItem({ id: docSnap.id, ...docSnap.data() } as MenuItem);
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

    fetchMenuItem();
  }, [params.id]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
            <Link href="/dashboard/menu" className="inline-flex items-center gap-x-2 text-gray-600 font-semibold rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Volver a mi carta
            </Link>
        </div>

        <div className='mb-10'>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">Editar plato</h1>
            <p className="text-lg text-muted-foreground">Modifica los detalles de tu plato. Los cambios se reflejarán al instante.</p>
        </div>

        {loading && <p>Cargando plato...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <MenuItemForm existingMenuItem={menuItem} />}
    </div>
  );
}
