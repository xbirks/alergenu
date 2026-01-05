'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { ALLERGENS } from '@/lib/allergens';
import { AllergenSelector } from '@/components/lilunch/AllergenSelector';

type AllergenStatus = 'no' | 'traces' | 'yes';
export type AllergenRecord = Record<string, AllergenStatus>;

interface AllergenModalProps {
    isOpen: boolean;
    onClose: () => void;
    dishName: string;
    initialAllergens: AllergenRecord;
    onSave: (allergens: AllergenRecord) => void;
}

export default function AllergenModal({ isOpen, onClose, dishName, initialAllergens, onSave }: AllergenModalProps) {
    const [allergens, setAllergens] = useState<AllergenRecord>(initialAllergens);

    useEffect(() => {
        // Actualiza el estado interno si el plato cambia mientras el modal está abierto
        setAllergens(initialAllergens);
    }, [initialAllergens]);

    const handleSave = () => {
        onSave(allergens);
        onClose();
    };

    const handleAllergenChange = (allergenId: string, value: AllergenStatus) => {
        setAllergens(prev => ({ ...prev, [allergenId]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className='text-2xl'>Alérgenos en "{dishName}"</DialogTitle>
                    <DialogDescription>Indica la presencia de alérgenos en el plato seleccionando una de las tres opciones para cada uno.</DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-2 max-h-[50vh] overflow-y-auto pr-2 flex-1">
                    {ALLERGENS.map((allergen) => (
                        <div key={allergen.id} className="flex flex-row items-center justify-between border-b py-3">
                            <label className="font-semibold text-lg flex-1">{allergen.name}</label>
                            <AllergenSelector
                                value={allergens[allergen.id] || 'no'}
                                onChange={(value) => handleAllergenChange(allergen.id, value)}
                            />
                        </div>
                    ))}
                </div>

                <DialogFooter className="pb-safe">
                    <Button onClick={handleSave} className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-lg font-bold">Guardar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
