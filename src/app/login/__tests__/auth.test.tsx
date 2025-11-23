
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../page';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';

// 1. Mockear el router de Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// 2. Mockear las funciones de 'firebase/auth' que se usan en el componente
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(() => Promise.resolve()),
}));

// 3. Mockear el módulo wrapper de donde se importa el objeto 'auth'
jest.mock('@/lib/firebase/firebase', () => ({
  auth: {
    signOut: jest.fn(() => Promise.resolve()),
  },
}));

// Hacemos un type casting de los mocks para poder usarlos cómodamente en los tests
const mockedUseRouter = useRouter as jest.Mock;
const mockedSignIn = signInWithEmailAndPassword as jest.Mock;
const mockedAuth = auth as jest.Mocked<typeof auth>;

describe('Flujo de autenticación de LoginPage', () => {
  const user = userEvent.setup();
  const mockPush = jest.fn();

  beforeEach(() => {
    // Limpiamos los mocks antes de cada test
    jest.clearAllMocks();
    // Configuramos el mock del router para que devuelva nuestra función mock 'push'
    mockedUseRouter.mockReturnValue({ push: mockPush });
  });

  it('redirige a /dashboard con un login exitoso y email verificado', async () => {
    // Arrange: Preparamos el mock para un login exitoso con usuario verificado
    const mockUser = {
      user: {
        uid: 'fake-uid',
        emailVerified: true, // El email está verificado
      },
    };
    mockedSignIn.mockResolvedValue(mockUser);

    // Act: Renderizamos el componente
    render(<LoginPage />);

    // Simulamos la interacción del usuario
    await user.type(screen.getByLabelText(/Correo electrónico/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    // Assert: Verificamos que todo ocurrió como se esperaba
    // 1. ¿Se llamó a signInWithEmailAndPassword con los datos correctos?
    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith(
        mockedAuth, // El objeto 'auth' importado
        'test@example.com',
        'password123'
      );
    });

    // 2. ¿Se llamó al router para redirigir al dashboard?
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('muestra un error si las credenciales son incorrectas', async () => {
    // Arrange: Simulamos un error de autenticación
    const authError = { code: 'auth/invalid-credential' };
    mockedSignIn.mockRejectedValue(authError);

    // Act
    render(<LoginPage />);
    await user.type(screen.getByLabelText(/Correo electrónico/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Contraseña/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    // Assert: Verificamos que se muestra el mensaje de error y no hay redirección
    const errorMessage = await screen.findByText('Correo o contraseña incorrectos.');
    expect(errorMessage).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('muestra error y no redirige si el email no está verificado', async () => {
    // Arrange: Simulamos un login exitoso pero con email no verificado
    const mockUser = {
      user: {
        uid: 'fake-uid',
        emailVerified: false, // El email NO está verificado
      },
    };
    mockedSignIn.mockResolvedValue(mockUser);

    // Act
    render(<LoginPage />);
    await user.type(screen.getByLabelText(/Correo electrónico/i), 'unverified@example.com');
    await user.type(screen.getByLabelText(/Contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    // Assert
    // 1. Se muestra el mensaje de error de verificación
    const errorMessage = await screen.findByText(/Tu cuenta no está verificada/i);
    expect(errorMessage).toBeInTheDocument();

    // 2. Se intentó enviar un nuevo email de verificación
    expect(sendEmailVerification).toHaveBeenCalledWith(mockUser.user);

    // 3. Se llamó a signOut para desloguear al usuario
    expect(mockedAuth.signOut).toHaveBeenCalled();

    // 4. NO se produjo ninguna redirección
    expect(mockPush).not.toHaveBeenCalled();
  });
});
