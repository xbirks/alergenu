'use client';

import {
  Wheat,
  Shell,
  Egg,
  Fish,
  Nut,
  Leaf,
  Milk,
  Flame,
  Asterisk,
  FlaskConical,
  Sprout,
  Waves
} from 'lucide-react';

// Mapeo de IDs de alérgenos a componentes de iconos de lucide-react
export const ALLERGEN_ICONS: { [key: string]: React.ComponentType<{ className?: string }> } = {
  gluten: Wheat,
  crustaceos: Shell,
  huevos: Egg,
  pescado: Fish,
  cacahuetes: Nut,
  soja: Leaf,
  leche: Milk,
  frutos_de_cascara: Nut,
  apio: Leaf,
  mostaza: Flame,
  sesamo: Asterisk,
  sulfitos: FlaskConical,
  altramuces: Sprout,
  moluscos: Waves,
};

// Componente para renderizar un icono de alérgeno por su ID
export const AllergenIcon = ({ allergenId, className }: { allergenId: string; className?: string }) => {
  const IconComponent = ALLERGEN_ICONS[allergenId];

  if (!IconComponent) {
    return null; // O un icono por defecto si el ID no se encuentra
  }

  return <IconComponent className={className} />;
};
