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
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "Article",
                                "headline": "Cómo hacer una Carta de Alérgenos para tu Restaurante: Guía fácil y sin errores",
                                "description": "Guía práctica para crear tu carta de alérgenos digital. Aprende paso a paso cómo hacerlo bien y evitar errores.",
                                "image": "https://alergenu.com/seo/alergenu_social_cover.jpg",
                                "author": {
                                    "@type": "Organization",
                                    "name": "Alergenu"
                                },
                                "publisher": {
                                    "@type": "Organization",
                                    "name": "Alergenu",
                                    "logo": {
                                        "@type": "ImageObject",
                                        "url": "https://alergenu.com/logo.png"
                                    }
                                },
                                "datePublished": "2024-12-09T00:00:00Z"
                            },
                            {
                                "@type": "SoftwareApplication",
                                "name": "Alergenu Carta Alérgenos",
                                "applicationCategory": "BusinessApplication",
                                "operatingSystem": "Web",
                                "offers": {
                                    "@type": "Offer",
                                    "price": "0",
                                    "priceCurrency": "EUR"
                                },
                                "aggregateRating": {
                                    "@type": "AggregateRating",
                                    "ratingValue": "4.9",
                                    "ratingCount": "84",
                                    "bestRating": "5",
                                    "worstRating": "1"
                                }
                            }
                        ]
                    })
                }}
            />
            {children}
        </>
    );
}