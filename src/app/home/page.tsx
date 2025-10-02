import { PublicHeader } from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { ImageGallery } from '@/components/layout/ImageGallery';

export const metadata: Metadata = {
  title: 'ALERGENU | Carta digital con control de alérgenos para restaurantes y hoteles',
  description: 'Digitaliza tu menú con ALERGENU. Carta QR que filtra alérgenos automáticamente en restaurantes, bares y hoteles. Cumple normativa y protege a tus clientes.',
};

const benefits = [
  {
    id: 'shield',
    icon: '/icons/web_icons/escudo_normativa.svg',
    title: 'Cumplimos la Normativa Europea y Española.',
    description: 'Reglamento (UE) 1169/2011 y en el Real Decreto 126/2015 sobre información de alérgenos.',
  },
  {
    id: 'filter',
    icon: '/icons/web_icons/filtro_alergeno.svg',
    title: 'Filtro de alérgenos adaptado al comensal.',
    description: null,
  },
  {
    id: 'cloud',
    icon: '/icons/web_icons/actualizacion_nube.svg',
    title: 'Actualización del menú en tiempo real.',
    description: null,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      {/* Main content con padding superior reducido */}
      <main className="pt-12 pb-20">
        
        {/* Hero Section */}
        <section className="text-center w-full max-w-2xl mx-auto container px-4 pt-14">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
            Cuidamos la <span style={{ color: '#2563EB' }}>salud</span> de todos tus comensales
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-normal">
            Somos la forma más fácil de <strong>proteger a tus clientes alérgicos</strong> e intolerantes. Crea, gestiona y comparte tu menú digital en minutos.
          </p>
        </section>

        {/* Image Gallery Section (Full-width) */}
        <section className="w-full mt-16">
          <ImageGallery />
        </section>

        {/* Benefits Section */}
        <section className="w-full max-w-xs mx-auto mt-20 container">
          <ul className="space-y-10">
            {benefits.map((benefit) => (
              <li key={benefit.id} className="flex items-start gap-4">
                <div className={`flex-shrink-0 relative mt-1 ${benefit.id === 'cloud' ? 'w-9 h-9' : 'w-8 h-8'}`}>
                  <Image src={benefit.icon} alt={benefit.title} layout="fill" objectFit="contain" />
                </div>
                <div>
                  <h3 className="font-normal text-lg text-foreground/90 tracking-tight">{benefit.title}</h3>
                  {benefit.description && (
                    <p className="text-sm text-muted-foreground mt-1 font-normal">{benefit.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-sm mx-auto mt-20 text-center container px-4">
          <div className="space-y-4">
            <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }}>
              <Link href="/register">Empezar gratis hoy</Link>
            </Button>
            <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-normal text-neutral-800 hover:bg-gray-200" style={{ backgroundColor: '#D9D9D9' }}>
              <Link href="/pricing">Explorar planes y precios</Link>
            </Button>
          </div>
        </section>

      </main>
    </div>
  );
}
