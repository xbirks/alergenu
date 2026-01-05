import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Términos y Condiciones',
    description: 'Términos y condiciones de uso de ALERGENU.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
