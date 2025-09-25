export interface Allergen {
  id: string;
  name: string;
  color: string; // Hex color code (e.g., '#F97316')
}

export const ALLERGENS: Allergen[] = [
  { id: 'gluten', name: 'Gluten', color: '#CFA15A' },
  { id: 'crustaceos', name: 'Crustáceos', color: '#A23C3C' },
  { id: 'huevos', name: 'Huevos', color: '#D97706' },
  { id: 'pescado', name: 'Pescado', color: '#3A5E73' },
  { id: 'cacahuetes', name: 'Cacahuetes', color: '#7B4B2A' },
  { id: 'soja', name: 'Soja', color: '#6B7B4D' },
  { id: 'leche', name: 'Lácteos', color: '#3B82F6' },
  { id: 'frutos_de_cascara', name: 'Frutos de cáscara', color: '#AE9A86' },
  { id: 'apio', name: 'Apio', color: '#16A34A' },
  { id: 'mostaza', name: 'Mostaza', color: '#CBAA2D' },
  { id: 'sesamo', name: 'Sésamo', color: '#A16207' },
  { id: 'sulfitos', name: 'Sulfitos', color: '#7C2D3A' },
  { id: 'altramuces', name: 'Altramuces', color: '#B98E40' },
  { id: 'moluscos', name: 'Moluscos', color: '#047857' },
];

// Create a map for easy lookup
export const allergenMap = new Map<string, Allergen>(
  ALLERGENS.map(allergen => [allergen.id, allergen])
);
