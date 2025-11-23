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

// Mock de la API Fetch para traducciones
global.fetch = jest.fn((url) => {
  if (url === '/api/translate') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ translatedText: 'Translated Text' }),
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
});
