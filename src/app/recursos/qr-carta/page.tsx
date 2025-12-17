"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Infinity, Printer, BarChart3 } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import { Faq } from '@/components/layout/Faq';
import { PricingSection } from '@/components/pricing-section';
import { ImageGallery } from '@/components/layout/ImageGallery';

// FAQ corto y directo (Intención de usuario rápida)
const faqQrCarta = [
    {
        question: '¿Este QR carta tiene límite de escaneos?',
        answer: 'No. A diferencia de otros generadores "gratuitos" que dejan de funcionar tras 100 visitas, el QR de Alergenu es ilimitado. Tu carta estará siempre disponible.'
    },
    {
        question: '¿En qué formato se descarga el QR?',
        answer: 'Podrás descargar tu QR en alta calidad (listo para imprenta) para que se vea nítido en pegatinas, metacrilatos o carteles grandes.'
    },
    {
        question: '¿Puedo saber cuánta gente escanea mi carta?',
        answer: 'Sí. Alergenu incluye un panel de métricas básico donde podrás ver el interés que genera tu carta digital.'
    },
    {
        question: '¿Qué pasa si cambio el menú del día?',
        answer: 'Nada. El código QR impreso sigue siendo el mismo. Tú actualizas el plato en la web y el cliente ve los cambios al instante. No gastes más en imprenta.'
    }
];

export default function QrCartaPage() {
    return (
        <div className="min-h-screen bg-background">
            <PublicHeader />

            <main className="pt-10 pb-20">

                {/* 1. HERO: Muy directo. "Tu QR carta sin tonterías" */}
                <section className="container px-4 mx-auto max-w-5xl text-center pt-12 md:pt-20">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-green-50 border border-green-100 text-green-700 font-bold text-sm tracking-wide">
                        ✅ Garantía de funcionamiento 24/7
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 leading-tight">
                        Tu <span className="text-blue-600">QR carta</span> que nunca caduca ni se rompe
                    </h1>
                    <p className="text-[1.125rem] text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                        Genera un código QR profesional para tu restaurante. <strong>Sin límites de escaneo</strong>, con estadísticas de visitas y listo para imprimir en alta calidad.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <Button asChild size="lg" className="rounded-full h-14 px-10 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl">
                            <Link href="/register">Generar QR ahora</Link>
                        </Button>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">No requiere tarjeta de crédito para empezar.</p>
                </section>

                {/* IMAGE GALLERY */}
                <section className="w-full mt-16">
                    <ImageGallery />
                </section>

                {/* 2. VALUE PROPOSITION: Atacando el miedo al "QR Roto" y añadiendo ANALÍTICAS */}
                <section className="container px-4 mx-auto mt-24 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Diferencial 1: Permanencia */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                            <div className="mb-4">
                                <Infinity size={32} color="#0F1C2E" strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Enlaces ilimitados</h3>
                            <p className="text-[1.125rem] text-muted-foreground leading-relaxed">
                                Muchos generadores gratuitos rompen tu enlace a los 14 días. <strong>Alergenu no.</strong> Tu QR carta funcionará siempre, protegiendo tu inversión en imprenta.
                            </p>
                        </div>

                        {/* Diferencial 2: Calidad de Impresión */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                            <div className="mb-4">
                                <Printer size={32} color="#0F1C2E" strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Calidad de imprenta</h3>
                            <p className="text-[1.125rem] text-muted-foreground leading-relaxed">
                                Descarga tu QR en alta resolución. Perfecto para pegatinas pequeñas o carteles gigantes en la entrada. Olvida los píxeles borrosos.
                            </p>
                        </div>

                        {/* Diferencial 3: Analíticas (NUEVO VALOR) */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-800"></div>
                            <div className="mb-4">
                                <BarChart3 size={32} color="#0F1C2E" strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Estadísticas de uso</h3>
                            <p className="text-[1.125rem] text-muted-foreground leading-relaxed">
                                ¿Sabes cuánta gente ve tu carta? Con nuestro sistema digital obtendrás métricas de visualización para entender mejor a tus clientes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. ERRORES COMUNES: Tarjetas visuales */}
                <section className="container px-4 mx-auto mt-24 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-[32px] font-extrabold">Los 3 errores que arruinan tu QR carta</h2>
                        <p className="text-[1.125rem] text-muted-foreground mt-4">
                            Evita estos fallos que cometen el 80% de los restaurantes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Error 1 */}
                        <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                            <div className="text-4xl mb-4">❌</div>
                            <h3 className="text-xl font-bold text-red-900 mb-3">Generadores "gratis" anónimos</h3>
                            <p className="text-[1.125rem] text-red-800 leading-relaxed">
                                Imprimes 50 pegatinas y a la semana el QR lleva a error 404. Tu inversión en imprenta, perdida.
                            </p>
                        </div>

                        {/* Error 2 */}
                        <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                            <div className="text-4xl mb-4">❌</div>
                            <h3 className="text-xl font-bold text-red-900 mb-3">Enlazar a un PDF</h3>
                            <p className="text-[1.125rem] text-red-800 leading-relaxed">
                                El cliente tiene que descargar, gastar datos y hacer zoom. Experiencia pésima en móvil.
                            </p>
                        </div>

                        {/* Error 3 */}
                        <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                            <div className="text-4xl mb-4">❌</div>
                            <h3 className="text-xl font-bold text-red-900 mb-3">QR demasiado pequeño</h3>
                            <p className="text-[1.125rem] text-red-800 leading-relaxed">
                                Menos de 5x5 cm no escanea bien. Usa vinilo o PVC lavable para que dure años.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 4. COMPARATIVA: Alergenu vs Competencia */}
                <section className="container px-4 mx-auto mt-24 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-[32px] font-extrabold">Por qué Alergenu es diferente</h2>
                        <p className="text-[1.125rem] text-muted-foreground mt-4">
                            Comparativa honesta con otros generadores de QR
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Otros generadores */}
                        <div className="p-8 rounded-3xl border border-gray-200 bg-gray-50">
                            <h3 className="text-2xl font-bold text-gray-500 mb-6 flex items-center gap-2">
                                <span>⛔</span> Otros generadores
                            </h3>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">×</span>
                                    <p className="text-[1.125rem]">Enlaces temporales (caducan en 14-30 días).</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">×</span>
                                    <p className="text-[1.125rem]">Límite de 100-500 escaneos.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">×</span>
                                    <p className="text-[1.125rem]">Sin estadísticas de uso.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">×</span>
                                    <p className="text-[1.125rem]">Baja resolución (pixelado al imprimir).</p>
                                </li>
                            </ul>
                        </div>

                        {/* Alergenu */}
                        <div className="p-8 rounded-3xl border-2 border-blue-100 bg-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">RECOMENDADO</div>
                            <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                                <span>✅</span> Alergenu
                            </h3>
                            <ul className="space-y-4 text-slate-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <p className="text-[1.125rem]"><strong>Enlace permanente:</strong> tu QR funciona para siempre.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <p className="text-[1.125rem]"><strong>Escaneos ilimitados:</strong> sin restricciones de uso.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <p className="text-[1.125rem]"><strong>Panel de métricas:</strong> ve cuánta gente escanea tu carta.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <p className="text-[1.125rem]"><strong>Alta resolución:</strong> perfecto para imprenta profesional.</p>
                                </li>
                            </ul>
                            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                                <p className="text-[1.125rem] text-blue-800">
                                    <strong>⚠️ Bonus:</strong> actualiza tu carta sin reimprimir el QR. Código dinámico que se adapta a tus cambios.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. PRECIOS */}
                <section className="container px-4 mx-auto mt-20 max-w-4xl">
                    <PricingSection />
                </section>

                {/* 6. FAQ */}
                <section className="container px-4 mx-auto mt-20 max-w-3xl">
                    <h2 className="text-[32px] font-extrabold text-center mb-10">Preguntas rápidas sobre QR carta</h2>
                    <Faq data={faqQrCarta} />
                </section>

                {/* 7. CTA FINAL */}
                <section className="container px-4 mx-auto mt-24 mb-10">
                    <div className="bg-blue-600 rounded-3xl p-10 md:p-16 text-white shadow-2xl shadow-blue-900/20 text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Genera tu QR carta ahora</h2>
                        <p className="text-blue-100 text-[1.125rem] mb-8 max-w-2xl mx-auto leading-relaxed">
                            3 meses gratis. Estadísticas incluidas. Sin compromiso.
                        </p>
                        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 rounded-full h-14 px-10 text-lg font-bold">
                            <Link href="/register">Empezar gratis</Link>
                        </Button>
                    </div>
                </section>

            </main>
        </div>
    );
}
