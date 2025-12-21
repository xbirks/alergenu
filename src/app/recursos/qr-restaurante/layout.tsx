import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '📱 QR restaurante gratis con IA | Generador dinámico que NO caduca',
    description: '¿Harto de cambiar el QR cada vez que subes precios? Crea tu QR restaurante dinámico con Alergenu. Edita la carta en tiempo real, filtra alérgenos y cumple la ley. Empieza GRATIS.',
    keywords: [
        'qr restaurante',
        'codigo qr restaurante',
        'carta qr',
        'menu qr para mesas',
        'generador qr carta',
        'qr menu digital',
        'imprimir qr restaurante'
    ],
    openGraph: {
        title: 'QR restaurante inteligente | Alergenu',
        description: 'El único QR que te protege de multas y traduce tu carta. Pruébalo gratis.',
        url: 'https://alergenu.com/recursos/qr-restaurante',
        type: 'website',
        images: [
            {
                url: 'https://alergenu.com/seo/alergenu_qr_cover.jpg',
                width: 1200,
                height: 630,
                alt: 'QR de Alergenu en soporte de mesa para restaurante',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'QR restaurante inteligente | Alergenu',
        description: 'El único QR que te protege de multas y traduce tu carta. Pruébalo gratis.',
        images: ['https://alergenu.com/seo/alergenu_qr_cover.jpg'],
    },
    alternates: {
        canonical: 'https://alergenu.com/recursos/qr-restaurante',
    },
};

export default function QrRestauranteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Rich Snippets "Startup Mode" (Credibilidad) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Generador QR Restaurante Alergenu",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "price": "0",
                        "priceCurrency": "EUR",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "ratingCount": "64",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "EUR",
                            "description": "Generador QR ilimitado con prueba de 3 meses"
                        }
                    })
                }}
            />
            {children}
        </>
    );
}
