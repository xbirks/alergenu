'use client';

import React from 'react';
import { render, screen, waitFor, within } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MenuItemForm } from '../MenuItemForm';

// -- Mock de Dependencias --

// Mock de useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock de useAuth
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'test-user-id', displayName: 'Test User' } }),
}));

// Mock de useToast
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock de Firebase Firestore
const mockWriteBatch = {
  set: jest.fn(),
  update: jest.fn(),
  commit: jest.fn().mockResolvedValue(undefined),
};
jest.mock('@/lib/firebase/firebase', () => ({
  db: {},
}));
jest.mock('firebase/firestore', () => ({
  writeBatch: () => mockWriteBatch,
  doc: jest.fn((db, ...path) => `mock/doc/${path.join('/')}`),
  collection: jest.fn((db, ...path) => `mock/collection/${path.join('/')}`),
  serverTimestamp: () => 'mock_timestamp',
  getDoc: jest.fn(() => Promise.resolve({ exists: () => true, data: () => ({ name_i18n: { es: 'Bebidas', en: 'Drinks' } }) })),
}));

// Mock de CategoryCombobox con la corrección
jest.mock('@/components/lilunch/CategoryCombobox', () => ({
  CategoryCombobox: ({ value, onChange }: { value: any, onChange: (value: any) => void }) => (
    <button
      type="button" // SOLUCIÓN: Evita que el botón actúe como submit
      data-testid="category-combobox"
      onClick={() => onChange({ id: 'cat-123', name_i18n: { es: 'Entrantes', en: 'Starters' } })}>
      {value ? value.name_i18n.es : 'Seleccionar categoría'}
    </button>
  ),
}));

// Mock de la API Fetch para traducciones y detección de alérgenos
global.fetch = jest.fn((url) => {
  if (url === '/api/translate') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ translatedText: 'Translated Text' }),
    } as Response);
  }
  if (url === '/api/detect-allergens') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ allergens: ['gluten', 'leche', 'huevos'] }),
    } as Response);
  }
  return Promise.resolve({ ok: false, json: () => Promise.resolve({}) } as Response);
});

// -- Suite de Tests --

describe('MenuItemForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('crea un nuevo plato con éxito al rellenar los campos requeridos', async () => {
    const user = userEvent.setup();
    render(<MenuItemForm />);

    // 1. Rellenar el formulario
    await user.type(screen.getByLabelText(/Nombre del plato \(ES\)/i), 'Paella Valenciana');
    await user.type(screen.getByLabelText(/Descripción \(ES\)/i), 'La auténtica paella de la terreta.');
    await user.type(screen.getByLabelText(/Precio/i), '15,50');

    // 2. Seleccionar categoría a través del mock
    await user.click(screen.getByTestId('category-combobox'));

    // 3. Marcar un alérgeno
    const glutenRow = screen.getByText(/Gluten/).closest('div.flex.items-center.justify-between');
    if (!glutenRow) throw new Error('Fila de Gluten no encontrada');

    const yesButton = within(glutenRow).getByRole('button', { name: /SI/i });
    await user.click(yesButton);

    // 4. Enviar el formulario
    const submitButton = screen.getByRole('button', { name: /Añadir plato/i });
    await user.click(submitButton);

    // 5. Verificar que se muestra el feedback de traducción
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Traduciendo plato...' }));
    });

    // 6. Verificar las llamadas a la API y a la BD (AHORA SÍ)
    await waitFor(() => {
      // Se llamó a la traducción para el nombre y la descripción
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: '¡Plato añadido!' }));

      // Se guardaron los datos correctos en el batch de Firestore
      expect(mockWriteBatch.set).toHaveBeenCalledWith(
        expect.any(String), // El docRef del nuevo plato
        expect.objectContaining({
          name_i18n: { es: 'Paella Valenciana', en: 'Translated Text' },
          price: 1550,
          categoryId: 'cat-123',
          allergens: { gluten: 'yes' },
        })
      );

      expect(mockWriteBatch.commit).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/dashboard/menu');
    });
  });

  // --- Tests de la funcionalidad de IA de detección de alérgenos ---

  describe('Detección de alérgenos con IA', () => {
    it('detecta alérgenos usando solo el nombre del plato', async () => {
      const user = userEvent.setup();
      render(<MenuItemForm />);

      // 1. Escribir solo el nombre
      await user.type(screen.getByLabelText(/Nombre del plato \(ES\)/i), 'Tortilla de patatas');

      // 2. Hacer clic en el botón "Detectar con IA"
      const detectButton = screen.getByRole('button', { name: /Detectar con IA/i });
      expect(detectButton).toBeInTheDocument();
      await user.click(detectButton);

      // 3. Verificar que se llamó al API con el nombre correcto
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/detect-allergens',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ dishName: 'Tortilla de patatas' }),
          })
        );
      });

      // 4. Verificar que se muestra el toast de análisis
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Analizando alérgenos...' })
      );

      // 5. Verificar que se muestra el toast de éxito
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: '¡Análisis completado!',
            description: expect.stringContaining('Se detectaron 3 alérgenos')
          })
        );
      });
    });

    it('detecta alérgenos usando nombre + descripción del plato', async () => {
      const user = userEvent.setup();
      render(<MenuItemForm />);

      // 1. Escribir nombre y descripción
      await user.type(screen.getByLabelText(/Nombre del plato \(ES\)/i), 'Ensalada especial');
      await user.type(screen.getByLabelText(/Descripción \(ES\)/i), 'Con nueces, queso de cabra y vinagreta de mostaza');

      // 2. Hacer clic en el botón de IA
      const detectButton = screen.getByRole('button', { name: /Detectar con IA/i });
      await user.click(detectButton);

      // 3. Verificar que se llamó al API con nombre + descripción combinados
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/detect-allergens',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              dishName: 'Ensalada especial. Ingredientes: Con nueces, queso de cabra y vinagreta de mostaza'
            }),
          })
        );
      });

      // 4. Verificar el toast de procesamiento
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'La IA está procesando el plato (nombre + ingredientes).'
        })
      );
    });

    it('muestra el botón deshabilitado cuando no hay nombre', async () => {
      render(<MenuItemForm />);

      const detectButton = screen.getByRole('button', { name: /Detectar con IA/i });

      // El botón debe estar deshabilitado sin nombre
      expect(detectButton).toBeDisabled();
    });

    it('cambia el texto del botón después de analizar', async () => {
      const user = userEvent.setup();
      render(<MenuItemForm />);

      // 1. Escribir nombre
      await user.type(screen.getByLabelText(/Nombre del plato \(ES\)/i), 'Paella');

      // 2. Verificar estado inicial del botón
      let detectButton = screen.getByRole('button', { name: /Detectar con IA/i });
      expect(detectButton).toBeInTheDocument();

      // 3. Hacer clic
      await user.click(detectButton);

      // 4. Después del análisis, el botón debe cambiar a "Re-analizar"
      await waitFor(() => {
        const reanalyzeButton = screen.getByRole('button', { name: /Re-analizar con IA/i });
        expect(reanalyzeButton).toBeInTheDocument();
      });
    });

    it('resetea el estado de análisis cuando cambia el nombre del plato', async () => {
      const user = userEvent.setup();
      render(<MenuItemForm />);

      // 1. Escribir nombre y analizar
      await user.type(screen.getByLabelText(/Nombre del plato \(ES\)/i), 'Tortilla');
      const detectButton = screen.getByRole('button', { name: /Detectar con IA/i });
      await user.click(detectButton);

      // 2. Esperar a que cambie a "Re-analizar"
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Re-analizar con IA/i })).toBeInTheDocument();
      });

      // 3. Cambiar el nombre del plato
      const nameInput = screen.getByLabelText(/Nombre del plato \(ES\)/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Paella');

      // 4. El botón debe volver a "Detectar con IA"
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Detectar con IA/i })).toBeInTheDocument();
      });
    });

    it('maneja errores del API de detección correctamente', async () => {
      // Mock fetch para que falle en este test
      const originalFetch = global.fetch;
      global.fetch = jest.fn((url) => {
        if (url === '/api/detect-allergens') {
          return Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: 'API Error' }),
          } as Response);
        }
        return originalFetch(url);
      }) as any;

      const user = userEvent.setup();
      render(<MenuItemForm />);

      // 1. Escribir nombre
      await user.type(screen.getByLabelText(/Nombre del plato \(ES\)/i), 'Plato de prueba');

      // 2. Hacer clic en detectar
      const detectButton = screen.getByRole('button', { name: /Detectar con IA/i });
      await user.click(detectButton);

      // 3. Verificar que se muestra el toast de error
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Error en el análisis',
            variant: 'destructive'
          })
        );
      });

      // Restaurar el fetch original
      global.fetch = originalFetch;
    });

    it('muestra mensaje de error si se intenta analizar sin nombre', async () => {
      const user = userEvent.setup();
      render(<MenuItemForm />);

      // Intentar hacer clic sin haber escrito nombre (el botón está deshabilitado, pero simulamos)
      // En realidad este test verifica que el botón esté deshabilitado
      const detectButton = screen.getByRole('button', { name: /Detectar con IA/i });
      expect(detectButton).toBeDisabled();
    });
  });
});
