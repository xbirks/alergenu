import type { Metadata } from 'next';

export const metadata: Metadata = {

    title: 'Ley de Alérgenos en Pastelerías y Panaderías [Guía Obligatoria 2026]',
  description: '¿Te pueden multar por no etiquetar la vitrina? Descubre la normativa de alérgenos para venta a granel en obradores. Solución digital para cumplir la ley sin llenar el mostrador de carteles.',
    
    keywords: [
        'alérgenos pastelería',
        'alérgenos panadería',
        'etiquetado venta a granel', // Keyword crítica para este sector
        'normativa alérgenos obrador',
        'carta digital pastelería',
        'multas sanidad panadería',
        'contaminación cruzada harina',
        'carteles alérgenos vitrina'
    ],
    
    openGraph: {
        title: 'Obligación de Alérgenos en Pastelería: Evita Multas y Errores',
        description: 'Guía legal sobre cómo informar de los alérgenos en productos a granel. Olvida las etiquetas manuales y pásate al formato digital.',
        url: 'https://alergenu.com/blog/alergenos-pastelerias-panaderias', // Ajusta la URL si es distinta
        type: 'article',
        publishedTime: '2025-01-11T00:00:00Z',
        authors: ['Alergenu Legal Team'],
        images: [
            {
                url: 'https://alergenu.com/seo/alergenu_pasteleria_vitrina.jpg', // Asegúrate de tener una imagen de una vitrina/panadería
                width: 1200,
                height: 630,
                alt: 'Vitrina de pastelería con identificación digital de alérgenos',
            },
        ],
    },
    
    twitter: {
        card: 'summary_large_image',
        title: 'Guía Legal: Alérgenos en Panaderías y Pastelerías',
        description: '¿Cómo cumplir la normativa 1169/2011 en venta a granel sin papeles? Lee la guía.',
        images: ['https://alergenu.com/seo/alergenu_twitter_pasteleria.jpg'],
    },
    
    alternates: {
        canonical: 'https://alergenu.com/blog/alergenos-pastelerias-panaderias',
    },
};

export default function AlergenosPasteleriasArticleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* SCHEMA ORG: Article + FAQPage (Doble impacto en Google) */}
            {/* Esto le dice a Google que eres una autoridad en el tema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "Article",
                                "headline": "Ley de Alérgenos en Pastelerías y Panaderías [Guía Obligatoria 2025]",
                                "description": "Guía completa sobre la obligación de informar sobre alérgenos en pastelerías. Soluciones para vitrinas.",
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
                                "datePublished": "2025-01-11",
                                "dateModified": "2025-01-11"
                            },
                            {
                                "@type": "FAQPage",
                                "mainEntity": [
                                    {
                                        "@type": "Question",
                                        "name": "¿Es obligatorio tener carta de alérgenos en una panadería?",
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": "Sí. Según el Reglamento 1169/2011, todo producto no envasado (venta a granel) debe tener la información de alérgenos disponible y accesible para el cliente antes de la compra."
                                        }
                                    },
                                    {
                                        "@type": "Question",
                                        "name": "¿Cómo etiquetar alérgenos en la vitrina?",
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": "Puedes usar carteles individuales (poco práctico por los cambios diarios) o un sistema digital como un código QR que lleve al listado actualizado de productos del día."
                                        }
                                    }
                                ]
                            }
                        ]
                    })
                }}
            />
            {children}
        </>
    );
}