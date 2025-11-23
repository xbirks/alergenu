// src/app/api/translate/route.ts
import { NextResponse } from 'next/server';

type TranslateRequestBody = {
  text?: string;
  targetLang?: string;
};

export async function POST(req: Request) {
  let requestBody: TranslateRequestBody;

  try {
    requestBody = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const { text, targetLang } = requestBody;

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          'La clave de API de Google Translate no está configurada en el servidor.',
      },
      { status: 500 }
    );
  }

  if (!text) {
    // Devuelve éxito pero con texto vacío para no bloquear
    return NextResponse.json({ translatedText: '' });
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        target: targetLang ?? 'en',
        format: 'text',
      }),
    });

    const data = await response.json();

    if (!response.ok || (data as any).error) {
      return NextResponse.json(
        { error: 'Error en el servicio de traducción.' },
        { status: 502 }
      );
    }

    const translatedText =
      (data as any).data?.translations?.[0]?.translatedText ?? '';

    return NextResponse.json({ translatedText });
  } catch {
    return NextResponse.json(
      { error: 'Ha fallado la comunicación con el servicio de traducción.' },
      { status: 500 }
    );
  }
}
