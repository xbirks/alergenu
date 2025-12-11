'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

// Tipo de artículo
type Article = {
    slug: string;
    title: string;
    description: string;
    image: string;
    category: string;
    readTime: string;
    date: string;
    featured?: boolean;
};

// Lista de artículos (puedes moverlo a un archivo separado o CMS)
const articles: Article[] = [
    {
        slug: 'carta-qr-gratis',
        title: 'Carta QR gratis: pasa del PDF a una app profesional (sin pagar)',
        description: 'Descubre por qué una carta QR interactiva supera al PDF tradicional. Velocidad, filtros de alérgenos y cambios instantáneos. Prueba 3 meses gratis.',
        image: '/assets/recursos/qr-gratis.jpg',
        category: 'Digitalización',
        readTime: '3 min',
        date: '2025-01-10',
        featured: true,
    },
    {
        slug: 'normativa-europea-alergenos',
        title: 'Normativa de alérgenos en hostelería: guía clara del Reglamento 1169/2011',
        description: 'Todo lo que necesitas saber sobre el Reglamento 1169/2011. Qué dice la ley, multas, sanciones y cómo cumplirla sin papeleos.',
        image: '/assets/recursos/legal_rest.jpeg',
        category: 'Legislación',
        readTime: '7 min',
        date: '2025-01-09',
    },
    {
        slug: 'alergenos-pastelerias',
        title: 'Alérgenos en pastelerías y panaderías: ¿es obligatorio tener carta?',
        description: 'Guía completa sobre la obligación de informar sobre alérgenos en pastelerías y panaderías. Soluciones digitales para vitrinas sin papeles.',
        image: '/assets/recursos/panaderia_img.jpeg',
        category: 'Normativa Específica',
        readTime: '4 min',
        date: '2025-01-11',
    },
    {
        slug: 'como-hacer-carta-alergenos',
        title: 'Cómo hacer una carta de alérgenos: guía paso a paso',
        description: 'Guía práctica para crear tu carta de alérgenos desde cero. Aprende qué información incluir y cómo cumplir la normativa de forma sencilla.',
        image: '/assets/recursos/Piezas_social_media.jpg',
        category: 'Guías Prácticas',
        readTime: '6 min',
        date: '2025-01-12',
    },
];

export default function RecursosPage() {
    const featuredArticle = articles.find(a => a.featured);
    const regularArticles = articles.filter(a => !a.featured);

    return (
        <>
            <PublicHeader />

            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="bg-white py-20 px-4 border-b border-gray-100">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full mb-6">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Centro de Recursos</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#0F1C2E]">
                            Recursos sobre Alérgenos
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Guías, normativas y mejores prácticas para gestionar alérgenos en tu restaurante de forma profesional y segura.
                        </p>
                    </div>
                </section>

                {/* Featured Article */}
                {featuredArticle && (
                    <section className="max-w-6xl mx-auto px-4 py-16">
                        <Link
                            href={`/recursos/${featuredArticle.slug}`}
                            className="block group"
                        >
                            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                                <div className="grid md:grid-cols-2 gap-0">
                                    {/* Image */}
                                    <div className="relative h-64 md:h-auto">
                                        <Image
                                            src={featuredArticle.image}
                                            alt={featuredArticle.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 md:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-bold">
                                                ⭐ Destacado
                                            </span>
                                            <span className="text-gray-500 text-sm">{featuredArticle.category}</span>
                                        </div>

                                        <h2 className="text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors text-[#0F1C2E]">
                                            {featuredArticle.title}
                                        </h2>

                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {featuredArticle.description}
                                        </p>

                                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(featuredArticle.date).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{featuredArticle.readTime} de lectura</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-4 transition-all">
                                            Leer artículo completo <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </section>
                )}

                {/* Regular Articles Grid */}
                <section className="max-w-6xl mx-auto px-4 pb-20">
                    <h2 className="text-3xl font-bold mb-8 text-[#0F1C2E]">Más Recursos</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regularArticles.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/recursos/${article.slug}`}
                                className="group"
                            >
                                <article className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col border border-gray-100">
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-blue-600 text-sm font-bold">{article.category}</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-500 text-sm">{article.readTime}</span>
                                        </div>

                                        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors text-[#0F1C2E]">
                                            {article.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                                            {article.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="text-xs text-gray-500">
                                                {new Date(article.date).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Leer más <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            </div >
        </>
    );
}
