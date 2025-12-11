import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Alérgenos en pastelerías y panaderías: ¿es obligatorio tener carta? | Alergenu',
    description: 'Guía completa sobre la obligación de informar sobre alérgenos en pastelerías y panaderías. Soluciones digitales para vitrinas sin papeles ni etiquetas.',
    keywords: [
        'alérgenos pastelería',
        'alérgenos panadería',
        'carta alérgenos obrador',
        'normativa pastelería',
        'gluten panadería',
        'contaminación cruzada obrador',
        'qr pastelería',
    ],
    openGraph: {
        title: 'Alérgenos en pastelerías y panaderías: ¿es obligatorio tener carta?',
        description: 'Todo sobre la obligación de informar de alérgenos en pastelerías. Solución digital para vitrinas sin papeles.',
        type: 'article',
        publishedTime: '2025-01-11T00:00:00Z',
        authors: ['Alergenu'],
    },
};

export default function AlergenosPasteleriasArticleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
