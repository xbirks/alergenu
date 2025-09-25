'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ALLERGENS, Allergen } from '@/lib/allergens';
import { Button } from '@/components/ui/button';

interface AllergySelectionScreenProps {
  initialSelectedAllergens: string[];
  onConfirm: (selected: string[]) => void;
  onClose: () => void;
}

export function AllergySelectionScreen({ 
    initialSelectedAllergens, 
    onConfirm, 
    onClose 
}: AllergySelectionScreenProps) {
    
  const [selected, setSelected] = useState<string[]>(initialSelectedAllergens);

  const toggleAllergen = (allergenId: string) => {
    setSelected(prev => 
      prev.includes(allergenId) 
        ? prev.filter(id => id !== allergenId) 
        : [...prev, allergenId]
    );
  };

  const selectedCount = selected.length;

  // Separamos los alérgenos en dos filas para un diseño más limpio
  const firstRowAllergens = ALLERGENS.slice(0, 7);
  const secondRowAllergens = ALLERGENS.slice(7);

  const renderAllergenButton = (allergen: Allergen) => {
    const isSelected = selected.includes(allergen.id);
    return (
      <button
        key={allergen.id}
        onClick={() => toggleAllergen(allergen.id)}
        className={cn(
          "flex items-center justify-center gap-2 text-sm font-semibold border rounded-full px-4 py-2 transition-all duration-200",
          isSelected 
            ? "bg-blue-500 text-white border-blue-500 shadow-md"
            : "bg-white text-gray-700 border-gray-300"
        )}
      >
        <img src={`/allergens/${allergen.icon}`} alt="" className={cn("h-5 w-5", isSelected && "invert brightness-0")} />
        {allergen.name}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col p-4 font-sans">
      {/* -- Header -- */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div> 
          <h2 className="font-bold">ALERGENU</h2>
        </div>
        <button onClick={onClose} className="p-2">
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </header>

      {/* -- Content -- */}
      <main className="flex-grow">
        <h1 className="text-2xl font-bold mb-2">Mis Alergias</h1>
        <p className="text-gray-600 mb-8">Selecciona los alérgenos a evitar. Resaltaremos lo que es seguro para ti.</p>

        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
                {firstRowAllergens.map(renderAllergenButton)}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
                {secondRowAllergens.map(renderAllergenButton)}
            </div>
        </div>
      </main>

      {/* -- Footer -- */}
      <footer className="mt-auto">
        <Button 
            className="w-full rounded-full bg-black text-white font-bold py-6 text-lg hover:bg-gray-800 shadow-lg"
            onClick={() => onConfirm(selected)}
        >
          Hecho {selectedCount > 0 && `(${selectedCount})`}
        </Button>
      </footer>
    </div>
  );
}
