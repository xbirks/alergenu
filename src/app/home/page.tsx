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
      
      <main className="pt-12 pb-20">
        
        <section className="text-center w-full max-w-2xl mx-auto container px-4 pt-14">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
            Cuidamos la <span style={{ color: '#2563EB' }}>salud</span> de todos tus comensales
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-normal">
            Somos la forma más fácil de <strong>proteger a tus clientes alérgicos</strong> e intolerantes. Crea, gestiona y comparte tu menú digital en minutos.
          </p>
        </section>

        <section className="w-full mt-16">
          <ImageGallery />
        </section>

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

        {/* What is Alergenu Section */}
        <section className="w-full max-w-4xl mx-auto mt-28 container px-4">
          <div className="text-left mb-12">
            <h2 className="text-[32px] font-extrabold tracking-tight">¿Qué es Alergenu?</h2>
            <p className="text-[18px] text-muted-foreground max-w-3xl mt-4">
              ALERGENU es una <strong>carta digital</strong> que transforma la experiencia de pedir en restaurantes, bares, cafeterías y hoteles.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Card 1: Filtro automático */}
            <div className="py-6 pr-6 pl-4 rounded-2xl border flex flex-col justify-between">
              <div>
                <div className="relative w-8 h-8 mb-4">
                    <Image src="/icons/web_icons/filtro_alergeno.svg" alt="Filtrado automático" layout="fill" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight leading-tight">Filtrado automático de los alérgenos en tiempo real.</h3>
              </div>
              <div className="pt-6">
                <Button asChild className="rounded-full font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-auto text-base">
                  <Link href="#" className="inline-flex items-center">
                    Ver demo
                    <span className="relative w-5 h-5 ml-2">
                        <Image src="/icons/web_icons/demo.svg" alt="Ver demo" layout="fill" />
                    </span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Card 2: Cumplimiento normativo */}
            <div className="py-6 pr-6 pl-4 rounded-2xl border">
              <div className="relative w-8 h-8 mb-4">
                  <Image src="/icons/web_icons/escudo_normativa.svg" alt="Cumplimiento normativo" layout="fill" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight leading-tight">Cumplimiento con la normativa europea de alérgenos.</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-tight">
                Reglamento (UE) 1169/2011 y en el Real Decreto 126/2015 sobre información de alérgenos.
              </p>
            </div>

            {/* Card 3: Platos incompatibles */}
            <div className="py-6 pr-6 pl-4 rounded-2xl border">
              <div className="relative w-8 h-8 mb-4">
                  <Image src="/icons/web_icons/aviso.svg" alt="Platos incompatibles no aparecen" layout="fill" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight leading-tight">
                  Los platos incompatibles <span style={{ color: '#E12F2F' }}>NO aparecen</span> para evitar confusión.
              </h3>
            </div>

            {/* Card 4: Confianza y tranquilidad */}
            <div className="py-6 pr-6 pl-4 rounded-2xl border">
              <div className="relative w-8 h-8 mb-4">
                  <Image src="/icons/web_icons/tres_estrellas.svg" alt="Más confianza y tranquilidad" layout="fill" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight leading-tight">Más confianza y tranquilidad para los comensales.</h3>
            </div>
          </div>
        </section>

        <section className="w-full max-w-2xl mx-auto mt-16 text-left container px-4">
            <p className="text-[18px] leading-[26px] text-muted-foreground">
                A través de un simple código QR, cada cliente selecciona sus alérgenos y la carta se <strong>filtra al instante, mostrando únicamente los platos compatibles</strong>. Así evitamos confusiones y reducimos el riesgo de errores o intoxicaciones.
            </p>
        </section>

      </main>
    </div>
  );
}
