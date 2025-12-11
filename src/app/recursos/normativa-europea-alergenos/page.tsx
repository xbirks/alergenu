'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Share2, BookOpen, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function NormativaEuropeaArticle() {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Normativa de alérgenos en hostelería: guía clara del Reglamento 1169/2011',
                    text: 'Todo lo que necesitas saber sobre el Reglamento 1169/2011',
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
                                Legislación y Normativa
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#0F1C2E]">
                            Normativa de alérgenos en hostelería: guía clara del Reglamento 1169/2011
                        </h1>

                        {/* Meta Info */}
                        <div className="flex items-center gap-6 text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>9 de enero, 2025</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>7 min de lectura</span>
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
                            src="/assets/recursos/legal_rest.jpeg"
                            alt="Normativa de Alérgenos en Hostelería"
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
                            Cuando oímos hablar de "Reglamentos Europeos" o el famoso 1169/2011, a la mayoría de los hosteleros nos entra un sudor frío. Suena a burocracia, a papeles y a dolores de cabeza. Pero, ¿y si te digo que entender esta ley es <strong>más fácil de lo que parece</strong> y que cumplirla es el <strong>mejor seguro de vida para tu negocio</strong>? En este artículo vamos a traducir la normativa sobre alérgenos al castellano, sin tecnicismos y yendo al grano: qué tienes que hacer para evitar multas y dormir tranquilo.
                        </p>
                    </div>

                    {/* Key Takeaways */}
                    <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-6 mb-20">
                        <h3 className="text-lg font-bold text-[#0F1C2E] mb-4">Lo que aprenderás</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Qué dice realmente la ley (y qué bulos circulan por ahí).</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Por qué el "ya se lo digo yo de voz" no es suficiente.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>A cuánto ascienden las sanciones en España si te pillan incumpliendo.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Cómo cumplir la norma al 100% sin perder tiempo, usando la tecnología.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 1 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">1</span>
                            ¿De qué va el Reglamento 1169/2011?
                        </h2>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed mb-6">
                                El Reglamento (UE) nº 1169/2011 es la "biblia" de la información alimentaria en Europa. Antes de esta ley, informar sobre alérgenos en restaurantes era un gesto de buena voluntad; ahora es una <strong>obligación legal</strong>.
                            </p>

                            <p className="text-gray-700 leading-relaxed">
                                Lo más importante que debes saber es que esta norma se aplica a <strong>todo alimento que se venda sin envasar</strong>. Es decir, afecta de lleno a restaurantes, bares, cafeterías, pastelerías, food trucks y caterings. La ley busca una cosa muy sencilla: que cualquier persona con alergia o intolerancia sepa exactamente qué puede comer antes de llevarse el tenedor a la boca, sin tener que jugar a las adivinanzas.
                            </p>
                        </div>
                    </section>

                    {/* Warning Box */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6 mb-20">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-[#0F1C2E] mb-2">⚠️ El mito del "solo si preguntan"</h4>
                                <p className="text-gray-700">
                                    Muchos creen que solo hay que informar si el cliente avisa de su alergia. ¡Error! La información debe estar disponible y accesible siempre, independientemente de que el cliente pregunte o no.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">2</span>
                            La trampa de la "Información Verbal"
                        </h2>

                        <div className="prose prose-lg max-w-none mb-6">
                            <p className="text-gray-700 leading-relaxed">
                                Aquí es donde muchos negocios meten la pata y se exponen a problemas serios. La ley permite dar la información de forma oral (que el camarero lo explique), <strong>PERO</strong> pone una condición indispensable que casi nadie cumple:
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-[#0F1C2E] mb-1">Debe haber un respaldo escrito</h4>
                                    <p className="text-gray-700 text-sm">
                                        No vale con que el jefe de cocina "lo sepa". Debe existir un registro físico o digital (una ficha técnica, un libro de alérgenos o una app) que el cliente o un inspector puedan consultar si lo piden.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-[#0F1C2E] mb-1">Debe ser accesible antes de pedir</h4>
                                    <p className="text-gray-700 text-sm">
                                        No puedes traer la información cuando el cliente ya ha comido.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-[#0F1C2E] mb-1">Debe ser verificable</h4>
                                    <p className="text-gray-700 text-sm">
                                        Si un inspector entra por la puerta y te pide la documentación de los ingredientes de la salsa brava, tienes que tenerla.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed">
                                Si confías solo en la memoria de tu equipo, estás <strong>jugando a la ruleta rusa</strong>. Un camarero nuevo, un cambio de turno o un olvido pueden acabar en una reacción alérgica grave. Por eso, contar con un <strong>software de gestión de alérgenos</strong> que documente todo por ti es la vía más segura.
                            </p>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">3</span>
                            Las multas: Cuando lo barato sale caro
                        </h2>

                        <div className="prose prose-lg max-w-none mb-6">
                            <p className="text-gray-700 leading-relaxed mb-6">
                                Hablemos de dinero, que es lo que duele. En España, las competencias de sanidad y consumo están transferidas a las Comunidades Autónomas, pero el baremo de sanciones por incumplir la ley de seguridad alimentaria es <strong>bastante duro en todas partes</strong>.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Dependiendo de la gravedad (no es lo mismo no tener la carta a día, que provocar una anafilaxia a un cliente por negligencia), las multas se clasifican en:
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">Leves (hasta 3.000€)</h4>
                                <p className="text-gray-700">
                                    Por ejemplo, tener la información incompleta o con errores menores.
                                </p>
                            </div>

                            <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">Graves (entre 3.001€ y 60.000€)</h4>
                                <p className="text-gray-700">
                                    Falta total de información, negativa a facilitarla o reincidencia.
                                </p>
                            </div>

                            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">Muy Graves (hasta 600.000€)</h4>
                                <p className="text-gray-700">
                                    Situaciones que pongan en riesgo directo la salud pública o fraudes intencionados.
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed">
                                Más allá de la multa, piensa en la reputación. Una reseña en Google diciendo <strong>"Me intoxiqué en este sitio porque no sabían qué llevaba el plato"</strong> hace más daño a tu caja que cualquier inspección.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 - Digital Solution */}
                    <section className="mb-20">
                        <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 md:p-10 overflow-hidden">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold mb-4 text-[#0F1C2E]">Cumple la ley sin papeleos con Alergenu</h2>
                                    <p className="text-lg mb-6 text-gray-700">
                                        El Reglamento 1169/2011 exige rigor, pero no dice que tengas que hacerlo con lápiz y papel. Alergenu es tu escudo legal:
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">Trazabilidad total:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Registramos cada alérgeno asociado a tus platos.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">Respaldo digital:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Si viene una inspección, tienes toda la información organizada y accesible en un clic.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">Cero errores humanos:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Al digitalizar el proceso, evitas que un olvido verbal se convierta en una sanción.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">Tranquilidad:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Dedícate a cocinar y servir, nosotros nos ocupamos de la normativa.</span>
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
                                <div className="relative h-64 md:h-96">
                                    <Image
                                        src="/assets/recursos/Piezas_social_media.jpg"
                                        alt="Alergenu - Cumplimiento Normativa"
                                        fill
                                        className="object-cover rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">4</span>
                            ¿Qué tengo que hacer para cumplir mañana mismo?
                        </h2>

                        <div className="space-y-12">
                            {/* Step 1 */}
                            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-gray-50/50 rounded-r-lg">
                                <h3 className="text-xl font-bold mb-3 text-[#0F1C2E]">1. Audita tus platos</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Revisa tus recetas. Tienes que saber qué lleva cada cosa. Y no olvides los "ocultos": el chorrito de salsa inglesa (pescado), el pan rallado (gluten) o el colorante (a veces lleva trazas).
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-gray-50/50 rounded-r-lg">
                                <h3 className="text-xl font-bold mb-3 text-[#0F1C2E]">2. Documenta, no memorices</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Crea fichas de cada plato. No confíes en la memoria. Si usas herramientas digitales, esto se hace casi solo y se queda guardado en la nube para siempre.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-gray-50/50 rounded-r-lg">
                                <h3 className="text-xl font-bold mb-3 text-[#0F1C2E]">3. Hazlo visible</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Pon un cartel que diga: "Si tiene alguna alergia o intolerancia, consulte a nuestro personal o escanee nuestro código QR". La ley exige que el cliente sepa que esa información existe.
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-gray-50/50 rounded-r-lg">
                                <h3 className="text-xl font-bold mb-3 text-[#0F1C2E]">4. Forma a tu personal</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Tu equipo debe saber dónde está la información. La respuesta a un cliente nunca debe ser "creo que no lleva nada", sino "un segundo, que lo verifico en nuestra carta de alérgenos actualizada".
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Conclusion */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-[#0F1C2E]">Conclusión</h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                El Reglamento 1169/2011 no se hizo para molestar a los hosteleros, sino para garantizar que salir a cenar sea seguro para todos. Cumplir con la normativa europea sobre alérgenos es un sello de calidad que diferencia a los profesionales de los aficionados.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                No veas esto como una carga burocrática. Con la ayuda de soluciones como Alergenu, mantener tu información al día es cuestión de minutos, y la tranquilidad que te da saber que tu negocio está blindado ante inspecciones y errores... eso no tiene precio.
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
                        </div>
                    </section>
                </div>
            </article>
        </>
    );
}
