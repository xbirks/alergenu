import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { onAuthStateChanged, User } from 'firebase/auth';

// Mock Firebase Auth
jest.mock('@/lib/firebase/firebase', () => ({
    auth: {},
}));

jest.mock('firebase/auth', () => ({
    onAuthStateChanged: jest.fn(),
}));

describe('useAuth Hook', () => {
    const mockOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<typeof onAuthStateChanged>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('requireVerification = true (default)', () => {
        it('should return null user when email is not verified', async () => {
            const mockUser = {
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: false,
            } as User;

            mockOnAuthStateChanged.mockImplementation((auth, callback) => {
                callback(mockUser);
                return jest.fn();
            });

            const { result } = renderHook(() => useAuth());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.user).toBeNull();
        });

        it('should return user when email is verified', async () => {
            const mockUser = {
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: true,
            } as User;

            mockOnAuthStateChanged.mockImplementation((auth, callback) => {
                callback(mockUser);
                return jest.fn();
            });

            const { result } = renderHook(() => useAuth());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.user).toEqual(mockUser);
        });
    });

    describe('requireVerification = false', () => {
        it('should return user even when email is not verified', async () => {
            const mockUser = {
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: false,
            } as User;

            mockOnAuthStateChanged.mockImplementation((auth, callback) => {
                callback(mockUser);
                return jest.fn();
            });

            const { result } = renderHook(() => useAuth(false));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.user).toEqual(mockUser);
        });

        it('should return user when email is verified', async () => {
            const mockUser = {
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: true,
            } as User;

            mockOnAuthStateChanged.mockImplementation((auth, callback) => {
                callback(mockUser);
                return jest.fn();
            });

            const { result } = renderHook(() => useAuth(false));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.user).toEqual(mockUser);
        });
    });

    describe('Common behavior', () => {
        it('should start with loading state', () => {
            mockOnAuthStateChanged.mockImplementation(() => jest.fn());

            const { result } = renderHook(() => useAuth());

            expect(result.current.loading).toBe(true);
            expect(result.current.user).toBeNull();
        });

        it('should return null user when not authenticated', async () => {
            mockOnAuthStateChanged.mockImplementation((auth, callback) => {
                callback(null);
                return jest.fn();
            });

            const { result } = renderHook(() => useAuth(false));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.user).toBeNull();
        });

        it('should unsubscribe on unmount', () => {
            const unsubscribeMock = jest.fn();
            mockOnAuthStateChanged.mockImplementation(() => unsubscribeMock);

            const { unmount } = renderHook(() => useAuth());

            unmount();

            expect(unsubscribeMock).toHaveBeenCalled();
        });
    });
});
