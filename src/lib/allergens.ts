export interface Allergen {
  id: string;
  name: string;
  name_en: string;
  color: string; // Hex color code (e.g., '#F97316')
}

// This list is ordered based on EFSA recommendations and prevalence.
export const ALLERGENS: Allergen[] = [
  { id: 'gluten', name: 'Gluten', name_en: 'Gluten', color: '#CFA15A' },
  { id: 'leche', name: 'Lácteos', name_en: 'Dairy', color: '#3B82F6' },
  { id: 'huevos', name: 'Huevos', name_en: 'Eggs', color: '#D97706' },
  { id: 'frutos_de_cascara', name: 'Frutos de cáscara', name_en: 'Nuts', color: '#AE9A86' },
  { id: 'pescado', name: 'Pescado', name_en: 'Fish', color: '#3A5E73' },
  { id: 'crustaceos', name: 'Crustáceos', name_en: 'Crustaceans', color: '#A23C3C' },
  { id: 'soja', name: 'Soja', name_en: 'Soy', color: '#6B7B4D' },
  { id: 'cacahuetes', name: 'Cacahuetes', name_en: 'Peanuts', color: '#7B4B2A' },
  { id: 'mostaza', name: 'Mostaza', name_en: 'Mustard', color: '#CBAA2D' },
  { id: 'sesamo', name: 'Sésamo', name_en: 'Sesame', color: '#A16207' },
  { id: 'apio', name: 'Apio', name_en: 'Celery', color: '#16A34A' },
  { id: 'sulfitos', name: 'Sulfitos', name_en: 'Sulphites', color: '#7C2D3A' },
  { id: 'moluscos', name: 'Moluscos', name_en: 'Molluscs', color: '#047857' },
  { id: 'altramuces', name: 'Altramuces', name_en: 'Lupin', color: '#B98E40' },
];

// Create a map for easy lookup
export const allergenMap = new Map<string, Allergen>(
  ALLERGENS.map(allergen => [allergen.id, allergen])
);

// Function to get the allergen name based on the language
export function getAllergenName(allergenId: string, lang: string): string {
    const allergen = allergenMap.get(allergenId);
    if (!allergen) return allergenId; // Fallback to id if not found

    return lang === 'en' ? allergen.name_en : allergen.name;
}
