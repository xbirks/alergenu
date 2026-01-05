import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidad',
    description: 'Política de privacidad y protección de datos de ALERGENU.',
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
