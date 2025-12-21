import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { LegalFooter } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/CookieBanner';
import Script from 'next/script';

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ['400', '500', '700', '800'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true
});

const faqData = [
  {
    question: '¿Qué pasa después de los 3 meses gratis?',
    answer: 'Tras el periodo de prueba puedes elegir entre el Plan Autonomía o el Plan Premium. Si no eliges ningún plan, tu carta dejará de estar visible hasta que activas una suscripción.'
  },
  {
    question: '¿Necesito conocimientos técnicos para usar ALERGENU?',
    answer: 'No. La plataforma es muy sencilla: solo tienes que subir tus platos e indicar los alérgenos. Si eliges el Plan Premium, nuestro equipo lo hará todo por ti.'
  },
  {
    question: '¿Puedo actualizar mi carta todos los días?',
    answer: 'Sí. Puedes modificar platos, precios y alérgenos en cualquier momento, y los cambios se muestran al instante en el QR de tus clientes.'
  },
  {
    question: '¿Funciona en varios idiomas?',
    answer: 'Sí. ALERGENU permite mostrar la carta en varios idiomas para adaptarse a clientes internacionales, una función muy útil en hoteles y restaurantes turísticos. La disponibilidad de idiomas depende del plan contratado: en Autonomía tienes 2 idiomas incluidos (ej. español e inglés), mientras que en Premium puedes añadir todos los que necesites.'
  },
  {
    question: '¿Es legalmente suficiente mostrar los alérgenos en ALERGENU?',
    answer: 'Sí. La app cumple con el Reglamento (UE) 1169/2011 y el Real Decreto 126/2015 en España. Además, añadimos un aviso legal para reforzar la seguridad del hostelero.'
  },
  {
    question: '¿La responsabilidad de la información es de ALERGENU o del restaurante?',
    answer: 'La responsabilidad final siempre recae en el establecimiento. La normativa europea (Reglamento 1169/2011) exige que los restaurantes comuniquen de forma clara los alérgenos de sus platos. ALERGENU actúa como una herramienta que facilita esa tarea y presenta la información de forma clara y accesible, pero son los restaurantes quienes deben asegurarse de que los datos introducidos son correctos y están actualizados.'
  }
];

export const metadata: Metadata = {
  title: 'Crea tu carta digital con alérgenos gratis | ALERGENU',
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
  twitter: {
    card: 'summary_large_image',
    site: '@alergenu',
    creator: '@alergenu',
    title: 'Alergenu | Crea tu Carta Digital con Alérgenos para Restaurantes',
    description: 'Software para hostelería. Gestiona tu carta digital y alérgenos de forma fácil y rápida.',
    images: ['https://alergenu.com/seo/alergenu_twitter-1200x600.jpg'],
  },
  icons: {
    icon: 'https://alergenu.com/favicon/favicon-32x32.png',
    shortcut: '/favicon.ico',
    apple: 'https://alergenu.com/favicon/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  const shouldLoadAnalytics = typeof window !== 'undefined' && (() => {
    try {
      const consent = localStorage.getItem('alergenu_cookie_consent');
      const preferences = localStorage.getItem('alergenu_cookie_preferences');
      if (consent === 'true' && preferences) {
        const parsed = JSON.parse(preferences);
        return parsed.analytics === true;
      }
    } catch (e) {
      return false;
    }
    return false;
  })();

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0F1C2E" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
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
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "ratingCount": "84",
                    "bestRating": "5",
                    "worstRating": "1"
                  }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": faqData.map(item => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": item.answer
                    }
                  }))
                }
              ]
            })
          }}
        />

        {gaMeasurementId && shouldLoadAnalytics && (
          <>
            <Script
              id="gtag-src"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
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
                  gtag('config', '${gaMeasurementId}');
                `,
              }}
            />
          </>
        )}
      </head>

      <body className={`flex flex-col min-h-screen bg-white ${manrope.className}`}>
        <div className="flex-grow">{children}</div>
        <LegalFooter />
        <CookieBanner />
      </body>
    </html>
  );
}