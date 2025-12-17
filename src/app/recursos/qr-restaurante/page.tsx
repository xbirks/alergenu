"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Bot, Globe, Filter, Shield } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import { Faq } from '@/components/layout/Faq';
import { PricingSection } from '@/components/pricing-section';
import { ImageGallery } from '@/components/layout/ImageGallery';

// FAQ Enfocada a funcionalidades avanzadas, no solo impresión
const faqQrRestaurante = [
    {
        question: '¿El QR detecta automáticamente el idioma del cliente?',
        answer: 'Sí. Si un turista inglés escanea tu QR, Alergenu detecta el idioma de su navegador y le muestra la carta traducida al inglés automáticamente. Sin que tengas que pagar traductores.'
    },
    {
        question: '¿Cómo funciona el filtro de alérgenos con IA?',
        answer: 'Es nuestra tecnología exclusiva. Tú escribes el plato y nuestra Inteligencia Artificial analiza los ingredientes para marcar los alérgenos probables. El cliente luego puede filtrar la carta para ver solo lo que puede comer.'
    },
    {
        question: '¿Ayuda este QR a vender más?',
        answer: 'Definitivamente. A diferencia de un PDF plano, Alergenu permite poner fotos de alta calidad en cada plato. Está demostrado que ver la foto de un plato o postre aumenta el apetito y el ticket medio.'
    },
    {
        question: '¿Qué seguridad legal ofrece?',
        answer: 'Cumplimos estrictamente el Reglamento (UE) 1169/2011. Además, generamos un registro histórico de cambios. Si tienes una inspección, puedes demostrar qué información de alérgenos había en tu carta en una fecha concreta.'
    }
];

export default function QrRestaurantePage() {
    return (
        <div className="min-h-screen bg-background">
            <PublicHeader />

            <main className="pt-10 pb-20">

                {/* 1. HERO SECTION: Valor real (Protección + IA) */}
                <section className="container px-4 mx-auto max-w-5xl text-center pt-12 md:pt-20">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-sm tracking-wide">
                        🧠 El primer QR con Inteligencia Artificial
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 leading-tight">
                        Transforma un simple <span className="text-blue-600">QR restaurante</span> en una herramienta de seguridad y ventas
                    </h1>
                    <p className="text-[1.125rem] text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                        La mayoría de QRs solo muestran un papel digital. <strong>Alergenu</strong> filtra alérgenos, traduce idiomas al instante y protege tu negocio de multas de sanidad.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <Button asChild size="lg" className="rounded-full h-14 px-10 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-900/20">
                            <Link href="/register">Probar la IA gratis</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-8 text-lg font-semibold text-slate-700 border-2">
                            <Link href="#diferencias">Ver tecnología</Link>
                        </Button>
                    </div>
                </section>

                {/* IMAGE GALLERY */}
                <section className="w-full mt-16">
                    <ImageGallery />
                </section>

                {/* 2. VALUE STACK: Desglosando todo lo que ofreces */}
                <section id="diferencias" className="container px-4 mx-auto mt-24 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-[32px] font-extrabold">¿Por qué un PDF ya no es suficiente?</h2>
                        <p className="text-[1.125rem] text-muted-foreground mt-4">Tu competencia usa un QR estático. Tú vas a jugar en otra liga.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Feature 1: IA (The Hook) */}
                        <div className="flex gap-6 p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <Bot size={28} color="white" strokeWidth={2} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Gestión de alérgenos con IA</h3>
                                <p className="text-[1.125rem] text-muted-foreground leading-relaxed">
                                    ¿Miedo a equivocarte marcando alérgenos? Nuestra IA analiza tus platos y te sugiere los alérgenos automáticamente. Ahorra horas de trabajo y reduce el error humano.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2: Traducción (Tourism) */}
                        <div className="flex gap-6 p-8 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Globe size={28} color="#0F1C2E" strokeWidth={2} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Traducción automática</h3>
                                <p className="text-[1.125rem] text-muted-foreground leading-relaxed">
                                    No pierdas tiempo explicando ingredientes. El QR detecta el idioma del móvil del cliente y traduce toda la carta al instante (inglés, francés, alemán...).
                                </p>
                            </div>
                        </div>

                        {/* Feature 3: UX/Filtros (User Experience) */}
                        <div className="flex gap-6 p-8 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Filter size={28} color="#0F1C2E" strokeWidth={2} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Filtros inteligentes</h3>
                                <p className="text-[1.125rem] text-muted-foreground leading-relaxed">
                                    El cliente selecciona "Sin gluten" o "Sin lactosa" y los platos incompatibles desaparecen. Evita preguntas constantes a los camareros y errores en cocina.
                                </p>
                            </div>
                        </div>

                        {/* Feature 4: Legal (Protection) */}
                        <div className="flex gap-6 p-8 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-800"></div>
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Shield size={28} color="#0F1C2E" strokeWidth={2} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Blindaje legal (Rgto. 1169/2011)</h3>
                                <p className="text-[1.125rem] text-muted-foreground leading-relaxed">
                                    Más que una carta, es un escudo. Mantenemos un registro histórico de versiones. Si hay una inspección o reacción alérgica, tienes pruebas de que la información estaba correcta.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. EDITORIAL / SEO CONTENT: "Intelligent QR" vs "Dumb QR" */}
                <section className="bg-slate-50 py-20 mt-24">
                    <div className="container px-4 mx-auto max-w-4xl">
                        <h2 className="text-[32px] font-extrabold mb-10 text-center text-slate-900">No pongas un "QR tonto" en tus mesas</h2>

                        <div className="space-y-6 text-[1.125rem] text-muted-foreground leading-relaxed">
                            <p>
                                Cuando un restaurante pone un QR que solo abre un PDF, está perdiendo dinero y asumiendo riesgos. Ese sistema es pasivo: el cliente tiene que esforzarse para leer, no puede interactuar y la información es estática.
                            </p>
                            <p>
                                El concepto de <strong>QR restaurante inteligente</strong> de Alergenu cambia las reglas del juego. No se trata de "digitalizar el papel", se trata de aprovechar la tecnología para:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 text-slate-800">
                                <li className="text-[1.125rem]"><strong>Aumentar el ticket medio</strong> mostrando fotos apetitosas de los postres.</li>
                                <li className="text-[1.125rem]"><strong>Eliminar la barrera idiomática</strong> con turistas.</li>
                                <li className="text-[1.125rem]"><strong>Dar seguridad total</strong> al comensal con alergias (que suele ser el que decide a qué restaurante va el grupo).</li>
                            </ul>
                            <p>
                                Además, nuestra plataforma incluye un <strong>aviso legal</strong> integrado que el cliente acepta al entrar, añadiendo una capa extra de protección jurídica para el hostelero que un PDF nunca podrá darte.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 4. SECCIÓN VISUAL MEJORADA: Imagen + Texto Inspirador */}
                <section className="container px-4 mx-auto mt-24 max-w-6xl">
                    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-xl">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Texto */}
                            <div className="order-2 md:order-1">
                                <h2 className="text-[32px] font-extrabold mb-6 leading-tight">
                                    Así se ve tu carta <span className="text-blue-600">inteligente</span>
                                </h2>
                                <p className="text-[1.125rem] text-muted-foreground leading-relaxed mb-6">
                                    A través de un simple código QR, cada cliente selecciona sus alérgenos y la carta se filtra al instante, mostrando <strong className="text-blue-600">únicamente los platos compatibles</strong>.
                                </p>
                                <p className="text-[1.125rem] text-muted-foreground leading-relaxed">
                                    Con Alergenu, tu carta se convierte en una <strong>herramienta de seguridad</strong> y confianza que protege a los clientes y mejora la reputación de tu negocio.
                                </p>
                            </div>

                            {/* Imagen */}
                            <div className="order-1 md:order-2">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                    <div className="aspect-square relative">
                                        <Image
                                            src="/assets/recursos/Piezas_social_media.jpg"
                                            alt="Interfaz de Alergenu mostrando carta digital con filtro de alérgenos"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. PRICING */}
                <section className="container px-4 mx-auto mt-20 max-w-4xl">
                    <div className="text-center mb-10">
                        <h2 className="text-[32px] font-extrabold">Tecnología premium, precio accesible</h2>
                        <p className="text-[1.125rem] text-muted-foreground mt-2">Pruébalo gratis. Si no ves la diferencia, no pagas.</p>
                    </div>
                    <PricingSection />
                </section>

                {/* 6. FAQ */}
                <section className="container px-4 mx-auto mt-20 max-w-3xl">
                    <h2 className="text-[32px] font-extrabold text-center mb-10">Preguntas frecuentes</h2>
                    <Faq data={faqQrRestaurante} />
                </section>

                {/* 7. CTA FINAL (Diseño aprobado) */}
                <section className="container px-4 mx-auto mt-24 mb-10">
                    <div className="bg-blue-600 rounded-3xl p-10 md:p-16 text-white shadow-2xl shadow-blue-900/20 text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Tu restaurante merece esta tecnología</h2>
                        <p className="text-blue-100 text-[1.125rem] mb-8 max-w-2xl mx-auto leading-relaxed">
                            Deja de usar herramientas del pasado. Pásate a la IA y la seguridad total.
                        </p>
                        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 rounded-full h-14 px-10 text-lg font-bold">
                            <Link href="/register">Empezar prueba de 3 meses</Link>
                        </Button>
                    </div>
                </section>

            </main>
        </div>
    );
}
