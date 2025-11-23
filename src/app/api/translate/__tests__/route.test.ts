// src/app/api/translate/__tests__/route.test.ts
import { POST } from '../route';

// Mock de todo el módulo 'next/server'
jest.mock('next/server', () => ({
  // Mantenemos todas las exportaciones originales...
  ...jest.requireActual('next/server'),
  // ...pero sobreescribimos NextResponse
  NextResponse: {
    json: (body, init) => {
      // En el test, NextResponse.json simplemente devuelve un objeto
      // que podemos leer fácilmente, sin streams ni nada complejo.
      return {
        status: init?.status || 200,
        headers: init?.headers || {},
        // El método .json() ahora solo devuelve el cuerpo que le pasaron
        json: async () => Promise.resolve(body),
      };
    },
  },
}));

describe('POST /api/translate', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, GOOGLE_TRANSLATE_API_KEY: 'test-key' };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          translations: [{ translatedText: 'hello' }],
        },
      }),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = OLD_ENV;
  });

  it('traducen el texto y devuelve translatedText', async () => {
    const body = { text: 'hola', targetLang: 'en' };
    const req = new Request('http://localhost', { 
        method: 'POST', 
        body: JSON.stringify(body) 
    });

    // Ahora 'res' será el objeto simple que definimos en el mock
    const res = await POST(req);
    const json = await res.json();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(json).toEqual({ translatedText: 'hello' });
  });

  it('devuelve 400 si el JSON es inválido', async () => {
    const badReq = new Request('http://localhost', {
      method: 'POST',
      body: '<<<not-json>>>',
    });

    const res = await POST(badReq);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Invalid request body.');
  });
});
