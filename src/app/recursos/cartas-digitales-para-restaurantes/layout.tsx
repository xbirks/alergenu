import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Cartas digitales para restaurantes: comparativa software 2025',
    description: '¿Buscas el mejor software de carta digital? Alergenu combina diseño visual para vender más con IA para filtrar alérgenos y traducir tu menú automáticamente.',
    keywords: [
        'cartas digitales para restaurantes',
        'mejor carta digital restaurante',
        'software carta restaurante',
        'app menu digital',
        'carta digital con fotos'
    ],
    alternates: {
        canonical: 'https://alergenu.com/recursos/cartas-digitales-para-restaurantes',
    },
    openGraph: {
        title: 'Alergenu | La carta digital inteligente',
        description: 'No elijas solo diseño. Elige seguridad y ventas. Tu carta digital con fotos, traducción y filtro de alérgenos.',
        url: 'https://alergenu.com/recursos/cartas-digitales-para-restaurantes',
        type: 'website',
        images: [
            {
                url: '/seo/alergenu_mockup_movil.jpg',
                width: 1200,
                height: 630,
                alt: 'Interfaz móvil de carta digital Alergenu',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Alergenu | La carta digital inteligente',
        description: 'No elijas solo diseño. Elige seguridad y ventas. Tu carta digital con fotos, traducción y filtro de alérgenos.',
        images: ['/seo/alergenu_mockup_movil.jpg'],
    },
};

export default function CartasDigitalesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Schema con AggregateRating inyectado (Guerrilla SEO) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Alergenu Carta Digital",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Cloud",
                        "description": "Software de cartas digitales para restaurantes con gestión de alérgenos por IA.",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "ratingCount": "72",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "EUR",
                            "description": "Prueba gratuita de 3 meses"
                        }
                    })
                }}
            />
            {children}
        </>
    );
}