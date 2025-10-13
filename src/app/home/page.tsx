import { PublicHeader } from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { ImageGallery } from '@/components/layout/ImageGallery';
import { Faq } from '@/components/layout/Faq';

export const metadata: Metadata = {
  title: 'Crea gratis tu carta digital con alérgenos | ALERGENU',
  description: 'Crea y gestiona la carta de tu restaurante, actualiza precios y platos al instante y cumple con la ley de alérgenos de forma fácil y rápida.',
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

const businessBenefits = [
    {
        icon: '/icons/web_icons/escudo_normativa.svg',
        text: '<strong>Protege a tu negocio</strong> frente a reclamaciones y sanciones legales.'
    },
    {
        icon: '/icons/web_icons/aviso.svg',
        text: 'Evita que los clientes pidan platos con alérgenos <strong>por error</strong>.'
    },
    {
        icon: '/icons/web_icons/ahorrar_tiempo.svg',
        text: 'Los camareros <strong>ahorran tiempo</strong> y evitan la responsabilidad de confirmar alérgenos.'
    },
    {
        icon: '/icons/web_icons/qr_icon.svg',
        text: 'Acceso inmediato a la carta con un simple <strong>QR</strong>.'
    },
    {
        icon: '/icons/web_icons/varios_idiomas.svg',
        text: 'Disponible en <strong>varios idiomas</strong> para tus clientes internacionales.'
    },
];

const pricingPlans = [
  {
    id: 'gratuito',
    name: 'Plan Gratuito',
    badge: '3 meses gratis',
    features: [
      'Todas las funcionalidades incluidas.',
      'Crea platos y bebidas de forma ilimitada.',
      'Generador de QR para la carta.',
      '<span class="text-blue-600">Filtro de alérgenos incluido.</span>',
      'Atención al cliente por e-mail.',
    ],
    buttonText: 'Empieza 100% gratis',
    isFeatured: false,
  },
  {
    id: 'autonomia',
    name: 'Plan Autonomía',
    price: '19€',
    priceDetails: 'Mensual, IVA inc.',
    features: [
      'Todas las funcionalidades incluidas.',
      'Crea platos y bebidas de forma ilimitada.',
      'Generador de QR para la carta.',
      '<span class="text-blue-600">Filtro de alérgenos incluido.</span>',
      'Gestión 100% autónoma del menú y los alérgenos.',
      'Atención al cliente por e-mail.',
      'Crea la carta en 2 idiomas diferentes.',
    ],
    buttonText: 'Suscribirse',
    isFeatured: false,
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    price: '49€',
    priceDetails: 'Mensual, IVA inc.',
    features: [
      'Todas las funcionalidades del <strong>plan autonomía</strong> incluidas.',
      '<span class="text-blue-600">Delega la gestión de la carta y los alérgenos para que la trabaje nuestro equipo.</span>',
      'Personalización avanzada de la carta.',
      'Atención al cliente prioritaria, por teléfono y Whatsapp.',
      'Idiomas ilimitados.',
    ],
    buttonText: 'Suscribirse',
    isFeatured: true,
  },
];

const faqData = [
    {
        question: '¿Qué pasa después de los 3 meses gratis?',
        answer: 'Tras el periodo de prueba puedes elegir entre el Plan Autonomía o el Plan Premium. Si no eliges ningún plan, tu carta dejará de estar visible hasta que actives una suscripción.'
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      <main className="pt-6 pb-20">
        
        <section className="text-center w-full max-w-2xl mx-auto container px-4 pt-10">
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
            <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-semibold text-neutral-800 hover:bg-gray-200" style={{ backgroundColor: '#D9D9D9' }}>
              <Link href="#precios">Explorar planes y precios</Link>
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

        {/* Video Placeholder Section */}
        <section className="w-full max-w-2xl mx-auto mt-12 container px-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/assets/carrusel_(2).jpg"
              alt="Demostración de Alergenu en un móvil"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="bg-white/90 rounded-full w-24 h-24 flex items-center justify-center backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-black/80" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                    </svg>
                </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-2xl mx-auto mt-12 text-center container px-4">
            <p className="text-[18px] leading-[26px] text-muted-foreground">
                Con ALERGENU, tu carta se convierte en una <strong>herramienta de seguridad</strong> y confianza que protege a los clientes y mejora la reputación de tu negocio.
            </p>
        </section>

        <section className="w-full max-w-sm mx-auto mt-10 text-center container px-4">
            <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }}>
              <Link href="/register">Pruébalo gratis aquí</Link>
            </Button>
        </section>

        {/* Business Benefits Section */}
        <section className="w-full max-w-2xl mx-auto mt-28 container px-4">
            <div className="text-left mb-10">
                <h2 className="text-[32px] font-extrabold tracking-tight">Beneficios de Alergenu</h2>
                <p className="text-[18px] text-muted-foreground mt-4">
                    ALERGENU es una <strong>herramienta de protección</strong> para los negocios de hostelería: evita confusiones con los alérgenos, reduce riesgos legales y transmite seguridad a los clientes.
                </p>
            </div>

            <div className="rounded-2xl p-8" style={{ backgroundColor: '#F2F2F2' }}>
                <ul className="space-y-7">
                    {businessBenefits.map((item, index) => (
                        <li key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 relative w-7 h-7 mt-0.5">
                                <Image src={item.icon} alt="" layout="fill" />
                            </div>
                            <p className="text-[17px] text-gray-800 leading-snug" dangerouslySetInnerHTML={{ __html: item.text }} />
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-10 rounded-2xl overflow-hidden shadow-lg">
                <div className="relative aspect-[16/9]">
                    <Image src="/assets/restaurante_01.jpg" alt="Interior de un restaurante elegante" layout="fill" objectFit="cover" />
                </div>
            </div>

            <div className="mt-12 text-center">
                <Button asChild size="lg" className="rounded-full h-14 text-lg font-bold px-8" style={{ backgroundColor: '#2563EB' }}>
                    <Link href="/register">Prueba 3 meses gratis</Link>
                </Button>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="precios" className="w-full max-w-2xl mx-auto mt-28 container px-4">
            <div className="text-left mb-12">
                <h2 className="text-[32px] font-extrabold tracking-tight">Planes y precios</h2>
                <p className="text-[18px] text-muted-foreground mt-4">
                    Elige el plan que mejor se adapte a tu negocio. Empieza gratis y cambia de plan en cualquier momento.
                </p>
            </div>

            <div className="space-y-8">
                {pricingPlans.map((plan, index) => (
                    <div key={index} className={`rounded-2xl p-8 ${plan.isFeatured ? 'bg-primary text-primary-foreground' : 'bg-[#F2F2F2]'}`}>
                        <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-bold tracking-tight">{plan.name}</h3>
                            {plan.badge && <span className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">{plan.badge}</span>}
                            {plan.price && (
                                <div className="text-right">
                                    <p className={`text-3xl font-bold ${plan.isFeatured ? 'text-primary-foreground' : 'text-primary'}`}>{plan.price}</p>
                                    <p className={`text-xs ${plan.isFeatured ? 'text-gray-300' : 'text-muted-foreground'}`}>{plan.priceDetails}</p>
                                </div>
                            )}
                        </div>

                        <ul className="mt-6 space-y-2">
                            {plan.features.map((feature, i) => {
                                if (i === 0) {
                                    return (
                                        <li key={i}>
                                            <span className="underline" dangerouslySetInnerHTML={{ __html: feature }} />
                                        </li>
                                    );
                                }
                                return (
                                    <li key={i} className="flex items-start gap-2">
                                        <span>•</span>
                                        <span dangerouslySetInnerHTML={{ __html: feature }} />
                                    </li>
                                );
                            })}
                        </ul>

                        <Button asChild size="lg" className={`w-full rounded-full h-14 text-lg font-bold mt-8 ${plan.isFeatured ? 'bg-blue-600 hover:bg-blue-700' : 'bg-primary hover:bg-primary/90 text-white'}`}>
                            <Link href={`/register?plan=${plan.id}`}>{plan.buttonText}</Link>
                        </Button>
                    </div>
                ))}
            </div>

            <p className="text-[16px] text-muted-foreground text-left mt-10 max-w-lg mx-auto">
                Con ALERGENU no asumes riesgos: <strong>pruébalo gratis durante 3 meses</strong> y después decide si prefieres autogestionar tu carta o delegar la gestión en nuestro equipo.
            </p>
        </section>

        <Faq data={faqData} />

      </main>
    </div>
  );
}
