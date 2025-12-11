'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, Share2, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function CartaAlergenosArticle() {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Cómo Hacer una Carta de Alérgenos para tu Restaurante',
                    text: 'Guía completa paso a paso para crear una carta de alérgenos profesional',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copiar URL al portapapeles
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
                                Guías
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#0F1C2E]">
                            Cómo hacer una carta de alérgenos para tu restaurante: guía fácil y sin errores
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>12 de enero, 2025</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>8 min de lectura</span>
                            </div>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                <span>Compartir</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="max-w-5xl mx-auto px-4 py-8 mb-16">
                    <div className="relative h-96 rounded-2xl shadow-xl overflow-hidden">
                        <Image
                            src="/assets/recursos/Piezas_social_media.jpg"
                            alt="Cómo hacer una carta de alérgenos para tu restaurante"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Article Content */}
                <div className="max-w-3xl mx-auto px-4 pb-20">
                    {/* Introduction */}
                    <div className="prose prose-lg max-w-none mb-20">
                        <p className="text-xl text-gray-700 leading-relaxed font-light">
                            Seamos sinceros: preparar la carta de alérgenos suele ser esa tarea que siempre dejamos para "mañana". Da pereza, parece complicado y nos da miedo equivocarnos. Pero saber cómo hacer una <strong>carta de alérgenos digital</strong> y tenerla al día no es solo para evitar multas; es para que <strong>tú y tus camareros trabajéis tranquilos</strong>, y para que tus clientes confíen en ti. En esta guía vamos a ver cómo hacerlo bien, sin complicarnos la vida y explicándolo en cristiano.
                        </p>
                    </div>

                    {/* Key Takeaways Box */}
                    <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-6 mb-20">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#0F1C2E]">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            Lo que aprenderás en esta guía:
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Qué es exactamente esta carta y por qué es obligatoria (sin rollos legales).</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Cuáles son los 14 alimentos con los que tienes que tener cuidado.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Cómo montarla paso a paso usando herramientas digitales que te ahorran tiempo.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Trucos para evitar errores en cocina que te pueden dar un susto.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 1 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">1</span>
                            ¿Qué es la carta de alérgenos y por qué la necesitas?
                        </h2>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Básicamente, es un documento que dice la verdad sobre lo que lleva tu comida. Su función es <strong>avisar a los clientes</strong> si un plato lleva ingredientes que pueden sentarles mal. Desde el año 2011, la ley obliga a <strong>todos los bares, restaurantes y caterings</strong> a informar sobre esto.
                            </p>

                            <p className="text-gray-700 leading-relaxed">
                                La norma es clara: la información debe estar <strong>disponible antes de que el cliente pida</strong>. No vale decir "ya se lo pregunto al cocinero" cuando el plato ya está en la mesa. Tienes que tenerlo accesible, y la forma más segura de hacerlo hoy en día es mediante una <strong>carta digital actualizada</strong> que evite fallos humanos.
                            </p>
                        </div>
                    </section>

                    {/* Warning Box */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6 mb-20">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-[#0F1C2E] mb-2">⚠️ Ojo con esto</h4>
                                <p className="text-gray-700">
                                    No tener esta información, tenerla desactualizada o esconderla puede salirte muy caro. Las multas por no cumplir la normativa 1169/2011 en España van desde los 3.000€ hasta los <strong>600.000€</strong>. Mejor no jugársela.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">2</span>
                            Los 14 "Culpables": Qué debes vigilar
                        </h2>

                        <div className="prose prose-lg max-w-none mb-6">
                            <p className="text-gray-700 leading-relaxed">
                                Hay muchas alergias, pero la ley europea ha seleccionado <strong>14 ingredientes</strong> que son los que causan la mayoría de los problemas. Estos son los que <strong>obligatoriamente tienes que avisar</strong> si los usas en tus platos:
                            </p>
                        </div>


                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { image: '/assets/recursos/gluten.png', name: 'Gluten', desc: 'Trigo, centeno, cebada, avena' },
                                { image: '/assets/recursos/crustaceos.png', name: 'Crustáceos', desc: 'Gambas, cangrejos, langostas' },
                                { image: '/assets/recursos/huevo.png', name: 'Huevos', desc: 'Y productos derivados' },
                                { image: '/assets/recursos/pescado.png', name: 'Pescado', desc: 'Todas las especies' },
                                { image: '/assets/recursos/cacahuete.png', name: 'Cacahuetes', desc: 'Y productos derivados' },
                                { image: '/assets/recursos/frutos_Cascara.png', name: 'Frutos de cáscara', desc: 'Nueces, almendras, avellanas' },
                                { image: '/assets/recursos/lacteos.png', name: 'Lácteos', desc: 'Leche y derivados (lactosa)' },
                                { image: '/assets/recursos/apio.png', name: 'Apio', desc: 'Raíz, hojas y semillas' },
                                { image: '/assets/recursos/mostaza.png', name: 'Mostaza', desc: 'Semillas y derivados' },
                                { image: '/assets/recursos/sesamo.png', name: 'Granos de sésamo', desc: 'Y productos derivados' },
                                { image: '/assets/recursos/sulfitos.png', name: 'Dióxido de azufre', desc: 'Sulfitos (>10 mg/kg)' },
                                { image: '/assets/recursos/altramuces.png', name: 'Altramuces', desc: 'Y productos derivados' },
                                { image: '/assets/recursos/moluscos.png', name: 'Moluscos', desc: 'Mejillones, almejas, ostras' },
                                { image: '/assets/recursos/soja.png', name: 'Soja', desc: 'Y productos derivados' },
                            ].map((allergen, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-600 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-12 flex-shrink-0">
                                            <Image
                                                src={allergen.image}
                                                alt={allergen.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#0F1C2E]">{allergen.name}</h4>
                                            <p className="text-sm text-gray-600">{allergen.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* Section 3 */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">3</span>
                            Cómo hacer tu carta paso a paso
                        </h2>


                        <div className="space-y-12">
                            {/* Step 1 */}
                            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-gray-50/50 rounded-r-lg">
                                <h3 className="text-xl font-bold mb-3 text-[#0F1C2E]">Paso 1: Revisa tu despensa y lee las etiquetas</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    No des nada por hecho. Coge los botes de salsas, las especias y lee la etiqueta. A veces, un sazonador lleva gluten o una salsa lleva mostaza aunque no lo parezca. Digitalizar este paso te ayuda a tener una base de datos fiable de lo que entra en tu cocina.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-gray-50/50 rounded-r-lg">
                                <h3 className="text-xl font-bold mb-3 text-[#0F1C2E]">Paso 2: Despieza tus recetas (Escandallo)</h3>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    Coge cada plato y apunta todo lo que lleva. Por ejemplo, en una Hamburguesa:
                                </p>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                                        <span>Pan (¿Sésamo? ¿Gluten?)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                                        <span>Carne (¿Sulfitos?)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                                        <span>Salsa (¿Huevo?)</span>
                                    </li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mt-3">
                                    Aquí es donde un software de gestión de alérgenos marca la diferencia: si vinculas los ingredientes al plato una vez, no tendrás que revisarlo manualmente cada día.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-gray-50/50 rounded-r-lg">
                                <h3 className="text-xl font-bold mb-3 text-[#0F1C2E]">Paso 3: Cuidado con la freidora (Contaminación Cruzada)</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Aquí es donde fallan muchos. Si fríes croquetas (con leche) y luego patatas en el mismo aceite, esas patatas ya no son aptas para alérgicos. Si no tienes freidoras separadas, debes marcar "Puede contener trazas". La seguridad es lo primero.
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-gray-50/50 rounded-r-lg">
                                <h3 className="text-xl font-bold mb-3 text-[#0F1C2E]">Paso 4: Ponlo bonito y claro (Mejor con QR)</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Pásalo a la carta. Puedes usar iconos o texto, pero lo más práctico es generar un código QR dinámico. Así, el cliente puede filtrar la carta desde su móvil según sus alergias (por ejemplo, "muéstrame solo lo que NO lleve gluten") y tú te ahorras imprimir papel cada vez que cambias un plato.
                                </p>
                            </div>

                            {/* Step 5 */}
                            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-gray-50/50 rounded-r-lg">
                                <h3 className="text-xl font-bold mb-3 text-[#0F1C2E]">Paso 5: Díselo a tu equipo</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    De nada sirve tener un sistema perfecto si el camarero no sabe usarlo. Explícales que, ante la duda, consulten siempre la carta digital o pregunten en cocina. Nunca hay que inventarse la respuesta.
                                </p>
                            </div>

                            {/* Step 6 */}
                            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-gray-50/50 rounded-r-lg">
                                <h3 className="text-xl font-bold mb-3 text-[#0F1C2E]">Paso 6: Si cambias la receta, cambia la carta</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Si cambias de marca de pan o añades una salsa nueva, ¡actualízalo al momento! Una carta en papel se queda obsoleta rápido; una digital se actualiza en segundos desde tu móvil y evita riesgos innecesarios.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 - Digital Solution */}
                    <section className="mb-20">
                        <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 md:p-10 overflow-hidden">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold mb-4 text-[#0F1C2E]">Olvídate del Excel: Automatiza con Alergenu</h2>
                                    <p className="text-lg mb-6 text-gray-700">
                                        Hacer todo esto a mano es un dolor de cabeza y el riesgo de error humano es alto. Con Alergenu lo hacemos fácil y seguro:
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">Base de datos inteligente:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Marcas ingredientes y detectamos los alérgenos por ti.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">Actualización en tiempo real:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Si cambias un ingrediente, se actualiza en todos los platos automáticamente.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">QR y Filtros:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Tus clientes agradecerán poder filtrar la carta digitalmente y comer tranquilos.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1 text-blue-600" />
                                            <div>
                                                <span className="font-bold text-[#0F1C2E]">Cumplimiento legal:</span>
                                                <span className="block text-sm font-normal mt-0.5 text-gray-600">Duerme tranquilo sabiendo que tu carta cumple la normativa al 100%.</span>
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
                                        alt="Alergenu - Automatización de Alérgenos"
                                        fill
                                        className="object-cover rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#0F1C2E]">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg flex-shrink-0">4</span>
                            Consejos de experto (para no meter la pata)
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">✅ Ante la duda, sé transparente</h4>
                                <p className="text-gray-700">
                                    Si no estás 100% seguro de si un plato tiene trazas, indícalo. Es mejor ser honesto que arriesgar la salud de un cliente. Nuestras herramientas te permiten marcar estas trazas fácilmente.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">✅ Accesibilidad total</h4>
                                <p className="text-gray-700">
                                    No guardes la carta de alérgenos bajo llave. Lo ideal es tener un QR en la mesa. El cliente no debería tener que "pedir permiso" para saber qué puede comer con seguridad.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">✅ Orden y limpieza en cocina</h4>
                                <p className="text-gray-700">
                                    Intenta tener utensilios separados. Si cortas el queso y con el mismo cuchillo la fruta, estás pasando alérgenos. Un poco de orden salva vidas.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
                                <h4 className="font-bold text-[#0F1C2E] mb-2">✅ Documentación al día</h4>
                                <p className="text-gray-700">
                                    Guarda las fichas técnicas. Si tienes una inspección, tener todo digitalizado y ordenado demuestra que eres un profesional que tiene el control de su negocio.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Conclusion */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 text-[#0F1C2E]">Conclusión</h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Tener una carta de alérgenos bien hecha no es solo "papeleo". Es demostrar que te importan tus clientes y que tu restaurante es un sitio serio y seguro. Al principio puede parecer mucho trabajo, pero si te apoyas en la tecnología y usas herramientas especializadas como Alergenu, verás que se gestiona casi solo. ¡Mucho ánimo y a cocinar seguro!
                            </p>
                        </div>
                    </section>

                    {/* Share Section */}
                    <div className="border-t border-b border-gray-200 py-8 flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h3 className="font-bold text-lg mb-1 text-[#0F1C2E]">¿Te ha sido útil esta guía?</h3>
                            <p className="text-gray-600">Compártela con otros profesionales de la hostelería</p>
                        </div>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
                        >
                            <Share2 className="w-5 h-5" />
                            <span>Compartir artículo</span>
                        </button>
                    </div>

                    {/* Related Articles */}
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold mb-6 text-[#0F1C2E]">Artículos Relacionados</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Link href="/recursos/normativa-europea-alergenos" className="group">
                                <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-600 transition-colors">
                                    <span className="text-blue-600 text-sm font-medium">Normativa</span>
                                    <h4 className="font-bold text-lg mt-2 mb-2 group-hover:text-blue-600 transition-colors text-[#0F1C2E]">
                                        Normativa Europea sobre Alérgenos
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        Todo lo que necesitas saber sobre el Reglamento 1169/2011
                                    </p>
                                </div>
                            </Link>
                            <Link href="/recursos/14-alergenos-principales" className="group">
                                <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-600 transition-colors">
                                    <span className="text-blue-600 text-sm font-medium">Guías</span>
                                    <h4 className="font-bold text-lg mt-2 mb-2 group-hover:text-blue-600 transition-colors text-[#0F1C2E]">
                                        Los 14 Alérgenos Principales
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        Descubre los alérgenos de declaración obligatoria en Europa
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
}
