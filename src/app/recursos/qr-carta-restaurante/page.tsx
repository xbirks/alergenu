"use client";

import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import { Faq } from '@/components/layout/Faq';
import { PricingSection } from '@/components/pricing-section';
import { ImageGallery } from '@/components/layout/ImageGallery';

// FAQ Específico para QR
const faqQR = [
    {
        question: '¿Si cambio un precio, tengo que volver a imprimir el código QR?',
        answer: 'No. Los códigos QR de Alergenu son dinámicos. Esto significa que puedes cambiar platos, precios, fotos o alérgenos en el panel de control y el cliente verá la versión actualizada automáticamente usando el mismo QR que ya tienes pegado en la mesa.'
    },
    {
        question: '¿Cómo obtengo los QR para mis mesas?',
        answer: 'Al registrarte y crear tu carta, la plataforma genera automáticamente un archivo con tu código QR único listo para descargar e imprimir en pegatinas, metacrilatos o papel.'
    },
    {
        question: '¿El QR funciona con cualquier móvil?',
        answer: 'Sí. Funciona con la cámara nativa de cualquier iPhone o Android moderno sin necesidad de que tus clientes se bajen ninguna aplicación extra.'
    },
    {
        question: '¿Caduca el código QR?',
        answer: 'Mientras tu cuenta esté activa (incluso en la versión de prueba), el QR funcionará perfectamente. No tiene límite de escaneos.'
    }
];

export default function QrCartaPage() {
    return (
        <div className="min-h-screen bg-background">
            <PublicHeader />

            <main className="pt-10 pb-20">

                {/* HERO SECTION */}
                <section className="container px-4 mx-auto max-w-5xl text-center pt-12 md:pt-20">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 leading-tight">
                        Consigue tu <span className="text-blue-600">QR carta restaurante</span> profesional en minutos
                    </h1>
                    <p className="text-[1.125rem] text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                        No uses generadores gratuitos que caducan. Crea una <strong>carta QR profesional</strong>, editable en tiempo real y que cumple la ley de alérgenos.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <Button asChild size="lg" className="rounded-full h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20">
                            <Link href="/register">Generar mi QR gratis</Link>
                        </Button>
                        <Button asChild variant="ghost" size="lg" className="rounded-full h-14 px-8 text-lg font-semibold text-slate-600 hover:bg-slate-100">
                            <Link href="#como-funciona">¿Cómo funciona?</Link>
                        </Button>
                    </div>
                </section>

                {/* IMAGE GALLERY */}
                <section className="w-full mt-16">
                    <ImageGallery />
                </section>

                {/* COMPARATIVA */}
                <section className="container px-4 mx-auto mt-24 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-[32px] font-extrabold">Cuidado con los "QR gratuitos" de internet</h2>
                        <p className="text-[1.125rem] text-muted-foreground mt-4">
                            La mayoría de generadores de QR crean enlaces estáticos. Si subes un PDF nuevo, el QR deja de funcionar.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Lo que ofrecen otros */}
                        <div className="p-8 rounded-3xl border border-gray-200 bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-500 mb-6 flex items-center gap-2">
                                <span>⛔</span> Generadores QR estándar
                            </h3>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">×</span>
                                    <p className="text-[1.125rem]">Si cambias precios, tienes que generar un QR nuevo y <strong>volver a imprimir todas las pegatinas</strong>.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">×</span>
                                    <p className="text-[1.125rem]">Es solo un PDF: letra pequeña y sin filtros para el cliente.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">×</span>
                                    <p className="text-[1.125rem]">Suelen poner publicidad en tu carta.</p>
                                </li>
                            </ul>
                        </div>

                        {/* Lo que ofrece Alergenu */}
                        <div className="p-8 rounded-3xl border-2 border-blue-100 bg-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">RECOMENDADO</div>
                            <h3 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                                <span>✅</span> QR inteligente Alergenu
                            </h3>
                            <ul className="space-y-4 text-slate-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <p className="text-[1.125rem]"><strong>QR dinámico:</strong> cambia precios o platos en el móvil y se actualiza al instante sin reimprimir.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <p className="text-[1.125rem]"><strong>Filtro de alérgenos:</strong> el cliente interactúa con la carta, no solo "mira".</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <p className="text-[1.125rem]"><strong>Diseño móvil:</strong> navegación perfecta sin hacer zoom.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* PASO A PASO */}
                <section id="como-funciona" className="container px-4 mx-auto mt-24 max-w-4xl">
                    <h2 className="text-[32px] font-extrabold text-center mb-12">Cómo poner la carta QR en tu restaurante</h2>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                            <h3 className="font-bold text-xl mb-2">Sube tus platos</h3>
                            <p className="text-[1.125rem] text-muted-foreground">Regístrate y escribe tu carta. Nuestra IA detectará los alérgenos por ti.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                            <h3 className="font-bold text-xl mb-2">Descarga el QR</h3>
                            <p className="text-[1.125rem] text-muted-foreground">Obtén el archivo de imagen de tu código QR único desde tu panel.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                            <h3 className="font-bold text-xl mb-2">Imprime y coloca</h3>
                            <p className="text-[1.125rem] text-muted-foreground">Pégalo en las mesas. Si cambias la carta mañana, ¡el QR sigue sirviendo!</p>
                        </div>
                    </div>
                </section>

                {/* PRECIOS */}
                <section className="container px-4 mx-auto mt-20 max-w-4xl">
                    <div className="text-center mb-10">
                        <h2 className="text-[32px] font-extrabold">Planes sencillos, tecnología potente</h2>
                        <p className="text-[1.125rem] text-muted-foreground mt-2">Empieza con 3 meses gratis. Cancela cuando quieras.</p>
                    </div>
                    <PricingSection />
                </section>

                {/* FAQ */}
                <Faq data={faqQR} />

                {/* CTA FINAL */}
                <section className="container px-4 mx-auto mt-24 mb-10">
                    <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-white text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Digitaliza tu restaurante hoy</h2>
                        <p className="text-slate-300 text-[1.125rem] mb-8 max-w-2xl mx-auto leading-relaxed">
                            Genera tu QR, cumple la ley y mejora el servicio. Todo en una sola herramienta fácil de usar.
                        </p>
                        <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 rounded-full h-14 px-10 text-lg font-bold">
                            <Link href="/register">Crear código QR gratis</Link>
                        </Button>
                    </div>
                </section>

            </main>
        </div>
    );
}
