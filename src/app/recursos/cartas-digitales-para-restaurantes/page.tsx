"use client";

import Link from 'next/link';
import Image from 'next/image';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import { Faq } from '@/components/layout/Faq';
import { PricingSection } from '@/components/pricing-section';
import { ImageGallery } from '@/components/layout/ImageGallery';

// FAQ enfocado a la decisión de compra (Comparativa)
const faqSoftware = [
    {
        question: '¿Puedo personalizar el diseño con mis fotos?',
        answer: 'Sí. Alergenu permite subir fotos en alta calidad de cada plato. Una carta digital visual (tipo "food porn") ayuda a aumentar el ticket medio, igual que hacen otras plataformas como Avocaty, pero nosotros añadimos la capa de seguridad de alérgenos.'
    },
    {
        question: '¿Sirve para franquicias o grupos de restaurantes?',
        answer: 'Absolutamente. Al ser una plataforma en la nube, puedes gestionar tus cartas desde cualquier lugar. Es ideal tanto para un bar local como para cadenas que necesitan control centralizado.'
    },
    {
        question: '¿Qué diferencia a Alergenu de otras cartas digitales?',
        answer: 'La seguridad y la automatización. Mientras otros solo muestran precios y fotos, nosotros utilizamos Inteligencia Artificial para detectar alérgenos y traducir tu carta. Somos la herramienta que protege tu negocio de multas.'
    },
    {
        question: '¿Mis camareros necesitan formación?',
        answer: 'No. La herramienta es tan intuitiva que no requiere conocimientos técnicos. Además, libera a los camareros de tener que memorizar todos los ingredientes para responder a clientes con alergias.'
    }
];

export default function CartasDigitalesPage() {
    return (
        <div className="min-h-screen bg-background">
            <PublicHeader />

            <main className="pt-10 pb-20">

                {/* 1. HERO: Propuesta de valor completa */}
                <section className="container px-4 mx-auto max-w-6xl text-center pt-12 md:pt-20">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 leading-tight">
                        La evolución de las <span className="text-blue-600">cartas digitales</span> para restaurantes
                    </h1>
                    <p className="text-[1.125rem] text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                        No elijas entre diseño bonito y seguridad legal. <strong>Alergenu</strong> combina la atracción visual para vender más con la potencia de la <strong>IA</strong> para gestionar alérgenos y traducciones.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <Button asChild size="lg" className="rounded-full h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-900/10">
                            <Link href="/register">Crear cuenta gratis</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-8 text-lg font-semibold text-slate-700 border-2">
                            <Link href="#comparativa">Ver diferencias</Link>
                        </Button>
                    </div>
                </section>

                {/* IMAGE GALLERY */}
                <section className="w-full mt-16">
                    <ImageGallery />
                </section>

                {/* 2. FEATURE GRID: Respondiendo a Avocaty (Diseño) + Tu USP (IA/Legal) */}
                <section className="container px-4 mx-auto mt-24 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1: Venta Visual (Lo que tienen todos) */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="relative w-12 h-12 mb-6">
                                <Image src="/icons/web_icons/imagenes.svg" alt="Fotos" layout="fill" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Sube fotos y vende más</h3>
                            <p className="text-[1.125rem] text-muted-foreground leading-relaxed">
                                Una carta digital con fotos aumenta el ticket medio. Muestra tus platos en alta calidad para abrir el apetito de tus clientes.
                            </p>
                            <p className="text-sm text-blue-600 font-semibold mt-3">
                                ⭐ Disponible en plan Premium
                            </p>
                        </div>

                        {/* Feature 2: IA y Operativa (Tu ventaja única) */}
                        <div className="bg-blue-600 p-8 rounded-2xl border border-blue-500 shadow-lg text-white transform md:-translate-y-4">
                            <div className="relative w-12 h-12 mb-6">
                                <Image src="/icons/web_icons/tres_estrellas.svg" alt="IA" layout="fill" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Gestión con IA</h3>
                            <p className="text-[1.125rem] text-blue-100 leading-relaxed">
                                Lo que nadie más tiene. Escribe el plato y nuestra IA detecta los alérgenos. Actualiza precios en segundos y traduce automáticamente.
                            </p>
                        </div>

                        {/* Feature 3: Legalidad (Tu defensa) */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="relative w-12 h-12 mb-6">
                                <Image src="/icons/web_icons/escudo_normativa.svg" alt="Legal" layout="fill" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Cumplimiento 100%</h3>
                            <p className="text-[1.125rem] text-muted-foreground leading-relaxed">
                                Evita multas de hasta 60.000€. Cumple el Reglamento 1169/2011 con un registro histórico digital descargable ante inspecciones.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. COMPARATIVA VISUAL: Tipos de software */}
                <section id="comparativa" className="container px-4 mx-auto mt-24 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-[32px] font-extrabold">Guía: ¿qué software de carta digital elegir?</h2>
                        <p className="text-[1.125rem] text-muted-foreground mt-4">
                            Al buscar <strong>cartas digitales para restaurantes</strong>, encontrarás cientos de opciones. Básicamente existen dos tipos de tecnología:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Opción 1: PDF */}
                        <div className="p-8 rounded-3xl border border-gray-200 bg-gray-50">
                            <h3 className="text-2xl font-bold text-gray-500 mb-6 flex items-center gap-2">
                                <span>⛔</span> Visores de PDF (tecnología obsoleta)
                            </h3>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">×</span>
                                    <p className="text-[1.125rem]">El cliente debe hacer zoom constantemente.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">×</span>
                                    <p className="text-[1.125rem]">No se adapta al móvil.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">×</span>
                                    <p className="text-[1.125rem]">No permite filtrar alérgenos.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">×</span>
                                    <p className="text-[1.125rem]">Si cambias un precio, el QR deja de funcionar.</p>
                                </li>
                            </ul>
                        </div>

                        {/* Opción 2: Alergenu */}
                        <div className="p-8 rounded-3xl border-2 border-blue-100 bg-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">RECOMENDADO</div>
                            <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                                <span>✅</span> WebApps interactivas (Alergenu)
                            </h3>
                            <ul className="space-y-4 text-slate-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <p className="text-[1.125rem]"><strong>Diseño móvil:</strong> navegación perfecta sin hacer zoom.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <p className="text-[1.125rem]"><strong>Filtro de alérgenos:</strong> el cliente interactúa con la carta.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <p className="text-[1.125rem]"><strong>IA integrada:</strong> detecta alérgenos automáticamente.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <p className="text-[1.125rem]"><strong>Actualización instantánea:</strong> cambia precios sin reimprimir QR.</p>
                                </li>
                            </ul>
                            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                                <p className="text-[1.125rem] text-blue-800">
                                    <strong>⚠️ Diferencia clave:</strong> la mayoría de WebApps bonitas te obligan a introducir los alérgenos a mano (con riesgo de error). Alergenu es la única que te asiste con <strong>Inteligencia Artificial</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. IMAGEN GRANDE / DEMO */}
                <section className="container px-4 mx-auto mt-24 text-center">
                    <h2 className="text-[32px] font-extrabold mb-6">Así se ve tu restaurante en el móvil</h2>
                    <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 border border-gray-200">
                        <Image
                            src="/assets/recursos/Piezas_social_media.jpg"
                            alt="Carta digital con fotos y filtro de alérgenos"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </section>

                {/* 5. PRECIOS */}
                <section className="container px-4 mx-auto mt-20 max-w-4xl">
                    <div className="text-center mb-10">
                        <h2 className="text-[32px] font-extrabold">Un software potente, un precio justo</h2>
                        <p className="text-[1.125rem] text-muted-foreground mt-2">Empieza gratis. Sin costes de alta ni permanencia.</p>
                    </div>
                    <PricingSection />
                </section>

                {/* 6. FAQ */}
                <Faq data={faqSoftware} />

                {/* 7. CTA FINAL */}
                <section className="container px-4 mx-auto mt-24 mb-10">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-16 text-white shadow-2xl text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Moderniza tu sala hoy mismo</h2>
                        <p className="text-slate-300 text-[1.125rem] mb-8 max-w-2xl mx-auto leading-relaxed">
                            Únete a los restaurantes que ya usan IA para proteger a sus clientes y ahorrar tiempo.
                        </p>
                        <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 rounded-full h-14 px-10 text-lg font-bold">
                            <Link href="/register">Empezar prueba de 3 meses</Link>
                        </Button>
                    </div>
                </section>

            </main>
        </div>
    );
}
