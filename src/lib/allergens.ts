import type { Allergen } from '@/lib/types';

export const ALLERGENS: Omit<Allergen, 'icon'>[] = [
    { id: 'gluten', name: 'Gluten' },
    { id: 'crustaceans', name: 'Crustáceos' },
    { id: 'eggs', name: 'Huevos' },
    { id: 'fish', name: 'Pescado' },
    { id: 'peanuts', name: 'Cacahuetes' },
    { id: 'soybeans', name: 'Soja' },
    { id: 'milk', name: 'Leche' },
    { id: 'tree-nuts', name: 'Frutos de cáscara' },
    { id: 'celery', name: 'Apio' },
    { id: 'mustard', name: 'Mostaza' },
    { id: 'sesame', name: 'Sésamo' },
    { id: 'sulphites', name: 'Sulfitos' },
    { id: 'lupin', name: 'Altramuces' },
    { id: 'molluscs', name: 'Moluscos' },
];

export const allergenMap = new Map(ALLERGENS.map(a => [a.id, a]));
