'use client';

import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  lang: string;
  onLangChange: (newLang: 'es' | 'en') => void;
  theme: 'light' | 'dark';
}

/**
 * Componente de cambio de idioma controlado y con soporte para temas.
 */
export function LanguageSwitcher({ lang, onLangChange, theme }: LanguageSwitcherProps) {
  const baseClasses = "rounded-full h-8 w-auto px-3 text-sm";

  // Clases específicas para el tema claro
  const lightTheme = {
    container: "border bg-gray-50",
    active: "secondary",
    inactive: "ghost",
  };

  // Clases específicas para el tema oscuro
  const darkTheme = {
    container: "border border-white/20 bg-transparent",
    active: "secondary", // El color de fondo de secondary se adapta bien
    inactive: "ghost",
  };

  const styles = theme === 'light' ? lightTheme : darkTheme;

  return (
    <div className={`flex items-center gap-1 rounded-full p-1 ${styles.container}`}>
      <Button
        variant={lang === 'es' ? styles.active : styles.inactive}
        size="sm"
        className={baseClasses}
        onClick={() => onLangChange('es')}
      >
        ES
      </Button>
      <Button
        variant={lang === 'en' ? styles.active : styles.inactive}
        size="sm"
        className={baseClasses}
        onClick={() => onLangChange('en')}
      >
        EN
      </Button>
    </div>
  );
}
