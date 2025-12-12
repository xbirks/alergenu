import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://alergenu.com'; // Cambia esto por tu dominio real

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard/',
                    '/admin/',
                    '/api/',
                    '/lilunch/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
