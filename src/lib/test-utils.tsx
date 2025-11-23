
import React from 'react';
import { render as rtlRender } from '@testing-library/react';

// Un wrapper simple sin StrictMode. Aquí se podrían añadir otros providers globales
// necesarios para los tests (ThemeProvider, Redux, etc.).
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Función de renderizado personalizada que utiliza nuestro wrapper.
const render = (ui: React.ReactElement, options?: any) => {
  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

// Re-exportamos todo desde @testing-library/react
export * from '@testing-library/react';
// Y sobreescribimos el método render con el nuestro.
export { render };
