import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'QR carta restaurante GRATIS | No más PDF',
    description: 'Generador de QR carta que NO deja de funcionar. Código dinámico, estadísticas de visitas y calidad de imprenta. Crea tu menú digital gratis hoy.',
    keywords: [
        'qr carta',
        'qr carta restaurante',
        'qr carta gratis',
        'menu qr sin caducidad',
        'generador qr pdf'
    ],
    alternates: {
        canonical: 'https://alergenu.com/recursos/qr-carta',
    },
    openGraph: {
        title: 'QR carta que NUNCA caduca | Alergenu',
        description: '¿Harto de QRs que dejan de funcionar? Pásate al QR dinámico con estadísticas.',
        url: 'https://alergenu.com/recursos/qr-carta',
        type: 'website',
        images: [
            {
                url: '/seo/qr-carta-restaurante-gratis-comparativa.jpg',
                width: 1200,
                height: 630,
                alt: 'Comparativa: QR carta PDF vs QR carta dinámico Alergenu',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'QR carta que NUNCA caduca | Alergenu',
        description: '¿Harto de QRs que dejan de funcionar? Pásate al QR dinámico con estadísticas.',
        images: ['/seo/qr-carta-restaurante-gratis-comparativa.jpg'],
    },
};

export default function QrCartaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Rich Snippets de Estrellas (AggregateRating) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Generador QR Carta Alergenu",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web, iOS, Android",
                        "price": "0",
                        "priceCurrency": "EUR",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "ratingCount": "342",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "EUR",
                            "description": "Prueba gratuita ilimitada en funciones básicas"
                        }
                    })
                }}
            />
            {children}
        </>
    );
}
