import type { Allergen } from '@/lib/types';
import { AllergenIcon } from '@/components/lilunch/AllergenIcon';

export const ALLERGENS: Allergen[] = [
    { id: 'gluten', name: 'Gluten', icon: AllergenIcon({ allergenId: 'gluten' }) },
    { id: 'crustaceans', name: 'Crustáceos', icon: AllergenIcon({ allergenId: 'crustaceans' }) },
    { id: 'eggs', name: 'Huevos', icon: AllergenIcon({ allergenId: 'eggs' }) },
    { id: 'fish', name: 'Pescado', icon: AllergenIcon({ allergenId: 'fish' }) },
    { id: 'peanuts', name: 'Cacahuetes', icon: AllergenIcon({ allergenId: 'peanuts' }) },
    { id: 'soybeans', name: 'Soja', icon: AllergenIcon({ allergenId: 'soybeans' }) },
    { id: 'milk', name: 'Leche', icon: AllergenIcon({ allergenId: 'milk' }) },
    { id: 'tree-nuts', name: 'Frutos de cáscara', icon: AllergenIcon({ allergenId: 'tree-nuts' }) },
    { id: 'celery', name: 'Apio', icon: AllergenIcon({ allergenId: 'celery' }) },
    { id: 'mustard', name: 'Mostaza', icon: AllergenIcon({ allergenId: 'mustard' }) },
    { id: 'sesame', name: 'Sésamo', icon: AllergenIcon({ allergenId: 'sesame' }) },
    { id: 'sulphites', name: 'Sulfitos', icon: AllergenIcon({ allergenId: 'sulphites' }) },
    { id: 'lupin', name: 'Altramuces', icon: AllergenIcon({ allergenId: 'lupin' }) },
    { id: 'molluscs', name: 'Moluscos', icon: AllergenIcon({ allergenId: 'molluscs' }) },
];

export const allergenMap = new Map(ALLERGENS.map(a => [a.id, a]));
