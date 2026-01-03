
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterPage from '../page'; // Ajusta la ruta si es necesario

// -- Mock de dependencias externas --

// 1. Mock de Next.js Navigation
const mockPush = jest.fn();
const mockSearchParams = {
  get: jest.fn().mockReturnValue(null), // Por defecto no hay plan en la URL
};
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
  Suspense: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// 2. Mock de Firebase
const mockCreateUser = jest.fn();
const mockSendEmail = jest.fn();
const mockWriteBatch = {
  set: jest.fn(),
  commit: jest.fn().mockResolvedValue(undefined),
};
const mockGetDocs = jest.fn(() => Promise.resolve({ empty: true })); // Simula que el slug es único

jest.mock('@/lib/firebase/firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {}, // Mock del provider de Google
}));

// Mock del componente GoogleSignInButton
jest.mock('@/components/auth/GoogleSignInButton', () => ({
  GoogleSignInButton: () => <div data-testid="google-signin-button">Google Sign In</div>,
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (auth: any, email: string, password: string) => mockCreateUser(auth, email, password), // <-- CORREGIDO
  sendEmailVerification: (user: any) => mockSendEmail(user),
}));
jest.mock('firebase/firestore', () => ({
  writeBatch: () => mockWriteBatch,
  doc: jest.fn((db, collection, id) => `mock/doc/${id}`),
  collection: jest.fn((db, ...path) => `mock/collection/${path.join('/')}`),
  serverTimestamp: () => 'mock_timestamp',
  query: jest.fn(),
  where: jest.fn(),
  getDocs: (query: any) => mockGetDocs(query),
}));

// 3. Mock de Fetch API
global.fetch = jest.fn((url) => {
  if (url === '/api/get-ip') {
    return Promise.resolve({
      json: () => Promise.resolve({ ip: '127.0.0.1' }),
    } as Response);
  }
  return Promise.resolve({ json: () => Promise.resolve({}) } as Response);
});

// -- Suite de Tests --

describe('Flujo de Registro en RegisterPage', () => {

  // Limpiar mocks después de cada test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('permite el registro exitoso con el plan gratuito y redirige a verificación', async () => {
    // Mock de la respuesta de createUserWithEmailAndPassword
    const mockUser = { user: { uid: 'test-uid-123', email: 'test@example.com' } };
    mockCreateUser.mockResolvedValue(mockUser);

    render(<RegisterPage />);

    // 1. Rellenar el formulario
    fireEvent.change(screen.getByLabelText(/Nombre del restaurante/i), { target: { value: 'Restaurante de Prueba' } });
    fireEvent.change(screen.getByLabelText(/Tu nombre y apellidos/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Repite tu contraseña/i), { target: { value: 'password123' } });

    // 2. Aceptar los términos
    fireEvent.click(screen.getByLabelText(/Acepto los términos y condiciones/i));

    // 3. Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta y continuar/i }));

    // 4. Aserciones (Verificaciones)
    await waitFor(() => {
      // Se llamó a la función para crear el usuario
      expect(mockCreateUser).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
    });

    await waitFor(() => {
      // Se envió el correo de verificación
      expect(mockSendEmail).toHaveBeenCalledWith(mockUser.user);
    });

    await waitFor(() => {
      // Se confirmó la escritura en la base de datos
      expect(mockWriteBatch.commit).toHaveBeenCalled();
    });

    await waitFor(() => {
      // Se redirigió a la página de verificación
      expect(mockPush).toHaveBeenCalledWith('/auth/verify-email');
    });

    // Nos aseguramos de que no se muestre ningún error
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

});
