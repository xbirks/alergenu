import type { Metadata } from 'next';

// Metadatos para SEO y redes sociales
export const metadata: Metadata = {
  // SEO Básico
  title: 'Regístrate y crea gratis tu carta | ALERGENU',
  description: 'Regístrate gratis y empieza a crear tu carta digital para alérgenos. Cumple con la normativa y ofrece un mejor servicio a tus clientes.',
  keywords: ['registro alergenu', 'crear carta alérgenos', 'software hostelería gratis', 'Alergenu', 'normativa alérgenos'],

  // Open Graph
  openGraph: {
    title: 'Regístrate y crea gratis tu carta | ALERGENU',
    description: 'Regístrate gratis y empieza a crear tu carta digital para alérgenos. Cumple con la normativa y ofrece un mejor servicio a tus clientes.',
    url: 'https://www.alergenu.com/register',
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

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Regístrate y crea gratis tu carta | ALERGENU',
    description: 'Regístrate gratis y empieza a crear tu carta digital para alérgenos. Cumple con la normativa y ofrece un mejor servicio a tus clientes.',
    images: ['https://alergenu.com/seo/alergenu_twitter-1200x600.jpg'],
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
