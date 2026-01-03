import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Crea tu Carta Digital con IA en 30 Segundos | Alergenu',
    description: 'Sube una foto de tu menú y obtén una carta digital interactiva con traducción automática a 5 idiomas y filtro de alérgenos. Sin teclear nada. Gratis.',
    keywords: [
        'carta digital',
        'menu digital',
        'QR restaurante',
        'carta QR',
        'digitalizar menu',
        'IA restaurante',
        'traducción automática menu',
        'alérgenos',
        'menu inteligente',
    ],
    openGraph: {
        title: 'Convierte tu Carta en Digital con IA en 30 Segundos',
        description: 'Sube una foto y obtén tu carta digital con traducción y filtro de alérgenos. Gratis.',
        type: 'website',
        images: [
            {
                url: '/seo/foto-a-carta-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Alergenu - Carta Digital con IA',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Crea tu Carta Digital con IA | Alergenu',
        description: 'Sube una foto de tu menú y obtén una carta digital interactiva en 30 segundos.',
        images: ['/seo/foto-a-carta-og.jpg'],
    },
};

export default function FotoACartaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
