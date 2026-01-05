import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Preferencias',
    description: 'Configura las preferencias de tu cuenta y restaurante en ALERGENU.',
};

export default function PreferencesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
