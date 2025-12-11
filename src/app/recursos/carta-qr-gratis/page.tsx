'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Share2, BookOpen, CheckCircle2, Zap, Image as ImageIcon, Filter, Globe } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function CartaQRGratisArticle() {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Carta QR gratis: pasa del PDF a una app profesional (sin pagar)',
                    text: 'Descubre la diferencia entre un PDF y una carta digital interactiva',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('¡Enlace copiado al portapapeles!');
        }
    };

    return (
        <>
            <PublicHeader />

            <article className="min-h-screen bg-white">
                {/* Hero Header */}
                <header className="bg-white border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-4 py-12">
                        {/* Category Badge */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-bold">
                                Digitalización
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#0F1C2E]">
                            Carta QR gratis: pasa del PDF a una app rápida y profesional (sin pagar)
                        </h1>

                        {/* Meta Info */}
                        <div className="flex items-center gap-6 text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>10 de enero, 2025</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>3 min de lectura</span>
                            </div>
                        </div>

                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            Compartir artículo
                        </button>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="max-w-5xl mx-auto px-4 py-8 mb-16">
                    <div className="relative h-96 rounded-2xl shadow-xl overflow-hidden">
                        <Image
                            src="/assets/recursos/qr-gratis.jpg"
                            alt="Carta QR Gratis vs PDF"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 pb-20">
                    {/* Introduction */}
                    <div className="prose prose-lg max-w-none mb-20">
                        <p className="text-xl text-gray-700 leading-relaxed font-light">
                            Si buscas una carta QR gratis, haces bien en mirar los costes. Pero hay una <strong>diferencia gigante</strong> entre subir un simple PDF y ofrecer una <strong>carta digital interactiva</strong>. Hoy te explicamos por qué tus clientes prefieren una app que carga al instante antes que descargar un documento pesado, y cómo puedes tener la mejor tecnología del mercado <strong>gratis durante 3 meses</strong>.
                        </p>
                    </div>

                    {/* Key Takeaways */}
                    <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-6 mb-20">
                        <h3 className="text-lg font-bold text-[#0F1C2E] mb-4">En resumen</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Por qué el PDF es incómodo en el móvil (el odioso "zoom").</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Ventajas de una carta web: carga inmediata y lectura perfecta.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Cómo cambiar precios en segundos desde tu móvil.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Tu oportunidad: 3 meses de servicio Premium a coste cero.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 1 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">1</span>
                            PDF vs. Carta Web: La batalla de la comodidad
                        </h2>

                        <div className="prose prose-lg max-w-none mb-6">
                            <p className="text-gray-700 leading-relaxed mb-6">
                                La opción gratuita habitual es subir un PDF a internet. <strong>Cumple</strong>, pero es <strong>muy incómodo para el cliente</strong>. Piénsalo cuando estás en una terraza:
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-red-500">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">❌ El PDF obliga a hacer zoom</h4>
                                <p className="text-gray-700">
                                    Tienes que andar haciendo "pinza" con los dedos y moviendo la pantalla de lado a lado para leer el precio o los ingredientes.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-red-500">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">❌ Carga lento</h4>
                                <p className="text-gray-700">
                                    Si el cliente tiene poca cobertura, descargar un PDF puede tardar una eternidad.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-red-500">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">❌ Letra pequeña</h4>
                                <p className="text-gray-700">
                                    Dependiendo de la luz y el diseño, a veces es imposible leerlo bien en una pantalla de 6 pulgadas.
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none mt-8">
                            <p className="text-gray-700 leading-relaxed font-semibold">
                                Tu servicio es rápido; tu carta digital también debería serlo.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">2</span>
                            Lo que ganas con una Carta Digital (Alergenu)
                        </h2>

                        <div className="prose prose-lg max-w-none mb-6">
                            <p className="text-gray-700 leading-relaxed">
                                Con Alergenu, tu carta funciona como una <strong>Web App optimizada</strong>. Es texto digital real, no una "foto de un papel".
                            </p>
                        </div>

                        <h3 className="text-xl font-bold mb-6 text-[#0F1C2E]">Ventajas inmediatas:</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0F1C2E] mb-2">Legibilidad perfecta</h4>
                                        <p className="text-gray-700 text-sm">
                                            El texto se adapta al tamaño del móvil del cliente. Se ve grande, claro y limpio sin tocar nada.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Filter className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0F1C2E] mb-2">Filtros de Alérgenos</h4>
                                        <p className="text-gray-700 text-sm">
                                            El cliente filtra lo que no puede comer y la carta se actualiza al instante. Seguridad total.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0F1C2E] mb-2">Velocidad</h4>
                                        <p className="text-gray-700 text-sm">
                                            Al no tener que descargar archivos pesados, la carta abre al momento.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0F1C2E] mb-2">Cambios al vuelo</h4>
                                        <p className="text-gray-700 text-sm">
                                            ¿Sube el precio de la cerveza? Lo cambias en 5 segundos y se actualiza en todos los móviles.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">3</span>
                            Tu tiempo es dinero: Olvídate de reimprimir
                        </h2>

                        <div className="space-y-8">
                            <div className="bg-blue-50 rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-3 text-[#0F1C2E]">Autonomía total</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Con un PDF o carta física, cualquier cambio implica <strong>llamar al diseñador</strong>, volver a maquetar o volver a imprimir. Con nuestra Web App, <strong>tú tienes el control total desde tu móvil</strong>. Es libertad absoluta.
                                </p>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-3 text-[#0F1C2E]">Seguridad Legal</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Cumplir la normativa 1169/2011 no tiene que ser un lío. Marcas los ingredientes y los iconos de alérgenos aparecen solos. Te ahorras dudas, preguntas constantes a cocina y posibles multas.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 - Digital Solution */}
                    <section className="mb-20">
                        <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 md:p-10 overflow-hidden">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold mb-4 text-[#0F1C2E]">Empieza con 3 meses gratis</h2>
                                    <p className="text-lg mb-6 text-gray-700">
                                        Queremos que pruebes la diferencia sin riesgo.
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">Todo incluido:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Acceso total a todas las funciones Premium.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">0€ de coste:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Durante 90 días, tu carta profesional es gratis.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">Sin permanencia:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Si no te convence, no te quedas.</span>
                                            </div>
                                        </li>
                                    </ul>
                                    <Link
                                        href="/register"
                                        className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors text-lg"
                                    >
                                        CREAR CARTA GRATIS YA
                                    </Link>
                                </div>
                                <div className="relative h-64 md:h-full">
                                    <Image
                                        src="/assets/recursos/Piezas_social_media.jpg"
                                        alt="Alergenu - Carta Digital"
                                        fill
                                        className="object-cover rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Conclusion */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">4</span>
                            Conclusión
                        </h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed">
                                No te conformes con "lo básico" solo porque es gratis. Aprovecha nuestra <strong>promoción de lanzamiento</strong> y digitaliza tu restaurante con una herramienta profesional <strong>a coste cero</strong>. Tus clientes agradecerán la rapidez de lectura y tú trabajarás mucho más cómodo. ¡Pruébalo!
                            </p>
                        </div>
                    </section>

                    {/* Related Articles */}
                    <section className="border-t border-gray-200 pt-12">
                        <h3 className="text-2xl font-bold mb-6 text-[#0F1C2E]">Artículos relacionados</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Link href="/recursos/como-hacer-carta-alergenos" className="group">
                                <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                                    <span className="text-blue-600 text-sm font-medium">Guías Prácticas</span>
                                    <h4 className="text-lg font-bold mt-2 group-hover:text-blue-600 transition-colors">
                                        Cómo hacer una Carta de Alérgenos para tu Restaurante
                                    </h4>
                                </div>
                            </Link>
                            <Link href="/recursos/normativa-europea-alergenos" className="group">
                                <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                                    <span className="text-blue-600 text-sm font-medium">Legislación</span>
                                    <h4 className="text-lg font-bold mt-2 group-hover:text-blue-600 transition-colors">
                                        Normativa de Alérgenos: Guía del Reglamento 1169/2011
                                    </h4>
                                </div>
                            </Link>
                        </div>
                    </section>
                </div>
            </article>
        </>
    );
}
