import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cómo hacer una Carta de Alérgenos para tu Restaurante: Guía fácil y sin errores | Alergenu',
    description: 'Guía práctica y sin rollos para crear tu carta de alérgenos digital. Aprende paso a paso cómo hacerlo bien, evitar errores en cocina y cumplir la normativa sin complicarte la vida.',
    keywords: [
        'carta de alérgenos',
        'cómo hacer carta de alérgenos',
        '14 alérgenos principales',
        'normativa alérgenos restaurante',
        'reglamento 1169/2011',
        'gestión alérgenos hostelería',
        'carta digital alérgenos',
    ],
    openGraph: {
        title: 'Cómo hacer una Carta de Alérgenos para tu Restaurante: Guía fácil y sin errores',
        description: 'Guía práctica y sin rollos para crear tu carta de alérgenos digital. Aprende paso a paso cómo hacerlo bien, evitar errores en cocina y cumplir la normativa.',
        type: 'article',
        publishedTime: '2024-12-09T00:00:00Z',
        authors: ['Alergenu'],
    },
};

export default function CartaAlergenosArticleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
