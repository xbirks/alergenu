import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gestión de Platos',
    description: 'Administra todos los platos de tu restaurante desde un solo lugar.',
};

export default function DishesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
