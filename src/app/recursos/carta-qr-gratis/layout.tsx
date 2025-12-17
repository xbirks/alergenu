import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Carta QR Gratis para Restaurante - Alternativa Profesional al PDF',
    description: 'Genera una carta QR interactiva sin costes. Sistema profesional con fotos, traducción y filtro de alérgenos. Prueba completa de 3 meses sin permanencia.',
    keywords: [
        'carta qr gratis',
        'carta digital restaurante',
        'menu qr code',
        'carta interactiva',
        'digitalización hostelería',
        'menu digital gratis',
        'qr restaurante',
        'alternativa pdf carta'
    ],
    openGraph: {
        title: 'Carta QR Gratis para Restaurante - Alternativa Profesional al PDF',
        description: 'Deja de usar PDFs estáticos. Pásate a una carta digital interactiva que vende más. Empieza gratis hoy.',
        type: 'article',
        publishedTime: '2025-01-10T00:00:00Z',
        authors: ['Alergenu'],
        url: 'https://alergenu.com/carta-qr-gratis',
        images: [
            {
                url: 'https://alergenu.com/seo/alergenu_social_cover.jpg',
                width: 1200,
                height: 630,
                alt: 'Carta QR interactiva gratuita Alergenu',
            },
        ],
    },
    alternates: {
        canonical: 'https://alergenu.com/carta-qr-gratis',
    },
};

export default function CartaQRGratisArticleLayout({
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
                        "name": "Carta QR Alergenu",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web, iOS, Android",
                        "price": "0",
                        "priceCurrency": "EUR",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "ratingCount": "65",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "EUR",
                            "description": "Prueba gratuita completa de 3 meses"
                        }
                    })
                }}
            />
            {children}
        </>
    );
}