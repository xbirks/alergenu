import type { Metadata } from 'next';

// Metadatos para SEO y redes sociales
export const metadata: Metadata = {
  // SEO Básico
  title: 'Inicia sesión en tu cuenta | ALERGENU',
  description: 'Accede a tu panel de control de ALERGENU. Gestiona tu carta digital, actualiza platos y alérgenos, y cumple con la normativa europea de forma fácil y rápida.',
  keywords: [
    'inicio sesión alergenu',
    'login carta digital',
    'acceso panel restaurante',
    'gestión alérgenos',
    'software hostelería',
    'carta digital restaurante',
    'panel de control alergenu'
  ],

  // Canonical URL
  alternates: {
    canonical: 'https://alergenu.com/login',
  },

  // Para WhatsApp, Facebook, etc. (Open Graph)
  openGraph: {
    title: 'Inicia sesión en tu cuenta | ALERGENU',
    description: 'Accede a tu panel de control de ALERGENU. Gestiona tu carta digital, actualiza platos y alérgenos al instante.',
    url: 'https://alergenu.com/login',
    siteName: 'Alergenu',
    images: [
      {
        url: 'https://alergenu.com/seo/alergenu_meta-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Panel de control de Alergenu para gestionar carta digital',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },

  // Para cuando se comparta en Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@alergenu',
    creator: '@alergenu',
    title: 'Inicia sesión en tu cuenta | ALERGENU',
    description: 'Accede a tu panel de control de ALERGENU. Gestiona tu carta digital, actualiza platos y alérgenos al instante.',
    images: ['https://alergenu.com/seo/alergenu_twitter-1200x600.jpg'],
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
