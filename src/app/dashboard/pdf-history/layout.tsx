import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Historial PDF',
    description: 'Genera informes PDF del historial de cambios de tus platos.',
};

export default function PdfHistoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
