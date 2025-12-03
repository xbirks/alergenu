
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/firebase-admin';

const db = getAdminDb();
const redirectsDocRef = db.collection('qr_redirects').doc('config');

// URL por defecto en caso de que no se encuentre una configuración específica.
const DEFAULT_REDIRECT_URL = 'https://www.alergenu.com';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const qrId = params.id;
    const key = `qr${qrId}`; // p.ej., qr1, qr2

    // Validación básica del ID
    if (qrId !== '1' && qrId !== '2') {
        return new Response('Not Found', { status: 404 });
    }

    try {
        const doc = await redirectsDocRef.get();

        if (doc.exists) {
            const redirects = doc.data();
            const redirectUrl = redirects?.[key];

            if (redirectUrl) {
                // Si se encuentra una URL, se redirige a ella.
                return NextResponse.redirect(redirectUrl, { status: 307 }); // Redirección Temporal
            }
        }

        // Si el documento o la clave no existen, redirigir a la URL por defecto.
        console.warn(`[QR Redirect] URL para '${key}' no encontrada. Redirigiendo a la URL por defecto.`);
        return NextResponse.redirect(DEFAULT_REDIRECT_URL, { status: 307 });

    } catch (error) {
        console.error(`[QR Redirect] Error al obtener la redirección para '${key}':`, error);
        // En caso de error, redirigir también a la URL por defecto por seguridad.
        return NextResponse.redirect(DEFAULT_REDIRECT_URL, { status: 307 });
    }
}
