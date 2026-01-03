import { NextResponse } from 'next/server';
import { analyzeMenuPhotoFlow, getQualityIssueMessage, getQualityIssuesugestions } from '@/ai/menuPhotoAnalysis';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase/firebase-admin';
import {
    checkUsageLimit,
    incrementUsage,
    checkAnonymousUsageLimit,
    incrementAnonymousUsage
} from '@/lib/usageTracking';
import crypto from 'crypto';

/**
 * Maximum file size: 10MB
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Allowed image formats
 */
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Hash IP address for anonymous tracking
 */
function hashIP(ip: string): string {
    return crypto.createHash('sha256').update(ip).digest('hex');
}

/**
 * Get client IP from request
 */
function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return 'unknown';
}

console.log('ROUTE FILE LOADED - analyze-menu-photo');

export async function POST(request: Request) {
    console.log('POST HANDLER CALLED');
    console.log('[API] ========== NEW REQUEST ==========');
    console.log('[API] analyze-menu-photo: Request received at', new Date().toISOString());

    try {
        // 1. AUTHENTICATION CHECK (optional - works for both logged in and anonymous)
        const authHeader = request.headers.get('authorization');
        console.log('[API] Auth header present:', !!authHeader);

        let userId: string | null = null;

        // Try to verify Firebase Auth token if provided
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decodedToken = await getAuth(getAdminApp()).verifyIdToken(token);
                userId = decodedToken.uid;
                console.log('🔵 [API] Authenticated user:', userId);
            } catch (error) {
                // Token invalid, treat as anonymous
                console.log('⚠️ [API] Invalid token, treating as anonymous');
            }
        }

        // 2. PARSE FORM DATA
        console.log('🔵 [API] Parsing form data...');
        const formData = await request.formData();
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            console.log('❌ [API] No image file provided');
            return NextResponse.json(
                { error: 'no_image', message: 'No se ha proporcionado ninguna imagen' },
                { status: 400 }
            );
        }

        console.log('🔵 [API] Image received:', {
            name: imageFile.name,
            type: imageFile.type,
            size: imageFile.size,
            sizeKB: (imageFile.size / 1024).toFixed(2) + ' KB'
        });

        // 3. VALIDATE FILE
        if (!ALLOWED_FORMATS.includes(imageFile.type)) {
            console.log('❌ [API] Invalid format:', imageFile.type);
            return NextResponse.json(
                { error: 'invalid_format', message: 'Formato de imagen no válido. Usa JPG, PNG o WEBP' },
                { status: 400 }
            );
        }

        if (imageFile.size > MAX_FILE_SIZE) {
            console.log('❌ [API] File too large:', imageFile.size);
            return NextResponse.json(
                { error: 'file_too_large', message: 'La imagen es demasiado grande. Máximo 10MB' },
                { status: 400 }
            );
        }


        // 4. CHECK USAGE LIMITS - TEMPORARILY DISABLED FOR TESTING
        console.log('[API] SKIPPING usage limits for testing...');
        let canUpload = true; // FORCE TRUE FOR TESTING
        let remaining = 9999; // FAKE VALUE FOR TESTING

        /* TEMPORARILY DISABLED - UNCOMMENT WHEN TESTING IS DONE
        if (userId) {
            console.log('[API] Checking for authenticated user:', userId);
            const usageCheck = await checkUsageLimit(userId);
            canUpload = usageCheck.canUpload;
            remaining = usageCheck.remaining;
            console.log('[API] User usage:', usageCheck);
        } else {
            // Anonymous user - track by IP
            console.log('[API] Anonymous user, tracking by IP');
            const ip = getClientIP(request);
            console.log('[API] IP detected:', ip);
            const ipHash = hashIP(ip);
            console.log('[API] IP hash:', ipHash.substring(0, 16) + '...');

            const anonCheck = await checkAnonymousUsageLimit(ipHash);
            canUpload = anonCheck.canUpload;
            remaining = anonCheck.remaining;
            console.log('[API] Anonymous usage:', anonCheck);
        }

        console.log('[API] Usage check result - Can upload:', canUpload, 'Remaining:', remaining);

        if (!canUpload) {
            console.log('[API] Upload limit reached');
            return NextResponse.json(
                {
                    error: 'limit_reached',
                    message: userId
                        ? 'Has alcanzado tu límite de 5 análisis gratuitos. Compra más créditos para continuar.'
                        : 'Has alcanzado tu límite de 5 análisis gratuitos. Regístrate para obtener más.',
                    remaining: 0,
                    requiresAuth: !userId,
                },
                { status: 403 }
            );
        }
        */

        // 5. CONVERT IMAGE TO BASE64
        console.log('🔵 [API] Converting image to base64...');
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');
        console.log('🔵 [API] Base64 conversion complete. Length:', base64Image.length, 'chars');

        // 6. CALL AI ANALYSIS
        console.log('🔵 [API] Calling AI analysis flow...');
        const startTime = Date.now();

        const result = await analyzeMenuPhotoFlow({
            imageBase64: base64Image,
        });

        const duration = Date.now() - startTime;
        console.log('🔵 [API] AI analysis complete in', duration, 'ms');
        console.log('🔵 [API] Result:', {
            success: result.success,
            itemsCount: result.items.length,
            qualityIssue: result.qualityIssue,
            categories: result.detectedCategories
        });

        // 7. HANDLE QUALITY ISSUES
        if (!result.success && result.qualityIssue) {
            console.log('⚠️ [API] Quality issue detected:', result.qualityIssue);
            return NextResponse.json(
                {
                    success: false,
                    qualityIssue: true,
                    message: getQualityIssueMessage(result.qualityIssue),
                    suggestions: getQualityIssuesugestions(result.qualityIssue),
                    remaining,
                },
                { status: 200 }
            );
        }

        // 8. INCREMENT USAGE COUNTER - TEMPORARILY DISABLED FOR TESTING
        console.log('[API] SKIPPING usage counter increment for testing...');

        /* TEMPORARILY DISABLED - UNCOMMENT WHEN FIRESTORE PERMISSIONS ARE FIXED
        if (userId) {
            await incrementUsage(userId, result.items.length, true);
            console.log('[API] Usage incremented for user:', userId);
        } else {
            const ip = getClientIP(request);
            const ipHash = hashIP(ip);
            await incrementAnonymousUsage(ipHash);
            console.log('[API] Anonymous usage incremented for IP hash:', ipHash.substring(0, 16) + '...');
        }
        */

        // 9. RETURN SUCCESS
        console.log('✅ [API] Analysis successful! Returning', result.items.length, 'items');
        console.log('🔵 [API] ========== REQUEST COMPLETE ==========');

        return NextResponse.json({
            success: true,
            items: result.items,
            detectedCategories: result.detectedCategories,
            remaining: remaining - 1, // Decrement for display
        });

    } catch (error) {
        console.error('❌ [API] ========== CRITICAL ERROR ==========');
        console.error('❌ [API] Error in analyze-menu-photo:', error);
        console.error('❌ [API] Error type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('❌ [API] Error message:', error instanceof Error ? error.message : String(error));
        console.error('❌ [API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.error('❌ [API] ========================================');

        return NextResponse.json(
            { error: 'server_error', message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
