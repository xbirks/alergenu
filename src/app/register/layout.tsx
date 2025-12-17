import type { Metadata } from 'next';

// Metadatos para SEO y redes sociales
export const metadata: Metadata = {
  // SEO Básico
  title: 'Regístrate gratis y crea tu carta digital con alérgenos | ALERGENU',
  description: 'Crea tu cuenta gratis en ALERGENU y empieza a gestionar tu carta digital con filtro de alérgenos. 3 meses de prueba gratuita sin permanencia. Cumple la normativa europea (Reglamento 1169/2011) de forma fácil.',
  keywords: [
    'registro alergenu',
    'crear carta digital gratis',
    'software hostelería gratuito',
    'carta alérgenos restaurante',
    'prueba gratis 3 meses',
    'normativa alérgenos',
    'reglamento 1169/2011',
    'menú digital qr'
  ],

  // Canonical URL
  alternates: {
    canonical: 'https://alergenu.com/register',
  },

  // Open Graph
  openGraph: {
    title: 'Regístrate gratis y crea tu carta digital con alérgenos | ALERGENU',
    description: 'Crea tu cuenta gratis en ALERGENU. 3 meses de prueba gratuita para gestionar tu carta digital con filtro de alérgenos. Sin permanencia.',
    url: 'https://alergenu.com/register',
    siteName: 'Alergenu',
    images: [
      {
        url: 'https://alergenu.com/seo/alergenu_meta-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Regístrate en Alergenu y crea tu carta digital gratis',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@alergenu',
    creator: '@alergenu',
    title: 'Regístrate gratis y crea tu carta digital con alérgenos | ALERGENU',
    description: 'Crea tu cuenta gratis en ALERGENU. 3 meses de prueba gratuita para gestionar tu carta digital con filtro de alérgenos.',
    images: ['https://alergenu.com/seo/alergenu_twitter-1200x600.jpg'],
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
