/**
 * Cookie Consent Utilities
 * Funciones de utilidad para gestionar el consentimiento de cookies
 */

export const CookieConsentUtils = {
    /**
     * Verifica si el usuario ha dado consentimiento
     */
    hasConsent: (): boolean => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('alergenu_cookie_consent') === 'true';
    },

    /**
     * Obtiene las preferencias de cookies del usuario
     */
    getPreferences: () => {
        if (typeof window === 'undefined') return null;
        try {
            const prefs = localStorage.getItem('alergenu_cookie_preferences');
            return prefs ? JSON.parse(prefs) : null;
        } catch (e) {
            console.error('Error parsing cookie preferences:', e);
            return null;
        }
    },

    /**
     * Resetea el consentimiento de cookies (útil para testing)
     */
    resetConsent: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('alergenu_cookie_consent');
        localStorage.removeItem('alergenu_cookie_preferences');
        console.log('✅ Cookie consent reset. Reload the page to see the banner again.');
    },

    /**
     * Verifica si las cookies analíticas están activas
     */
    canLoadAnalytics: (): boolean => {
        const prefs = CookieConsentUtils.getPreferences();
        return prefs?.analytics === true;
    },

    /**
     * Verifica si las cookies de marketing están activas
     */
    canLoadMarketing: (): boolean => {
        const prefs = CookieConsentUtils.getPreferences();
        return prefs?.marketing === true;
    },
};

// Exponer en window para debugging (solo en desarrollo)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).cookieConsent = CookieConsentUtils;
    console.log('🍪 Cookie utilities available at window.cookieConsent');
    console.log('   - cookieConsent.resetConsent() - Reset consent to show banner again');
    console.log('   - cookieConsent.getPreferences() - View current preferences');
}
