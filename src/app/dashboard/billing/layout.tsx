import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gestión de Suscripción',
    description: 'Gestiona tu suscripción de ALERGENU, cambia de plan o actualiza tu método de pago.',
};

export default function BillingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
