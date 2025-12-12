import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://alergenu.com'; // Cambia esto por tu dominio real

    // Páginas estáticas principales
    const staticPages = [
        '',
        '/register',
        '/login',
        '/recursos',
    ];

    // Artículos de recursos
    const articles = [
        '/recursos/carta-qr-gratis',
        '/recursos/normativa-europea-alergenos',
        '/recursos/alergenos-pastelerias',
        '/recursos/como-hacer-carta-alergenos',
    ];

    // Páginas legales
    const legalPages = [
        '/legal/terms-of-service',
        '/legal/privacy-policy',
        '/legal/cookies',
    ];

    const staticRoutes = staticPages.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    const articleRoutes = articles.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    const legalRoutes = legalPages.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
    }));

    return [...staticRoutes, ...articleRoutes, ...legalRoutes];
}
