import type { Allergen } from '@/lib/types';
import { AllergenIcon } from '@/components/lilunch/AllergenIcon';

export const ALLERGENS: Allergen[] = [
  { id: 'celery', name: 'Celery', icon: AllergenIcon({ allergenId: 'celery' }) },
  { id: 'gluten', name: 'Gluten', icon: AllergenIcon({ allergenId: 'gluten' }) },
  { id: 'crustaceans', name: 'Crustaceans', icon: AllergenIcon({ allergenId: 'crustaceans' }) },
  { id: 'eggs', name: 'Eggs', icon: AllergenIcon({ allergenId: 'eggs' }) },
  { id: 'fish', name: 'Fish', icon: AllergenIcon({ allergenId: 'fish' }) },
  { id: 'lupin', name: 'Lupin', icon: AllergenIcon({ allergenId: 'lupin' }) },
  { id: 'milk', name: 'Milk', icon: AllergenIcon({ allergenId: 'milk' }) },
  { id: 'molluscs', name: 'Molluscs', icon: AllergenIcon({ allergenId: 'molluscs' }) },
  { id: 'mustard', name: 'Mustard', icon: AllergenIcon({ allergenId: 'mustard' }) },
  { id: 'peanuts', name: 'Peanuts', icon: AllergenIcon({ allergenId: 'peanuts' }) },
  { id: 'sesame', name: 'Sesame', icon: AllergenIcon({ allergenId: 'sesame' }) },
  { id: 'soybeans', name: 'Soybeans', icon: AllergenIcon({ allergenId: 'soybeans' }) },
  { id: 'sulphites', name: 'Sulphites', icon: AllergenIcon({ allergenId: 'sulphites' }) },
  { id: 'tree-nuts', name: 'Tree Nuts', icon: AllergenIcon({ allergenId: 'tree-nuts' }) },
];

export const allergenMap = new Map(ALLERGENS.map(a => [a.id, a]));
