import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Normativa de alérgenos en hostelería: guía clara del Reglamento 1169/2011 | Alergenu',
    description: 'Guía práctica sobre el Reglamento Europeo 1169/2011 de alérgenos. Aprende qué dice la ley, cómo cumplirla, multas y sanciones. Sin tecnicismos, directo al grano.',
    keywords: [
        'reglamento 1169/2011',
        'normativa alérgenos hostelería',
        'ley seguridad alimentaria',
        'multas alérgenos restaurante',
        'normativa europea alérgenos',
        'información alimentaria',
        'sanciones alérgenos',
    ],
    openGraph: {
        title: 'Normativa de alérgenos en hostelería: guía clara del Reglamento 1169/2011',
        description: 'Guía práctica sobre el Reglamento Europeo 1169/2011 de alérgenos. Aprende qué dice la ley, cómo cumplirla y evitar multas.',
        type: 'article',
        publishedTime: '2025-01-09T00:00:00Z',
        authors: ['Alergenu'],
    },
};

export default function NormativaEuropeaArticleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
