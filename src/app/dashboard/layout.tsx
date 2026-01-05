import { Header } from "@/components/layout/header";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | ALERGENU',
    default: 'Panel de Control | ALERGENU',
  },
  description: 'Gestiona tu carta digital, actualiza platos, precios y alérgenos desde tu panel de control de ALERGENU.',
  robots: {
    index: false,
    follow: false,
  },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Este layout envuelve todas las páginas dentro de /dashboard
// Proporciona un <main> semántico y un contenedor centrado con ancho máximo.
// El color de fondo lo gestiona el layout raíz (app/layout.tsx)
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <Header />
      <main>
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </>
  );
}
