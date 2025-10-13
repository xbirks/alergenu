
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { LegalFooter } from '@/components/layout/Footer';
import Script from 'next/script';

const manrope = Manrope({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ['400', '500', '700', '800']
});

// -----------------------------------------------------------------------------
// METADATA - Por favor, rellena los campos marcados con __TU_DATO_AQUI__
// -----------------------------------------------------------------------------
export const metadata: Metadata = {
  // --- GENÉRICO ---
  title: 'Crea tu carta digital con Alérgenos gratis | ALERGENU',
  description: 'Crea y gestiona la carta de tu restaurante, actualiza precios y platos al instante y cumple con la ley de alérgenos de forma fácil y rápida.',
  applicationName: 'Alergenu',
  keywords: [
    'carta digital para restaurante',
    'gestor de alérgenos',
    'software para hostelería',
    'menú digital QR',
    'cumplir ley de alérgenos',
    'carta online',
    'alergenos en restaurantes'
  ],
  authors: [{ name: 'Ermo Estudio', url: 'https://alergenu.com' }],
  creator: 'Andrés Ortega Montoya',
  publisher: 'Andrés Ortega Montoya',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  revisitAfter: '1 days',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // --- OPEN GRAPH (PARA REDES SOCIALES COMO FACEBOOK, LINKEDIN) ---
  openGraph: {
    title: 'Crea gratis tu carta digital con alérgenos | ALERGENU',
    description: 'Software para hostelería. Gestiona tu carta digital y alérgenos de forma fácil y rápida.',
    url: 'https://alergenu.com',
    type: 'website',
    images: [
      {
        url: 'https://alergenu.com/seo/alergenu_meta-1200x630.jpg', 
        width: 1200,
        height: 630,
        alt: 'Panel de control de Alergenu para gestionar una carta digital de restaurante.',
      },
    ],
    siteName: 'Alergenu',
    locale: 'es_ES',
  },

  // --- TWITTER ---
  twitter: {
    card: 'summary_large_image',
    site: '@alergenu', // LÍNEA 75
    creator: '@alergenu', // LÍNEA 76
    title: 'Alergenu | Crea tu Carta Digital con Alérgenos para Restaurantes',
    description: 'Software para hostelería. Gestiona tu carta digital y alérgenos de forma fácil y rápida.',
    images: ['https://alergenu.com/seo/alergenu_twitter-1200x600.jpg'], 
  },

  // --- APPLE & FAVICONS ---
  // Estas imágenes deben estar en tu carpeta /public
  icons: {
    icon: 'https://alergenu.com/favicon/favicon-32x32.png', // Asegúrate de tener estos archivos en /public
    shortcut: '/favicon.ico',
    apple: 'https://alergenu.com/favicon/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0F1C2E" />

        {/* JSON-LD - Marcado de datos estructurados para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Alergenu",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "description": "Software para restaurantes para crear y gestionar cartas digitales, actualizando precios y platos al instante y cumpliendo con la ley de alérgenos.",
              "url": "https://alergenu.com",
              "logo": "https://alergenu.com/alergenu.png",
              "publisher": {
                "@type": "Organization",
                "name": "Alergenu",
                "url": "https://alergenu.com"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              }
            })
          }}
        />

        {/* Google Analytics (opcional, si usas GA4) */}
        <Script
          id="gtag-src"
          src={`https://www.googletagmanager.com/gtag/js?id=__TU_GOOGLE_ANALYTICS_ID__`} // LÍNEA 135
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '__TU_GOOGLE_ANALYTICS_ID__'); // LÍNEA 146
            `,
          }}
        />
      </head>

      <body className={`flex flex-col min-h-screen bg-white ${manrope.className}`}>
        <div className="flex-grow">{children}</div>
        <LegalFooter />
      </body>
    </html>
  );
}
