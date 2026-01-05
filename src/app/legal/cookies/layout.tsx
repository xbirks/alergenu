import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Cookies',
    description: 'Política de cookies de ALERGENU.',
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
