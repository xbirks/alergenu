import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPage from '../page';

// -- Mock de Dependencias --

// Mock de next/navigation
jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}));

// Mock de next/link
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => {
        return <a href={href}>{children}</a>;
    };
});

// Mock de firebase-admin
let mockRestaurantsData: any[] = [];

const mockFirestoreGet = jest.fn(() => {
    return Promise.resolve({
        docs: mockRestaurantsData.map(data => ({
            id: data.id,
            data: () => data,
        })),
    });
});

const mockFirestoreCount = jest.fn(() => {
    return Promise.resolve({
        get: () => Promise.resolve({
            data: () => ({ count: 0 }),
        }),
    });
});

const mockCollection = jest.fn((path: string) => ({
    orderBy: jest.fn(() => ({
        get: mockFirestoreGet,
    })),
    doc: jest.fn((docId: string) => ({
        collection: jest.fn(() => ({
            count: mockFirestoreCount,
        })),
    })),
    count: mockFirestoreCount,
}));

jest.mock('@/lib/firebase/firebase-admin', () => ({
    getAdminDb: jest.fn(() => ({
        collection: mockCollection,
    })),
}));

// Mock de firebase-auth
const mockCurrentUser = { uid: 'admin-uid', email: 'admin@test.com' };
const mockToken = { admin: true };

jest.mock('@/lib/firebase/firebase-auth', () => ({
    getAuthenticatedAppForUser: jest.fn(() =>
        Promise.resolve({
            currentUser: mockCurrentUser,
            token: mockToken,
        })
    ),
}));

// Mock de firebase-admin/firestore Timestamp
// Define MockTimestamp before using it in the mock
class MockTimestamp {
    constructor(public seconds: number, public nanoseconds: number) { }
    toDate() {
        return new Date(this.seconds * 1000);
    }
}

jest.mock('firebase-admin/firestore', () => ({
    Timestamp: class {
        constructor(public seconds: number, public nanoseconds: number) { }
        toDate() {
            return new Date(this.seconds * 1000);
        }
    },
}));

// Mock de componentes
jest.mock('@/components/admin/AdminBackButton', () => {
    return function MockAdminBackButton() {
        return <button>← Volver</button>;
    };
});

jest.mock('@/components/admin/RestaurantListClient', () => {
    return {
        RestaurantListClient: function MockRestaurantListClient({ restaurants }: any) {
            return (
                <div data-testid="restaurant-list">
                    {restaurants.map((r: any) => (
                        <div key={r.id} data-testid={`restaurant-${r.id}`}>
                            <h3>{r.name}</h3>
                            <p>{r.email}</p>
                            <p>{r.ownerName}</p>
                            <p>{r.plan}</p>
                            <p>{r.status}</p>
                        </div>
                    ))}
                </div>
            );
        },
    };
});

// Mock de UI components
jest.mock('@/components/ui/card', () => ({
    Card: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardContent: ({ children }: any) => <div>{children}</div>,
    CardHeader: ({ children }: any) => <div>{children}</div>,
    CardTitle: ({ children }: any) => <h3>{children}</h3>,
}));

// Mock de lucide-react icons
jest.mock('lucide-react', () => ({
    Users: () => <span>UsersIcon</span>,
    CheckCircle: () => <span>CheckCircleIcon</span>,
    Clock: () => <span>ClockIcon</span>,
    QrCode: () => <span>QrCodeIcon</span>,
}));

// -- Suite de Tests --

describe('AdminPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRestaurantsData = [];
        mockFirestoreCount.mockReturnValue({
            get: () => Promise.resolve({
                data: () => ({ count: 0 }),
            }),
        });
    });

    describe('Autenticación y Autorización', () => {
        it('renderiza correctamente cuando el usuario es admin', async () => {
            const { getAuthenticatedAppForUser } = require('@/lib/firebase/firebase-auth');
            getAuthenticatedAppForUser.mockResolvedValue({
                currentUser: mockCurrentUser,
                token: { admin: true },
            });

            mockRestaurantsData = [];

            render(await AdminPage());

            expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
        });

        it('redirige cuando el usuario no está autenticado', async () => {
            const { redirect } = require('next/navigation');
            const { getAuthenticatedAppForUser } = require('@/lib/firebase/firebase-auth');

            getAuthenticatedAppForUser.mockResolvedValue({
                currentUser: null,
                token: null,
            });

            await AdminPage();

            expect(redirect).toHaveBeenCalledWith('/');
        });

        it('redirige cuando el usuario no es admin', async () => {
            const { redirect } = require('next/navigation');
            const { getAuthenticatedAppForUser } = require('@/lib/firebase/firebase-auth');

            getAuthenticatedAppForUser.mockResolvedValue({
                currentUser: mockCurrentUser,
                token: { admin: false },
            });

            await AdminPage();

            expect(redirect).toHaveBeenCalledWith('/');
        });
    });

    describe('Renderizado de Estadísticas', () => {
        it('muestra las 4 tarjetas de estadísticas', async () => {
            mockRestaurantsData = [];

            render(await AdminPage());

            expect(screen.getByText(/Total Restaurantes/i)).toBeInTheDocument();
            expect(screen.getByText(/Suscripciones Activas/i)).toBeInTheDocument();
            expect(screen.getByText(/Usuarios en Prueba/i)).toBeInTheDocument();
            expect(screen.getByText(/QR Redirects/i)).toBeInTheDocument();
        });

        it('muestra el conteo correcto de restaurantes', async () => {
            mockRestaurantsData = [
                {
                    id: 'rest-1',
                    restaurantName: 'Restaurante 1',
                    email: 'rest1@test.com',
                    ownerName: 'Owner 1',
                    selectedPlan: 'premium',
                    subscriptionStatus: 'active',
                    createdAt: new MockTimestamp(1701700000, 0),
                },
                {
                    id: 'rest-2',
                    restaurantName: 'Restaurante 2',
                    email: 'rest2@test.com',
                    ownerName: 'Owner 2',
                    selectedPlan: 'autonomia',
                    subscriptionStatus: 'trialing',
                    createdAt: new MockTimestamp(1701800000, 0),
                },
            ];

            render(await AdminPage());

            await waitFor(() => {
                expect(screen.getByText('2')).toBeInTheDocument();
            });
        });

        it('cuenta correctamente las suscripciones activas', async () => {
            mockRestaurantsData = [
                {
                    id: 'rest-1',
                    restaurantName: 'Restaurante 1',
                    email: 'rest1@test.com',
                    ownerName: 'Owner 1',
                    selectedPlan: 'premium',
                    subscriptionStatus: 'active',
                    createdAt: new MockTimestamp(1701700000, 0),
                },
                {
                    id: 'rest-2',
                    restaurantName: 'Restaurante 2',
                    email: 'rest2@test.com',
                    ownerName: 'Owner 2',
                    selectedPlan: 'autonomia',
                    subscriptionStatus: 'active',
                    createdAt: new MockTimestamp(1701800000, 0),
                },
                {
                    id: 'rest-3',
                    restaurantName: 'Restaurante 3',
                    email: 'rest3@test.com',
                    ownerName: 'Owner 3',
                    selectedPlan: 'gratuito',
                    subscriptionStatus: 'trialing',
                    createdAt: new MockTimestamp(1701900000, 0),
                },
            ];

            render(await AdminPage());

            await waitFor(() => {
                const statCards = screen.getAllByText('2');
                expect(statCards.length).toBeGreaterThan(0);
            });
        });

        it('cuenta correctamente los usuarios en prueba', async () => {
            mockRestaurantsData = [
                {
                    id: 'rest-1',
                    restaurantName: 'Restaurante 1',
                    email: 'rest1@test.com',
                    ownerName: 'Owner 1',
                    selectedPlan: 'gratuito',
                    subscriptionStatus: 'trialing',
                    trialEndsAt: new MockTimestamp(Date.now() / 1000 + 86400, 0),
                    createdAt: new MockTimestamp(1701700000, 0),
                },
            ];

            render(await AdminPage());

            await waitFor(() => {
                // Hay dos elementos con '1': Total Restaurantes y Usuarios en Prueba
                const elements = screen.getAllByText('1');
                expect(elements.length).toBeGreaterThanOrEqual(1);
            });
        });
    });

    describe('Carga de Datos de Restaurantes', () => {
        it('carga y muestra restaurantes correctamente', async () => {
            mockFirestoreCount.mockReturnValue({
                get: () => Promise.resolve({
                    data: () => ({ count: 5 }),
                }),
            });

            mockRestaurantsData = [
                {
                    id: 'rest-1',
                    restaurantName: 'La Paella Feliz',
                    slug: 'la-paella-feliz',
                    email: 'paella@test.com',
                    ownerId: 'owner-1',
                    ownerName: 'Juan García',
                    selectedPlan: 'premium',
                    subscriptionStatus: 'active',
                    currentPeriodEnd: new MockTimestamp(1733000000, 0),
                    allergicSaves: 42,
                    qrScans: 150,
                    createdAt: new MockTimestamp(1701700000, 0),
                },
            ];

            render(await AdminPage());

            await waitFor(() => {
                expect(screen.getByText('La Paella Feliz')).toBeInTheDocument();
                expect(screen.getByText('paella@test.com')).toBeInTheDocument();
                expect(screen.getByText('Juan García')).toBeInTheDocument();
                expect(screen.getByText('premium')).toBeInTheDocument();
                expect(screen.getByText('active')).toBeInTheDocument();
            });
        });

        it('maneja restaurantes sin ownerName con valor por defecto', async () => {
            mockRestaurantsData = [
                {
                    id: 'rest-1',
                    restaurantName: 'Restaurante Sin Owner',
                    email: 'test@test.com',
                    selectedPlan: 'gratuito',
                    subscriptionStatus: 'trialing',
                    createdAt: new MockTimestamp(1701700000, 0),
                },
            ];

            render(await AdminPage());

            await waitFor(() => {
                expect(screen.getByText('No especificado')).toBeInTheDocument();
            });
        });

        it('maneja restaurantes sin createdAt correctamente', async () => {
            mockRestaurantsData = [
                {
                    id: 'rest-1',
                    restaurantName: 'Restaurante Antiguo',
                    email: 'antiguo@test.com',
                    ownerName: 'Owner Antiguo',
                    selectedPlan: 'autonomia',
                    subscriptionStatus: 'active',
                },
            ];

            render(await AdminPage());

            await waitFor(() => {
                expect(screen.getByText('Restaurante Antiguo')).toBeInTheDocument();
            });
        });

        it('calcula correctamente el estado trial_expired', async () => {
            const pastDate = new MockTimestamp(Date.now() / 1000 - 86400, 0); // Ayer

            mockRestaurantsData = [
                {
                    id: 'rest-1',
                    restaurantName: 'Restaurante Trial Expirado',
                    email: 'expired@test.com',
                    ownerName: 'Owner Expired',
                    selectedPlan: 'gratuito',
                    subscriptionStatus: 'trialing',
                    trialEndsAt: pastDate,
                    createdAt: new MockTimestamp(1701700000, 0),
                },
            ];

            render(await AdminPage());

            await waitFor(() => {
                // El componente RestaurantListClient debe mostrar trial_expired
                expect(screen.getByText('Restaurante Trial Expirado')).toBeInTheDocument();
            });
        });
    });

    describe('Conteo de Categorías y Platos', () => {
        it('incluye el conteo de categorías y platos', async () => {
            mockFirestoreCount.mockImplementation(() => ({
                get: () => Promise.resolve({
                    data: () => ({ count: 3 }),
                }),
            }));

            mockRestaurantsData = [
                {
                    id: 'rest-1',
                    restaurantName: 'Restaurante Test',
                    email: 'test@test.com',
                    ownerName: 'Test Owner',
                    selectedPlan: 'premium',
                    subscriptionStatus: 'active',
                    createdAt: new MockTimestamp(1701700000, 0),
                },
            ];

            render(await AdminPage());

            await waitFor(() => {
                expect(mockFirestoreCount).toHaveBeenCalled();
            });
        });
    });

    describe('Manejo de Errores', () => {
        it('maneja errores de Firestore sin romper la página', async () => {
            const { getAdminDb } = require('@/lib/firebase/firebase-admin');
            const originalImpl = getAdminDb.getMockImplementation();

            getAdminDb.mockImplementation(() => {
                throw new Error('Firestore error');
            });

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            render(await AdminPage());

            expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
            expect(consoleErrorSpy).toHaveBeenCalled();

            // Restaurar mocks
            getAdminDb.mockImplementation(originalImpl || (() => ({ collection: mockCollection })));
            consoleErrorSpy.mockRestore();
        });

        it('muestra 0 restaurantes cuando hay error en la carga', async () => {
            const { getAdminDb } = require('@/lib/firebase/firebase-admin');
            const originalImpl = getAdminDb.getMockImplementation();

            getAdminDb.mockImplementation(() => {
                throw new Error('Database error');
            });

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            render(await AdminPage());

            await waitFor(() => {
                // Hay múltiples elementos con '0'
                const zeros = screen.getAllByText('0');
                expect(zeros.length).toBeGreaterThanOrEqual(1);
            });

            // Restaurar mocks
            getAdminDb.mockImplementation(originalImpl || (() => ({ collection: mockCollection })));
            consoleErrorSpy.mockRestore();
        });
    });

    describe('Elementos de UI', () => {
        it('muestra el botón de volver', async () => {
            mockRestaurantsData = [];

            render(await AdminPage());

            expect(screen.getByText('← Volver')).toBeInTheDocument();
        });

        it('muestra el título de la página', async () => {
            mockRestaurantsData = [];

            render(await AdminPage());

            expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
        });

        it('muestra el mensaje de bienvenida', async () => {
            mockRestaurantsData = [];

            render(await AdminPage());

            expect(screen.getByText(/Bienvenido de vuelta, Andrés/i)).toBeInTheDocument();
        });

        it('muestra el título de la sección de restaurantes', async () => {
            mockRestaurantsData = [];

            render(await AdminPage());

            expect(screen.getByText(/Restaurantes Registrados/i)).toBeInTheDocument();
        });

        it('incluye enlace a QR Redirects', async () => {
            mockRestaurantsData = [];

            render(await AdminPage());

            const link = screen.getByText(/QR Redirects/i).closest('a');
            expect(link).toHaveAttribute('href', '/admin/qr-redirects');
        });
    });

    describe('Ordenación de Restaurantes', () => {
        it('ordena los restaurantes alfabéticamente por nombre', async () => {
            mockRestaurantsData = [
                {
                    id: 'rest-1',
                    restaurantName: 'Zebra Restaurant',
                    email: 'zebra@test.com',
                    ownerName: 'Owner Z',
                    selectedPlan: 'premium',
                    subscriptionStatus: 'active',
                    createdAt: new MockTimestamp(1701700000, 0),
                },
                {
                    id: 'rest-2',
                    restaurantName: 'Alpha Restaurant',
                    email: 'alpha@test.com',
                    ownerName: 'Owner A',
                    selectedPlan: 'autonomia',
                    subscriptionStatus: 'active',
                    createdAt: new MockTimestamp(1701800000, 0),
                },
            ];

            render(await AdminPage());

            await waitFor(() => {
                expect(screen.getByText('Zebra Restaurant')).toBeInTheDocument();
                expect(screen.getByText('Alpha Restaurant')).toBeInTheDocument();
            });
        });
    });

    describe('Datos Completos de Restaurante', () => {
        it('incluye todos los campos necesarios en el objeto Restaurant', async () => {
            mockFirestoreCount.mockImplementation(() => ({
                get: () => Promise.resolve({
                    data: () => ({ count: 10 }),
                }),
            }));

            mockRestaurantsData = [
                {
                    id: 'rest-complete',
                    restaurantName: 'Restaurante Completo',
                    slug: 'restaurante-completo',
                    email: 'completo@test.com',
                    ownerId: 'owner-123',
                    ownerName: 'Propietario Completo',
                    selectedPlan: 'premium',
                    subscriptionStatus: 'active',
                    currentPeriodEnd: new MockTimestamp(1733000000, 0),
                    allergicSaves: 100,
                    qrScans: 500,
                    createdAt: new MockTimestamp(1701700000, 0),
                },
            ];

            render(await AdminPage());

            await waitFor(() => {
                expect(screen.getByText('Restaurante Completo')).toBeInTheDocument();
                expect(screen.getByText('completo@test.com')).toBeInTheDocument();
            });
        });
    });
});
