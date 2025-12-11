import { NextResponse } from 'next/server';
import { detectAllergensFlow } from '@/ai/allergenDetection';
import { checkFirestoreRateLimit, getClientIp, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit-firestore';

export async function POST(request: Request) {
  // 1. RATE LIMITING - Protección contra abuso
  const ip = getClientIp(request);
  const identifier = `ai:${ip}`;

  const rateLimit = await checkFirestoreRateLimit(
    identifier,
    RATE_LIMIT_CONFIGS.AI_ENDPOINT
  );

  if (!rateLimit.success) {
    const retryAfterSeconds = Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000);

    console.log(`[API] Rate limit exceeded for IP: ${ip}`);

    return NextResponse.json(
      {
        error: 'Has alcanzado el límite de detecciones de IA. Por favor, intenta de nuevo más tarde.',
        retryAfterSeconds,
        resetAt: rateLimit.resetAt.toISOString(),
        limit: rateLimit.limit,
        remaining: 0,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfterSeconds.toString(),
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimit.resetAt.toISOString(),
        },
      }
    );
  }

  // 2. VALIDACIÓN DE INPUT
  try {
    const { dishName } = await request.json();

    if (!dishName) {
      return NextResponse.json({ error: 'dishName is required' }, { status: 400 });
    }

    if (typeof dishName !== 'string' || dishName.trim().length === 0) {
      return NextResponse.json({ error: 'dishName must be a non-empty string' }, { status: 400 });
    }

    if (dishName.length > 200) {
      return NextResponse.json({ error: 'dishName is too long (max 200 characters)' }, { status: 400 });
    }

    console.log(`[API] Analyzing dish: "${dishName}" (IP: ${ip}, Remaining: ${rateLimit.remaining}/${rateLimit.limit})`);

    // 3. LLAMADA A LA IA
    const result = await detectAllergensFlow(dishName);

    console.log(`[API] Analysis complete. Allergens found:`, result.allergens);

    // 4. RESPUESTA CON HEADERS DE RATE LIMIT
    return NextResponse.json(result, {
      headers: {
        'X-RateLimit-Limit': rateLimit.limit.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetAt.toISOString(),
      },
    });

  } catch (error) {
    console.error('[API] Error in detect-allergens route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
