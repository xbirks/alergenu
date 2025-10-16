
import { NextRequest, NextResponse } from 'next/server';

// This is a new version with extensive logging for debugging purposes.
export async function POST(req: NextRequest) {
  console.log('--- TRANSLATION API START ---');

  let requestBody;
  try {
    requestBody = await req.json();
    console.log('Received request body:', requestBody);
  } catch (error) {
    console.error('Could not parse request body:', error);
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { text, targetLang } = requestBody;
  const apiKey = process.env.TRADUCTOR_API;

  if (apiKey) {
    console.log('Google Translate API Key found. Starts with:', apiKey.substring(0, 5));
  } else {
    console.error('CRITICAL: Google Translate API key is NOT configured.');
    return NextResponse.json({ error: 'La clave de API de Google Translate no está configurada en el servidor.' }, { status: 500 });
  }

  if (!text) {
    console.log('No text provided for translation.');
    // Return success but with empty text to match original non-blocking behavior
    return NextResponse.json({ translatedText: '' });
  }

  console.log(`Preparing to translate text: "${text}" to target language: "${targetLang || 'en'}"`);
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  try {
    console.log('Calling Google Translate API...');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        target: targetLang || 'en',
        format: 'text'
      }),
    });

    const data = await response.json();
    console.log('Received response from Google Translate API:', JSON.stringify(data, null, 2));

    if (!response.ok || data.error) {
        console.error('Google Translate API returned an error. Status:', response.status);
        return NextResponse.json({ error: 'Error al traducir el texto.', details: data.error?.message || 'Unknown API error' }, { status: 500 });
    }

    const translatedText = data.data?.translations?.[0]?.translatedText;
    console.log('Extracted translated text:', translatedText);
    
    console.log('--- TRANSLATION API END (SUCCESS) ---');
    return NextResponse.json({ translatedText });

  } catch (error) {
    console.error('CRITICAL: Failed to call Google Translate API. CATCH BLOCK ERROR:', error);
    console.log('--- TRANSLATION API END (FAILURE) ---');
    return NextResponse.json({ error: 'Ha fallado la comunicación con el servicio de traducción.' }, { status: 500 });
  }
}
