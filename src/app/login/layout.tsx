import type { Metadata } from 'next';

// Metadatos para SEO y redes sociales
export const metadata: Metadata = {
  // SEO Básico
  title: 'Inicia sesión en tu cuenta | ALERGENU',
  description: 'Inicia sesión y empieza a editar tu carta de forma simple y sencilla.',
  keywords: ['inicio sesión', 'iniciar sesión alergenu', 'carta alérgenos', 'software hostelería', 'Alergenu'],

  // Para WhatsApp, Facebook, etc. (Open Graph)
  openGraph: {
    title: 'Inicia sesión en tu cuenta | ALERGENU',
    description: 'Inicia sesión y empieza a editar tu carta de forma simple y sencilla.',
    url: 'https://www.alergenu.com/login',
    siteName: 'Alergenu',
    images: [
      {
        url: 'https://alergenu.com/seo/alergenu_meta-1200x630.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },

  // Para cuando se comparta en Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Inicia sesión en tu cuenta | ALERGENU',
    description: 'Inicia sesión y empieza a editar tu carta de forma simple y sencilla.',
    images: ['https://alergenu.com/seo/alergenu_twitter-1200x600.jpg'],
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
