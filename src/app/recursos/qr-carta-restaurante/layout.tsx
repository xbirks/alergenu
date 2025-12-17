import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'QR carta restaurante: generador de menú digital dinámico',
    description: 'Crea el código QR para la carta de tu restaurante. Sistema dinámico: cambia precios y platos sin tener que volver a imprimir los códigos QR de las mesas.',
    keywords: [
        'qr carta restaurante',
        'codigo qr menu',
        'carta digital qr gratis',
        'generador qr hosteleria',
        'menu qr sin contacto'
    ],
    alternates: {
        canonical: 'https://alergenu.com/recursos/qr-carta-restaurante',
    },
    openGraph: {
        title: 'QR carta restaurante | Códigos dinámicos e inteligentes',
        description: 'Genera QRs que no caducan. Cambia tu carta en tiempo real sin reimprimir pegatinas.',
        url: 'https://alergenu.com/recursos/qr-carta-restaurante',
        type: 'website',
        images: [
            {
                url: '/seo/alergenu_qr_cover.jpg',
                width: 1200,
                height: 630,
                alt: 'Código QR de Alergenu en una mesa de restaurante',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'QR carta restaurante | Códigos dinámicos',
        description: 'Genera QRs que no caducan. Cambia tu carta en tiempo real sin reimprimir pegatinas.',
        images: ['/seo/alergenu_qr_cover.jpg'],
    },
};

export default function QrCartaLayout({
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
                        "name": "Generador QR Carta Alergenu",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web, iOS, Android",
                        "price": "0",
                        "priceCurrency": "EUR",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "ratingCount": "76",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "EUR",
                            "description": "Generador QR dinámico con prueba gratuita"
                        }
                    })
                }}
            />
            {children}
        </>
    );
}