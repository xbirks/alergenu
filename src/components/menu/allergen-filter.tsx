'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ALLERGENS } from '@/lib/allergens';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AllergenIcon } from '@/components/icons/allergens';
import { db } from '@/lib/firebase/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

interface AllergenFilterProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onFilterChange: (selectedAllergens: string[]) => void;
  restaurantUid: string;
}

export function AllergenFilter({ isOpen, onOpenChange, onFilterChange, restaurantUid }: AllergenFilterProps) {
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

  const handleDone = async () => {
    const sessionStorageKey = `allergySave_${restaurantUid}`;

    if (selectedAllergens.length > 0 && !sessionStorage.getItem(sessionStorageKey)) {
        const restaurantDocRef = doc(db, 'restaurants', restaurantUid);
        try {
            await updateDoc(restaurantDocRef, { allergicSaves: increment(1) });
            sessionStorage.setItem(sessionStorageKey, 'true');
        } catch (error) {
            console.error("Failed to increment allergicSaves count: ", error);
        }
    }

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
