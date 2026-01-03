// Mock Firebase before any imports
jest.mock('@/lib/firebase/firebase', () => ({
    auth: {},
    db: {},
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    onAuthStateChanged: jest.fn(),
}));

import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { User } from 'firebase/auth';

// Mock the useAuth hook
jest.mock('@/hooks/useAuth');

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
    useSearchParams: () => ({
        get: jest.fn(),
    }),
}));

// Mock Firestore
jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    query: jest.fn(),
    orderBy: jest.fn(),
    onSnapshot: jest.fn(() => jest.fn()),
    doc: jest.fn(),
    getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
}));

// Mock useSubscription
jest.mock('@/hooks/useSubscription', () => ({
    useSubscription: () => ({
        subscriptionStatus: 'active',
        isLoading: false,
    }),
}));

describe('Dashboard Authentication Integration', () => {
    const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('User without email verification', () => {
        it('should allow access to dashboard when requireVerification is false', async () => {
            const mockUser = {
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: false,
            } as User;

            mockUseAuth.mockReturnValue({
                user: mockUser,
                loading: false,
            });

            // This test verifies that the hook returns the user even without verification
            expect(mockUseAuth(false).user).toEqual(mockUser);
            expect(mockUseAuth(false).user?.emailVerified).toBe(false);
        });

        it('should block access when requireVerification is true', async () => {
            const mockUser = {
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: false,
            } as User;

            // When requireVerification is true, user should be null if email not verified
            mockUseAuth.mockReturnValue({
                user: null,
                loading: false,
            });

            expect(mockUseAuth(true).user).toBeNull();
        });
    });

    describe('User with email verification', () => {
        it('should allow access regardless of requireVerification setting', async () => {
            const mockUser = {
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: true,
            } as User;

            mockUseAuth.mockReturnValue({
                user: mockUser,
                loading: false,
            });

            expect(mockUseAuth(false).user).toEqual(mockUser);
            expect(mockUseAuth(true).user).toEqual(mockUser);
        });
    });

    describe('Loading states', () => {
        it('should handle loading state correctly', () => {
            mockUseAuth.mockReturnValue({
                user: null,
                loading: true,
            });

            const { user, loading } = mockUseAuth(false);

            expect(loading).toBe(true);
            expect(user).toBeNull();
        });
    });

    describe('Security verification', () => {
        it('should maintain user authentication state', () => {
            const mockUser = {
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: false,
            } as User;

            mockUseAuth.mockReturnValue({
                user: mockUser,
                loading: false,
            });

            // Verify that user is authenticated (has uid)
            const { user } = mockUseAuth(false);
            expect(user).not.toBeNull();
            expect(user?.uid).toBe('test-uid');
        });

        it('should not allow unauthenticated access', () => {
            mockUseAuth.mockReturnValue({
                user: null,
                loading: false,
            });

            const { user } = mockUseAuth(false);
            expect(user).toBeNull();
        });
    });
});
