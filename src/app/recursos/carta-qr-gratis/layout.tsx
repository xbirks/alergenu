import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Carta QR gratis: pasa del PDF a una app profesional (sin pagar) | Alergenu',
    description: 'Descubre por qué una carta QR interactiva supera al PDF tradicional. Fotos, filtros de alérgenos y cambios instantáneos. Prueba 3 meses gratis sin permanencia.',
    keywords: [
        'carta qr gratis',
        'carta digital restaurante',
        'menu qr code',
        'carta interactiva',
        'digitalización hostelería',
        'menu digital gratis',
        'qr restaurante',
    ],
    openGraph: {
        title: 'Carta QR gratis: pasa del PDF a una app profesional (sin pagar)',
        description: 'Carta QR interactiva vs PDF: fotos, filtros de alérgenos y cambios al instante. 3 meses gratis sin permanencia.',
        type: 'article',
        publishedTime: '2025-01-10T00:00:00Z',
        authors: ['Alergenu'],
    },
};

export default function CartaQRGratisArticleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
