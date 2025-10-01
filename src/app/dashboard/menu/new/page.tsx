'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MenuItemForm } from '@/components/lilunch/MenuItemForm';

export default function NewDishPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/menu" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a mi carta
        </Link>
      </div>
      
      <div className='mb-8'>
        <h1 className="text-3xl font-bold mb-1">Añadir nuevo plato</h1>
        <p className="text-muted-foreground">Rellena los detalles para añadir un nuevo ítem a tu carta digital.</p>
      </div>

      <MenuItemForm />
    </div>
  );
}
