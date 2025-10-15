'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language-switcher'; // Importamos el nuevo componente
import { useLocalStorage } from '@/hooks/use-local-storage'; // Importamos el hook

// Objeto con los textos para la traducción
const staticTexts = {
  welcomeTitle: { es: "Bienvenido", en: "Welcome" },
  welcomeDescription: { es: "¿Tienes alguna alergia o intolerancia alimentaria?", en: "Do you have any food allergies or intolerances?" },
  allergicButtonTitle: { es: "Sí, soy alérgico", en: "Yes, I have allergies" },
  allergicButtonDescription: { es: "Personalizaré el menú", en: "I will customize the menu" },
  notAllergicButtonTitle: { es: "No, todo en orden", en: "No, everything is fine" },
  notAllergicButtonDescription: { es: "Veré el menú completo", en: "I will see the full menu" },
};

export default function WelcomePage() {
  // Usamos el mismo hook y clave que en la página de la carta para leer el idioma
  const [lang] = useLocalStorage<string>('selectedLang', 'es');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Evitamos renderizar en el servidor para prevenir el parpadeo de contenido
  if (!hasMounted) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Posicionamos el selector de idioma en la esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md text-center shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">{staticTexts.welcomeTitle[lang]}</CardTitle>
          <CardDescription className="text-lg pt-2">
            {staticTexts.welcomeDescription[lang]}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 p-6">
          <Button variant="outline" size="lg" className="h-20 text-lg rounded-xl border-destructive/50 hover:bg-destructive/10" asChild>
            {/* El slug del restaurante debe ser dinámico en el futuro */}
            <Link href="/menu/r-restaurante-de-prueba?alergico=true">
              <ShieldAlert className="mr-3 size-7 text-destructive" />
              <div className="text-left">
                <p className="font-bold">{staticTexts.allergicButtonTitle[lang]}</p>
                <p className="text-sm font-normal text-muted-foreground">{staticTexts.allergicButtonDescription[lang]}</p>
              </div>
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-20 text-lg rounded-xl hover:bg-accent/50" asChild>
            <Link href="/menu/r-restaurante-de-prueba">
               <Shield className="mr-3 size-7 text-primary" />
               <div className="text-left">
                <p className="font-bold">{staticTexts.notAllergicButtonTitle[lang]}</p>
                <p className="text-sm font-normal text-muted-foreground">{staticTexts.notAllergicButtonDescription[lang]}</p>
              </div>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
