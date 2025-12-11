'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCookieConsent, type CookiePreferences } from '@/lib/hooks/useCookieConsent';

export function CookieBanner() {
    const { hasConsent, preferences, acceptAll, acceptNecessaryOnly, acceptCustom, isLoading } = useCookieConsent();
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [customPrefs, setCustomPrefs] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
        marketing: false,
    });

    // Show banner after 3 seconds if no consent
    useEffect(() => {
        if (!isLoading && hasConsent === false) {
            const timer = setTimeout(() => {
                setShowBanner(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isLoading, hasConsent]);

    // Don't render anything while loading or if consent is already given
    if (isLoading || hasConsent === true) {
        return null;
    }

    const handleAcceptAll = () => {
        acceptAll();
        setShowBanner(false);
    };

    const handleAcceptNecessary = () => {
        acceptNecessaryOnly();
        setShowBanner(false);
    };

    const handleSaveCustom = () => {
        acceptCustom(customPrefs);
        setShowBanner(false);
        setShowSettings(false);
    };

    return (
        <>
            {/* Overlay for settings modal */}
            {showSettings && (
                <div
                    className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
                    onClick={() => setShowSettings(false)}
                />
            )}

            {/* Cookie Banner */}
            <div
                className={`fixed bottom-6 right-6 max-w-md w-[calc(100vw-3rem)] z-[9999] transition-all duration-500 ease-out ${showBanner ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
                    }`}
            >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Main Banner Content */}
                    {!showSettings ? (
                        <div className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                                        🍪 Uso de Cookies
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        Utilizamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar contenido. Puedes elegir qué cookies aceptar.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleAcceptAll}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
                                >
                                    Aceptar todas
                                </button>
                                <button
                                    onClick={handleAcceptNecessary}
                                    className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2.5 px-4 rounded-md transition-colors"
                                >
                                    Solo necesarias
                                </button>
                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium py-2 transition-colors"
                                >
                                    Configurar preferencias
                                </button>
                            </div>

                            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                                Consulta nuestra{' '}
                                <Link href="/legal/cookies" className="underline hover:text-primary">
                                    Política de Cookies
                                </Link>
                            </p>
                        </div>
                    ) : (
                        /* Settings Panel */
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                    Configurar Cookies
                                </h3>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                {/* Necessary Cookies */}
                                <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                                                Cookies Necesarias
                                            </h4>
                                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                                                Siempre activas
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Esenciales para el funcionamiento del sitio (autenticación, seguridad).
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 w-11 h-6 bg-primary rounded-full opacity-50 cursor-not-allowed">
                                        <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-5 mt-0.5" />
                                    </div>
                                </div>

                                {/* Analytics Cookies */}
                                <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                                            Cookies Analíticas
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Ayudan a entender cómo los visitantes usan el sitio (Google Analytics).
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setCustomPrefs({ ...customPrefs, analytics: !customPrefs.analytics })}
                                        className={`flex-shrink-0 w-11 h-6 rounded-full transition-colors ${customPrefs.analytics ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    >
                                        <div
                                            className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${customPrefs.analytics ? 'translate-x-5' : 'translate-x-0.5'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Marketing Cookies */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                                            Cookies de Marketing
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Utilizadas para mostrar anuncios relevantes y campañas publicitarias.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setCustomPrefs({ ...customPrefs, marketing: !customPrefs.marketing })}
                                        className={`flex-shrink-0 w-11 h-6 rounded-full transition-colors ${customPrefs.marketing ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    >
                                        <div
                                            className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${customPrefs.marketing ? 'translate-x-5' : 'translate-x-0.5'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveCustom}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
                                >
                                    Guardar preferencias
                                </button>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
