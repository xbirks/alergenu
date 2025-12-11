import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface FirestoreRateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    resetAt: Date;
}

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

/**
 * Rate limiting usando Firestore como almacenamiento persistente.
 * Ideal para limitar uso de endpoints costosos (como IA) sin servicios externos.
 * 
 * @param identifier - Identificador único (ej: "ip:192.168.1.1" o "user:uid123")
 * @param config - Configuración del rate limit (máximo de requests y ventana de tiempo)
 * @returns Resultado indicando si la request está permitida
 */
export async function checkFirestoreRateLimit(
    identifier: string,
    config: RateLimitConfig
): Promise<FirestoreRateLimitResult> {
    const rateLimitRef = doc(db, 'rateLimits', identifier);
    const now = Date.now();

    try {
        const snapshot = await getDoc(rateLimitRef);

        if (!snapshot.exists()) {
            // Primera request - crear documento
            const resetAt = new Date(now + config.windowMs);
            await setDoc(rateLimitRef, {
                count: 1,
                resetAt: Timestamp.fromDate(resetAt),
                createdAt: serverTimestamp(),
                lastRequestAt: serverTimestamp(),
            });

            return {
                success: true,
                limit: config.maxRequests,
                remaining: config.maxRequests - 1,
                resetAt,
            };
        }

        const data = snapshot.data();
        const resetAt = data.resetAt.toDate();

        // Si ya expiró la ventana, resetear
        if (now > resetAt.getTime()) {
            const newResetAt = new Date(now + config.windowMs);
            await updateDoc(rateLimitRef, {
                count: 1,
                resetAt: Timestamp.fromDate(newResetAt),
                lastRequestAt: serverTimestamp(),
            });

            return {
                success: true,
                limit: config.maxRequests,
                remaining: config.maxRequests - 1,
                resetAt: newResetAt,
            };
        }

        // Verificar si superó el límite
        if (data.count >= config.maxRequests) {
            return {
                success: false,
                limit: config.maxRequests,
                remaining: 0,
                resetAt,
            };
        }

        // Incrementar contador
        await updateDoc(rateLimitRef, {
            count: data.count + 1,
            lastRequestAt: serverTimestamp(),
        });

        return {
            success: true,
            limit: config.maxRequests,
            remaining: config.maxRequests - (data.count + 1),
            resetAt,
        };

    } catch (error) {
        console.error('[Rate Limit] Error checking rate limit:', error);
        // En caso de error, permitir la request (fail open)
        // Es mejor permitir una request que bloquear usuarios legítimos
        return {
            success: true,
            limit: config.maxRequests,
            remaining: config.maxRequests,
            resetAt: new Date(now + config.windowMs),
        };
    }
}

/**
 * Helper para obtener la IP del cliente desde un Request de Next.js
 */
export function getClientIp(request: Request): string {
    // Intentar obtener la IP real de diferentes headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare

    if (forwarded) {
        // x-forwarded-for puede contener múltiples IPs, tomar la primera
        return forwarded.split(',')[0].trim();
    }

    return realIp || cfConnectingIp || 'unknown';
}

/**
 * Configuraciones predefinidas de rate limiting
 */
export const RATE_LIMIT_CONFIGS = {
    // Para endpoints de IA (costosos)
    AI_ENDPOINT: {
        maxRequests: 50,
        windowMs: 60 * 60 * 1000, // 50 requests por hora
    },

    // Para endpoints normales de API
    API_ENDPOINT: {
        maxRequests: 100,
        windowMs: 60 * 1000, // 100 requests por minuto
    },

    // Para autenticación
    AUTH_ENDPOINT: {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000, // 5 requests por 15 minutos
    },
} as const;
