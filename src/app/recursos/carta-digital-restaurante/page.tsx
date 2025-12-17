"use client";

import { PublicHeader } from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import { PricingSection } from '@/components/pricing-section';
import { Faq } from '@/components/layout/Faq';
import Link from 'next/link';
import Image from 'next/image';
import { ImageGallery } from '@/components/layout/ImageGallery';

// FAQ específico para Carta Digital
const faqCartaDigital = [
    {
        question: "¿Necesito instalar una app para ver la carta?",
        answer: "No. Tus clientes solo tienen que abrir la cámara de su móvil, escanear el QR y la carta se abre instantáneamente en su navegador. Sin descargas."
    },
    {
        question: "¿Cómo creo mi código QR?",
        answer: "Al registrarte en Alergenu y crear tu carta, la plataforma genera automáticamente un código QR único para tu restaurante que puedes imprimir y poner en las mesas."
    },
    {
        question: "¿Puedo poner fotos de los platos?",
        answer: "Por supuesto. Una carta digital con fotos aumenta el ticket medio. Puedes subir imágenes de alta calidad para cada plato de forma sencilla."
    },
    {
        question: "¿Es difícil de configurar si no sé informática?",
        answer: "Está diseñado para hosteleros, no para informáticos. Es tan fácil como rellenar un perfil de red social. Además, si eliges el Plan Premium, nosotros subimos la carta por ti."
    }
];

export default function CartaDigitalRestaurantePage() {
    return (
        <div className="min-h-screen bg-background">
            <PublicHeader />

            <main className="pt-6 pb-20">

                {/* 1. HERO SECTION */}
                <section className="text-center w-full max-w-4xl mx-auto container px-4 pt-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
                        La <span className="text-blue-600">carta digital</span> para restaurante que se actualiza sola con IA
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground font-normal mt-6">
                        Olvídate de subir PDFs borrosos. Crea una carta interactiva, filtrable por alérgenos y traducida automáticamente. Cumple el Reglamento 1169/2011 sin esfuerzo.
                    </p>

                    <div className="space-y-4 lg:flex lg:gap-4 lg:space-y-0 mt-10 max-w-2xl mx-auto">
                        <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }}>
                            <Link href="/register">Crear carta gratis ahora</Link>
                        </Button>
                        <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-semibold text-neutral-800 hover:bg-gray-200" style={{ backgroundColor: '#D9D9D9' }}>
                            <Link href="#beneficios">Ver cómo funciona</Link>
                        </Button>
                    </div>
                </section>

                {/* IMAGE GALLERY */}
                <section className="w-full mt-16">
                    <ImageGallery />
                </section>

                {/* 2. COMPARATIVA: PDF vs ALERGENU */}
                <section className="w-full max-w-5xl mx-auto mt-28 container px-4">
                    <div className="text-left mb-12">
                        <h2 className="text-[32px] font-extrabold tracking-tight">El problema de los "Otros"</h2>
                        <p className="text-[18px] text-muted-foreground mt-4">
                            La mayoría de soluciones de menú digital son solo visores de PDF o imágenes. Nosotros vamos mucho más allá.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Columna Izquierda - Lo malo (PDF) */}
                        <div className="rounded-2xl p-8 bg-red-50 border-2 border-red-200">
                            <h3 className="text-2xl font-bold text-red-900 mb-6">Lo habitual (PDF/Imagen)</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">❌</span>
                                    <p className="text-gray-700">El cliente tiene que hacer zoom para leer.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">❌</span>
                                    <p className="text-gray-700">Si cambias un precio, tienes que volver a subir el archivo.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">❌</span>
                                    <p className="text-gray-700">No se puede filtrar: el camarero pierde tiempo respondiendo dudas.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">❌</span>
                                    <p className="text-gray-700">No traduce automáticamente.</p>
                                </li>
                            </ul>
                        </div>

                        {/* Columna Derecha - Lo bueno (Alergenu) */}
                        <div className="rounded-2xl p-8 bg-blue-50 border-2 border-blue-600">
                            <h3 className="text-2xl font-bold text-blue-900 mb-6">Tu Solución (Alergenu)</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">✅</span>
                                    <p className="text-gray-700"><strong>Formato Web:</strong> Se lee perfecto en cualquier móvil.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">✅</span>
                                    <p className="text-gray-700"><strong>Cambios en tiempo real:</strong> Edita un precio y se actualiza al instante.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">✅</span>
                                    <p className="text-gray-700"><strong>Filtros IA:</strong> El cliente marca sus alergias y los platos peligrosos desaparecen.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">✅</span>
                                    <p className="text-gray-700"><strong>Multiidioma:</strong> Detección automática del idioma del móvil.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 3. FUNCIONALIDADES CLAVE */}
                <section id="beneficios" className="w-full max-w-4xl mx-auto mt-28 container px-4">
                    <div className="text-left mb-12">
                        <h2 className="text-[32px] font-extrabold">Funcionalidades clave</h2>
                        <p className="text-[18px] text-muted-foreground mt-4">
                            Tus "Superpoderes" con IA y Legalidad incluidos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Bloque 1: IA */}
                        <div className="rounded-2xl p-6 border bg-white shadow-sm">
                            <div className="relative w-12 h-12 mb-4">
                                <Image src="/icons/web_icons/tres_estrellas.svg" alt="IA" layout="fill" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Inteligencia artificial en tu cocina</h3>
                            <p className="text-[1.125rem] text-blue-600 mb-2 font-semibold">Detección de alérgenos automática.</p>
                            <p className="text-[1.125rem] text-gray-600 leading-relaxed">
                                No pierdas horas marcando casillas. Escribe "Gambas al ajillo" y nuestra IA detectará los crustáceos por ti. Ahorra tiempo administrativo.
                            </p>
                        </div>

                        {/* Bloque 2: Seguridad Legal */}
                        <div className="rounded-2xl p-6 border bg-white shadow-sm">
                            <div className="relative w-12 h-12 mb-4">
                                <Image src="/icons/web_icons/escudo_normativa.svg" alt="Legal" layout="fill" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Seguridad legal</h3>
                            <p className="text-[1.125rem] text-blue-600 mb-2 font-semibold">Blindaje ante inspecciones.</p>
                            <p className="text-[1.125rem] text-gray-600 leading-relaxed">
                                A diferencia de un simple QR, Alergenu guarda un registro histórico de cambios. Si hay una inspección o incidencia, tienes pruebas de que la información estaba correcta.
                            </p>
                        </div>

                        {/* Bloque 3: Ventas Internacionales */}
                        <div className="rounded-2xl p-6 border bg-white shadow-sm">
                            <div className="relative w-12 h-12 mb-4">
                                <Image src="/icons/web_icons/varios_idiomas.svg" alt="Idiomas" layout="fill" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Ventas internacionales</h3>
                            <p className="text-[1.125rem] text-blue-600 mb-2 font-semibold">Carta digital en inglés automático.</p>
                            <p className="text-[1.125rem] text-gray-600 leading-relaxed">
                                No necesitas saber idiomas. La carta se muestra en el idioma del teléfono de tu cliente. Ideal para zonas turísticas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 4. CONTENIDO EDITORIAL SEO */}
                <section className="w-full max-w-4xl mx-auto mt-28 container px-4">
                    <div className="rounded-2xl p-10 bg-gray-50">
                        <h2 className="text-3xl font-extrabold mb-6">¿Por qué tu restaurante necesita una Carta Digital Interactiva en 2025?</h2>

                        <p className="text-lg text-gray-700 leading-relaxed mb-8">
                            La digitalización de la hostelería ha cambiado. Ya no basta con ofrecer un código QR que descargue un archivo pesado. Los comensales exigen rapidez y claridad. Una carta digital interactiva mejora la experiencia de usuario, permitiendo navegar por categorías (entrantes, carnes, postres) sin frustración.
                        </p>

                        <h3 className="text-2xl font-bold mb-4">Evita errores humanos con la gestión digital</h3>
                        <p className="text-lg text-gray-700 leading-relaxed mb-8">
                            El mayor riesgo en un restaurante es la desinformación. Cuando un camarero duda sobre si un plato lleva gluten o frutos secos, pones en riesgo la salud del cliente y la reputación de tu negocio. Al utilizar un software especializado como Alergenu, centralizas la información y evitas el "teléfono roto" entre cocina y sala.
                        </p>

                        <h3 className="text-2xl font-bold mb-4">Actualización de precios inmediata</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            ¿Ha subido el precio del aceite o la carne? Con las cartas físicas o los PDFs estáticos, cambiar un precio es un dolor de cabeza. Con nuestra plataforma, cambias el precio en el móvil y se actualiza en todos los códigos QR de las mesas al segundo.
                        </p>
                    </div>
                </section>

                {/* 5. PRECIOS */}
                <section id="precios" className="w-full max-w-2xl lg:max-w-4xl mx-auto mt-28 container px-4">
                    <div className="text-left mb-12">
                        <h2 className="text-[32px] font-extrabold tracking-tight">La carta digital más completa al mejor precio</h2>
                        <p className="text-[18px] text-muted-foreground mt-4">
                            Elige el plan que mejor se adapte a tu negocio. Empieza gratis y cambia de plan en cualquier momento.
                        </p>
                    </div>

                    <PricingSection />
                </section>

                {/* 6. FAQ */}
                <Faq data={faqCartaDigital} />

                {/* 7. CTA FINAL */}
                <section className="w-full max-w-4xl mx-auto mt-28 container px-4">
                    <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: '#0F1C2E' }}>
                        <h2 className="text-3xl font-extrabold text-white mb-6">¿Listo para modernizar tu sala?</h2>
                        <Button asChild size="lg" className="rounded-full h-14 text-lg font-bold px-10" style={{ backgroundColor: '#2563EB' }}>
                            <Link href="/register">Empezar prueba de 3 meses gratis</Link>
                        </Button>
                    </div>
                </section>

            </main>
        </div>
    );
}
