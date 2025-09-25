'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ALLERGENS } from '@/lib/allergens';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AllergenIcon } from '@/components/icons/allergens';

interface AllergenFilterProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onFilterChange: (selectedAllergens: string[]) => void;
}

export function AllergenFilter({ isOpen, onOpenChange, onFilterChange }: AllergenFilterProps) {
  const [storedAllergens, setStoredAllergens] = useLocalStorage<string[]>('selectedAllergens', []);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(storedAllergens);

  useEffect(() => {
    setSelectedAllergens(storedAllergens);
  }, [storedAllergens]);

  const toggleAllergen = (allergenId: string) => {
    setSelectedAllergens(prev =>
      prev.includes(allergenId) ? prev.filter(id => id !== allergenId) : [...prev, allergenId]
    );
  };

  const handleDone = () => {
    setStoredAllergens(selectedAllergens);
    onFilterChange(selectedAllergens);
    onOpenChange(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedAllergens(storedAllergens);
    }
    onOpenChange(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full max-w-sm flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Mis Alergias</SheetTitle>
          <SheetDescription>
            Selecciona los alérgenos a evitar. Resaltaremos lo que es seguro para ti.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 flex-grow overflow-y-auto">
          <div className="flex flex-wrap gap-3">
            {ALLERGENS.map(allergen => {
              const isSelected = selectedAllergens.includes(allergen.id);
              return (
                <button
                  key={allergen.id}
                  onClick={() => toggleAllergen(allergen.id)}
                  style={isSelected ? { backgroundColor: allergen.color, color: 'white' } : {}}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-base transition-colors duration-200 ${ 
                    !isSelected && 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  <AllergenIcon allergenId={allergen.id} className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  {allergen.name}
                </button>
              )
            })}
          </div>
        </div>
        <SheetFooter>
          <Button onClick={handleDone} className="w-full text-lg py-6 h-auto">Hecho</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
