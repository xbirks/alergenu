'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Share2, BookOpen, CheckCircle2, Sparkles, QrCode, Zap } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function AlergenosPasteleriasArticle() {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Alérgenos en pastelerías y panaderías: ¿es obligatorio tener carta?',
                    text: 'Todo sobre la obligación de informar de alérgenos en pastelerías y panaderías',
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
                                Normativa Específica
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#0F1C2E]">
                            Alérgenos en pastelerías y panaderías: ¿es obligatorio tener carta?
                        </h1>

                        {/* Meta Info */}
                        <div className="flex items-center gap-6 text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>11 de enero, 2025</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>4 min de lectura</span>
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
                            src="/assets/recursos/panaderia_img.jpeg"
                            alt="Alérgenos en Pastelerías y Panaderías"
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
                            Si tienes una pastelería, panadería u obrador, seguramente te has preguntado: "¿Yo también necesito una carta de alérgenos o eso es solo para los restaurantes?". La respuesta corta es <strong>sí</strong>. La respuesta larga es que, además de ser obligatorio, en tu sector es <strong>vital</strong> porque trabajáis con los ingredientes más problemáticos (harinas, frutos secos, huevo...). Hoy te explicamos cómo cumplir la ley en tu vitrina sin llenarlo todo de papeles y etiquetas imposibles de leer.
                        </p>
                    </div>

                    {/* Key Takeaways */}
                    <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-6 mb-20">
                        <h3 className="text-lg font-bold text-[#0F1C2E] mb-4">En resumen</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Por qué la "venta a granel" te obliga a informar igual que a un bar.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>El problema de la harina en suspensión y la contaminación cruzada.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Cómo evitar la "carpeta guarra" detrás del mostrador.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Solución: Un único QR en la vitrina para todos tus productos.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 1 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">1</span>
                            La Ley para alimentos "sin envasar"
                        </h2>

                        <div className="prose prose-lg max-w-none mb-6">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                El Reglamento 1169/2011 es claro: afecta a todo alimento que se entregue al consumidor final sin envasar. Esto incluye:
                            </p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">La barra de pan que entregas en mano.</span>
                            </div>
                            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">El pastel que sacas de la vitrina y pones en una caja.</span>
                            </div>
                            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">Las pastas de té que se venden al peso.</span>
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed">
                                Si un cliente entra y te pregunta "¿qué lleva este croissant?", la ley dice que <strong>no vale con decírselo de memoria</strong>. Tienes que tener un <strong>soporte escrito</strong> (físico o digital) accesible.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">2</span>
                            El caos de las etiquetas en vitrina
                        </h2>

                        <div className="prose prose-lg max-w-none mb-6">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                El problema de las pastelerías es el espacio. Tienes <strong>30 tipos de pasteles en una vitrina pequeña</strong>. Si intentas poner cartelitos con los 14 iconos de alérgenos al lado de cada pastel, la vitrina parece un álbum de cromos y tapa el producto.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Además, los ingredientes cambian. Si hoy al bizcocho le has puesto nueces en vez de almendras, tienes que <strong>cambiar la etiqueta física</strong>. Es un trabajo extra enorme que casi nadie hace bien.
                            </p>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">3</span>
                            Solución Digital: Higiene y Rapidez
                        </h2>

                        <div className="prose prose-lg max-w-none mb-6">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Aquí es donde Alergenu te salva la vida (y el tiempo). En lugar de etiquetas individuales o la clásica <strong>carpeta llena de manchas de grasa y harina</strong> que da mala imagen:
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start gap-3 bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                                <QrCode className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-gray-700 font-semibold mb-1">Colocas un solo Código QR visible en el mostrador o sobre la vitrina.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                                <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-gray-700 font-semibold mb-1">El cliente escanea y ve toda tu oferta de dulces y panes.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-gray-700 font-semibold mb-1">Filtra por "Sin Gluten" o "Sin Frutos Secos" y ve qué puede comprar con seguridad.</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-4 text-[#0F1C2E]">Ventajas para tu obrador:</h3>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-500">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">✨ Limpieza</h4>
                                <p className="text-gray-700 text-sm">
                                    No hay papeles rodando por el mostrador.
                                </p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-500">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">⚡ Actualización</h4>
                                <p className="text-gray-700 text-sm">
                                    ¿Has sacado un dulce nuevo hoy? Lo añades en el móvil en 1 minuto. No hay que imprimir nada.
                                </p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-500">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">💰 Venta</h4>
                                <p className="text-gray-700 text-sm">
                                    Al ver las fotos y descripciones en el móvil, el cliente se antoja de más cosas mientras espera la cola.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 - Digital Solution */}
                    <section className="mb-20">
                        <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 md:p-10 overflow-hidden">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold mb-4 text-[#0F1C2E]">Prueba Alergenu en tu Panadería (Gratis)</h2>
                                    <p className="text-lg mb-6 text-gray-700">
                                        Sabemos que en el obrador no tenéis tiempo para informática. Por eso hemos hecho una herramienta simple:
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">Ideal para vitrinas:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Ahorra espacio y mejora la imagen.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">Gestión de trazas:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Fundamental en panadería por el gluten volátil.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">3 Meses Gratis:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Pruébalo sin coste y moderniza tu negocio.</span>
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
                                        alt="Alergenu - Panadería Digital"
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
                                Tu producto es artesano y de calidad; la forma de presentar la información a tus clientes también debería serlo. Olvídate de las <strong>carpetas viejas y las etiquetas a boli</strong>. Pásate al formato digital con Alergenu y cumple la normativa con la misma calidad con la que haces tus postres.
                            </p>
                        </div>
                    </section>

                    {/* Related Articles */}
                    <section className="border-t border-gray-200 pt-12">
                        <h3 className="text-2xl font-bold mb-6 text-[#0F1C2E]">Artículos relacionados</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Link href="/recursos/normativa-europea-alergenos" className="group">
                                <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                                    <span className="text-blue-600 text-sm font-medium">Legislación</span>
                                    <h4 className="text-lg font-bold mt-2 group-hover:text-blue-600 transition-colors">
                                        Normativa de Alérgenos: Guía del Reglamento 1169/2011
                                    </h4>
                                </div>
                            </Link>
                            <Link href="/recursos/carta-qr-gratis" className="group">
                                <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                                    <span className="text-blue-600 text-sm font-medium">Digitalización</span>
                                    <h4 className="text-lg font-bold mt-2 group-hover:text-blue-600 transition-colors">
                                        Carta QR Gratis: Pasa del PDF a una App Rápida
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
