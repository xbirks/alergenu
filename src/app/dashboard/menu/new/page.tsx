'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MenuItemForm } from '@/components/lilunch/MenuItemForm';

export default function NewDishPage() {
  return (
    <>
      <div className="mb-8">
        <Link href="/dashboard/menu" className="inline-flex items-center gap-x-2 text-gray-600 font-semibold rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver a mi carta
        </Link>
      </div>
      
      <div className='mb-10'>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">Añadir nuevo plato</h1>
        <p className="text-lg text-muted-foreground">Rellena los detalles para añadir un nuevo ítem a tu carta digital.</p>
      </div>

      <MenuItemForm />
    </>
  );
}
