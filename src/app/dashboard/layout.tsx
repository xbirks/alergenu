import { Header } from "@/components/layout/header";

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
