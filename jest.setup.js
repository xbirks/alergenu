// jest.setup.js
import 'whatwg-fetch';
import '@testing-library/jest-dom';

// Polyfill para Response.json en entorno de test (JSDOM/Jest)
if (typeof Response.json !== 'function') {
  Response.json = function (data, init) {
    const jsonString = JSON.stringify(data ?? null);

    // Aseguramos que Headers existe (lo trae whatwg-fetch)
    const headers = new Headers(init?.headers || {});
    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }

    return new Response(jsonString, {
      ...init,
      headers,
    });
  };
}

// Si necesitas ResizeObserver para componentes de UI
// (opcional; sólo si realmente hay componentes que lo usan)
if (typeof global.ResizeObserver === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  global.ResizeObserver = require('resize-observer-polyfill');
}
