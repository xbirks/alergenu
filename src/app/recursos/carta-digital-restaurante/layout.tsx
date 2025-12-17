import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Carta Digital Restaurante [IA + Alérgenos] | No uses PDF',
    description: '¿Tus clientes hacen zoom? Pásate a la Carta Digital Interactiva. Filtra alérgenos con IA, traduce idiomas y evita multas. Prueba 3 meses GRATIS.',
    keywords: [
        'carta digital restaurante',
        'menú digital',
        'carta QR restaurante',
        'carta interactiva',
        'menú digital con alérgenos',
        'actualizar carta restaurante',
        'carta digital con fotos',
        'carta pdf restaurante',
        'crear carta qr gratis'
    ],
    openGraph: {
        title: 'Carta Digital Restaurante [IA + Alérgenos] | No uses PDF',
        description: 'Olvídate de subir PDFs borrosos. Carta interactiva, filtrable por alérgenos y traducida automáticamente. Cumple el Reglamento 1169/2011.',
        url: 'https://alergenu.com/carta-digital-restaurante',
        type: 'website',
        images: [
            {
                url: 'https://alergenu.com/seo/alergenu_meta-1200x630.jpg',
                width: 1200,
                height: 630,
                alt: 'Comparativa: Carta Digital PDF vs Carta Interactiva Alergenu',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Carta Digital Restaurante [IA + Alérgenos] | Alergenu',
        description: 'Carta interactiva que se actualiza al instante. Filtro de alérgenos automático y traducción incluida.',
        images: ['https://alergenu.com/seo/alergenu_twitter-1200x600.jpg'],
    },
    alternates: {
        canonical: 'https://alergenu.com/carta-digital-restaurante',
    },
};

export default function CartaDigitalLayout({
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
                        "@type": "SoftwareApplication",
                        "name": "Carta Digital Alergenu",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web, iOS, Android",
                        "price": "0",
                        "priceCurrency": "EUR",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "ratingCount": "87",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "EUR",
                            "description": "Prueba gratuita de 3 meses sin compromiso"
                        }
                    })
                }}
            />
            {children}
        </>
    );
}