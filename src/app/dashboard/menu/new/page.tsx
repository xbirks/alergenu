'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MenuItemForm } from '@/components/lilunch/MenuItemForm';
import { UnsavedChangesModal } from '@/components/dashboard/UnsavedChangesModal';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewDishPage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const router = useRouter();

  // Detectar cambios en el formulario
  useEffect(() => {
    const handleFormChange = () => {
      setHasUnsavedChanges(true);
    };

    // Escuchar eventos de cambio en inputs
    document.addEventListener('input', handleFormChange);
    document.addEventListener('change', handleFormChange);

    return () => {
      document.removeEventListener('input', handleFormChange);
      document.removeEventListener('change', handleFormChange);
    };
  }, []);

  // Advertencia del navegador al cerrar/recargar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Interceptar botón "atrás" del navegador/móvil
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Agregar una entrada al historial para interceptar el botón "atrás"
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        // Prevenir la navegación
        window.history.pushState(null, '', window.location.href);

        // Mostrar el modal
        setPendingNavigation('/dashboard/menu');
        setShowExitModal(true);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      setPendingNavigation('/dashboard/menu');
      setShowExitModal(true);
    }
  };

  const handleStay = () => {
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  const handleLeave = () => {
    setHasUnsavedChanges(false);
    setShowExitModal(false);

    // Pequeño delay para asegurar que el flag se actualiza antes de navegar
    setTimeout(() => {
      if (pendingNavigation) {
        router.push(pendingNavigation);
      }
    }, 10);
  };

  return (
    <>
      <div className="mb-8">
        <Link
          href="/dashboard/menu"
          onClick={handleBackClick}
          className="inline-flex items-center gap-x-2 text-gray-600 font-semibold rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>

      <div className='mb-10'>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">Añadir nuevo plato</h1>
        <p className="text-lg text-muted-foreground">Rellena los detalles para añadir un nuevo ítem a tu carta digital.</p>
      </div>

      <MenuItemForm />

      <UnsavedChangesModal
        isOpen={showExitModal}
        onStay={handleStay}
        onLeave={handleLeave}
      />
    </>
  );
}
