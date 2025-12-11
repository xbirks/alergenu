'use client';

import { useState, useEffect } from 'react';

export type CookiePreferences = {
    necessary: boolean; // Always true, can't be disabled
    analytics: boolean;
    marketing: boolean;
};

const COOKIE_CONSENT_KEY = 'alergenu_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'alergenu_cookie_preferences';

export function useCookieConsent() {
    const [hasConsent, setHasConsent] = useState<boolean | null>(null);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
        marketing: false,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load consent from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
            const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

            if (consent === 'true' && savedPreferences) {
                try {
                    const parsed = JSON.parse(savedPreferences);
                    setPreferences(parsed);
                    setHasConsent(true);
                } catch (e) {
                    console.error('Error parsing cookie preferences:', e);
                    setHasConsent(false);
                }
            } else {
                setHasConsent(false);
            }

            setIsLoading(false);
        }
    }, []);

    const acceptAll = () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
        };

        savePreferences(allAccepted);
    };

    const acceptNecessaryOnly = () => {
        const necessaryOnly: CookiePreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
        };

        savePreferences(necessaryOnly);
    };

    const acceptCustom = (customPreferences: CookiePreferences) => {
        // Ensure necessary is always true
        const validPreferences = {
            ...customPreferences,
            necessary: true,
        };

        savePreferences(validPreferences);
    };

    const savePreferences = (prefs: CookiePreferences) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
            localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
            setPreferences(prefs);
            setHasConsent(true);

            // Reload page to apply analytics if enabled
            if (prefs.analytics) {
                window.location.reload();
            }
        }
    };

    const resetConsent = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(COOKIE_CONSENT_KEY);
            localStorage.removeItem(COOKIE_PREFERENCES_KEY);
            setHasConsent(false);
            setPreferences({
                necessary: true,
                analytics: false,
                marketing: false,
            });
        }
    };

    return {
        hasConsent,
        preferences,
        isLoading,
        acceptAll,
        acceptNecessaryOnly,
        acceptCustom,
        resetConsent,
    };
}
