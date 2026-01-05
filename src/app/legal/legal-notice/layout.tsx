import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Aviso Legal',
    description: 'Aviso legal de ALERGENU.',
};

export default function LegalNoticeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
