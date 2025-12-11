import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Recursos sobre Alérgenos para Restaurantes | Alergenu',
    description: 'Guías, normativas y mejores prácticas para gestionar alérgenos en tu restaurante. Aprende a crear cartas de alérgenos, cumplir con la normativa europea y proteger a tus clientes.',
    keywords: [
        'recursos alérgenos',
        'guías restaurantes',
        'normativa alérgenos',
        'gestión alérgenos',
        'carta de alérgenos restaurante',
        'reglamento 1169/2011',
        'formación hostelería alérgenos',
    ],
    openGraph: {
        title: 'Recursos sobre Alérgenos para Restaurantes',
        description: 'Guías y mejores prácticas para gestionar alérgenos de forma profesional.',
        type: 'website',
    },
};

export default function RecursosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
