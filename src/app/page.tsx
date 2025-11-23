"use client";

import { useState } from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ImageGallery } from '@/components/layout/ImageGallery';
import { Faq } from '@/components/layout/Faq';
import { VideoModal } from "@/components/ui/video-modal";
import { PricingSection } from '@/components/pricing-section';

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
    title: 'Filtro de alérgenos adaptado al comensal y menú del día con IA.',
    description: null,
  },
  {
    id: 'cloud',
    icon: '/icons/web_icons/actualizacion_nube.svg',
    title: 'Registro histórico de alérgenos en la nube.',
    description: null,
  },
];

const businessBenefits = [
    {
        icon: '/icons/web_icons/escudo_normativa.svg',
        text: '<strong>Reduce el riesgo de denuncias por alérgenos</strong> con un registro claro y descargable.'
    },
    {
        icon: '/icons/web_icons/aviso.svg',
        text: '<strong>Evita sustos:</strong> los platos incompatibles ni siquiera aparecen al cliente.'
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
        text: 'Automáticamente en <strong>inglés</strong> para tus clientes internacionales.'
    },
];

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

export default function HomePage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  const videoUrl = "https://www.youtube.com/embed/yHWWIfl8vh4";
  const videoTitle = "Demostración de Alergenu";

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <VideoModal
        open={isVideoModalOpen}
        onOpenChange={setIsVideoModalOpen}
        videoUrl={videoUrl}
        title={videoTitle}
      />
      
      <main className="pt-6 pb-20">
        
        <section className="text-center w-full max-w-2xl mx-auto container px-4 pt-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
            Evita <span style={{ color: '#2563EB' }}>multas</span> por alérgenos y cumple la <span style={{ color: '#2563EB' }}>ley</span> sin complicarte
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-normal">
            Alergenu es una carta digital con filtro de alérgenos automático mediante IA y registro legal automático. Pensada para bares, restaurantes y cafeterías.
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
                <Button onClick={() => setIsVideoModalOpen(true)} className="rounded-full font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-auto text-base inline-flex items-center">
                  Ver demo
                  <span className="relative w-5 h-5 ml-2">
                      <Image src="/icons/web_icons/demo.svg" alt="Ver demo" layout="fill" />
                  </span>
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

            {/* Card 4: Selecciona los alérgenos con IA */}
            <div className="py-6 pr-6 pl-4 rounded-2xl border">
              <div className="relative w-8 h-8 mb-4">
                  <Image src="/icons/web_icons/tres_estrellas.svg" alt="Selecciona alérgenos con IA" layout="fill" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight leading-tight">Selecciona los alérgenos en tu menú del día con <span style={{ color: '#2563EB' }}><strong>IA</strong></span> para ahorrar tiempo.</h3>
            </div>

            {/* Card 5: Registro histórico de cambios */}
            <div className="py-6 pr-6 pl-4 rounded-2xl border">
              <div className="relative w-8 h-8 mb-4">
                  <Image src="/icons/web_icons/PDF_ok.svg" alt="Registro histórico de cambios" layout="fill" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight leading-tight">Registro histórico de cada cambio de tus platos en PDF.</h3>
            </div>

            {/* Card 6: Traducción automática */}
            <div className="py-6 pr-6 pl-4 rounded-2xl border">
              <div className="relative w-8 h-8 mb-4">
                  <Image src="/icons/web_icons/varios_idiomas.svg" alt="Traducción automática" layout="fill" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight leading-tight">Traducción automática al inglés de todos los platos de tu carta.</h3>
            </div>
          </div>
        </section>

        <section className="w-full max-w-2xl mx-auto mt-16 text-left container px-4">
            <p className="text-[18px] leading-[26px] text-muted-foreground">
                A través de un simple código QR, cada cliente selecciona sus alérgenos y la carta se filtra al instante, mostrando <span style={{ color: '#2563EB' }}><strong>únicamente los platos compatibles</strong></span>. Así evitamos confusiones y reducimos el riesgo de errores o intoxicaciones.
            </p>
        </section>

        {/* Video Embed Section */}
        <section className="w-full max-w-sm mx-auto mt-12 container px-4">
          <div className="aspect-[9/16] rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/z5GEeM1CD3M"
              title="Demostración de Alergenu"
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
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


        <section className="w-full max-w-4xl mx-auto mt-24 px-4">
  {/* Cabecera */}
  <div className="text-left mb-10">
    <h2 className="text-[28px] font-extrabold tracking-tight text-gray-900">
      ¿Cómo funciona Alergenu?
    </h2>
    <p className="text-[17px] text-gray-600 max-w-3xl mt-3 leading-relaxed">
      ALERGENU es una <strong>carta digital</strong> que transforma la experiencia de pedir en restaurantes, bares,
      cafeterías y hoteles.
    </p>
  </div>

  {/* Pasos */}
  <div className="space-y-5">
    {/* Paso 1 */}
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
      <div className="flex gap-5 items-start">
        <div className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-none">
          1.
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Sube tu carta
          </h3>
          <p className="mt-3 text-[17px] sm:text-[18px] text-gray-700 leading-relaxed">
            Crea las categorías, añade tus platos, marca los alérgenos y guarda
            (o deja que te ayudemos con el plan Premium).{" "}
            <span className="font-semibold text-blue-600">¡Ya la tienes!</span>
          </p>
        </div>
      </div>
    </div>

    {/* Paso 2 */}
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
      <div className="flex gap-5 items-start">
        <div className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-none">
          2.
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gestiona el menú del día con IA
          </h3>
          <p className="mt-3 text-[17px] sm:text-[18px] text-gray-700 leading-relaxed">
            Escribe el plato, haz clic en el botón “Detectar alérgenos” y guarda.{" "}
            <span className="font-semibold text-blue-600">
              Los alérgenos se marcan solos
            </span>{" "}
            y todo se actualiza al instante.
          </p>
        </div>
      </div>
    </div>

    {/* Paso 3 */}
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
      <div className="flex gap-5 items-start">
        <div className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-none">
          3.
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Tus clientes filtran y tú
            <span className="block">quedas protegido</span>
          </h3>
          <p className="mt-3 text-[17px] sm:text-[18px] text-gray-700 leading-relaxed">
            Escanean el QR de la mesa, eligen sus alergias y solo ven lo que pueden comer.
            Tú tienes un registro descargable de todo.{" "}
            <span className="font-semibold text-blue-600">¡Todos tranquilos!</span>
          </p>
        </div>
      </div>
    </div>
  </div>
          <p className="text-center text-[17px] text-muted-foreground mt-12 mb-6">
            Sencillo, ¿verdad?
          </p>
          <div className="w-full max-w-xs mx-auto">
            <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }}>
              <Link href="/register">Clic aquí para empezar</Link>
            </Button>
          </div>
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

            <PricingSection />

            <p className="text-[16px] text-muted-foreground text-left mt-10 max-w-lg mx-auto">
                Con ALERGENU no asumes riesgos: <strong>pruébalo gratis durante 3 meses</strong> y después decide si prefieres autogestionar tu carta o delegar la gestión en nuestro equipo.
            </p>
        </section>

        <Faq data={faqData} />

      </main>
    </div>
  );
}
