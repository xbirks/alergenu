import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Menú del Día',
    description: 'Gestiona el menú del día de tu restaurante, actualiza platos y precios diariamente.',
};

export default function DailyMenuLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
