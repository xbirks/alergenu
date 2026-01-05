'use client';

import { useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/firebase';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface GoogleSignInButtonProps {
    onSuccess?: (user: any) => void | Promise<void>;
    onError?: (error: any) => void;
    disabled?: boolean;
    text?: string;
}


// Detectar si estamos en un navegador que tiene problemas con popups
export function shouldUseRedirect(): boolean {
    if (typeof window === 'undefined') return false;

    const userAgent = window.navigator.userAgent.toLowerCase();

    // Opera, Safari en iOS, o navegadores en modo standalone (PWA)
    const isOpera = userAgent.includes('opr/') || userAgent.includes('opera');
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = (window.navigator as any).standalone === true;

    return isOpera || isIOS || isStandalone;
}


export function GoogleSignInButton({
    onSuccess,
    onError,
    disabled = false,
    text = 'Continuar con Google'
}: GoogleSignInButtonProps) {
    const [loading, setLoading] = useState(false);
    const useRedirect = shouldUseRedirect();

    // Manejar el resultado del redirect cuando el usuario vuelve
    useEffect(() => {
        if (!useRedirect) return;

        const handleRedirectResult = async () => {
            try {
                setLoading(true);
                const result = await getRedirectResult(auth);

                if (result && result.user) {
                    if (onSuccess) {
                        await onSuccess(result.user);
                    }
                }
            } catch (error: any) {
                console.error('Google Sign-In Redirect Error:', error);
                handleAuthError(error);
            } finally {
                setLoading(false);
            }
        };

        handleRedirectResult();
    }, [useRedirect, onSuccess]);

    const handleAuthError = (error: any) => {
        let errorMessage = 'Error al iniciar sesión con Google.';

        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Has cerrado la ventana de inicio de sesión.';
        } else if (error.code === 'auth/cancelled-popup-request') {
            errorMessage = 'Solicitud de inicio de sesión cancelada.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'El navegador ha bloqueado la ventana emergente. Por favor, permite las ventanas emergentes para este sitio.';
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'Ya tienes una cuenta con este email usando contraseña. Por favor, inicia sesión con tu contraseña o usa la opción "¿Olvidaste tu contraseña?".';
        }

        if (onError) {
            onError({ message: errorMessage, code: error.code });
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            if (useRedirect) {
                // Para navegadores problemáticos, usar redirect
                await signInWithRedirect(auth, googleProvider);
                // El loading se mantendrá hasta que vuelva de la redirección
            } else {
                // Para navegadores normales, usar popup
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;

                if (onSuccess) {
                    await onSuccess(user);
                }
                setLoading(false);
            }
        } catch (error: any) {
            console.error('Google Sign-In Error:', error);
            handleAuthError(error);
            setLoading(false);
        }
    };

    return (
        <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={disabled || loading}
            variant="outline"
            size="lg"
            className="w-full rounded-full h-14 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Conectando...
                </>
            ) : (
                <>
                    <svg className="mr-3 h-6 w-6" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    {text}
                </>
            )}
        </Button>
    );
}
