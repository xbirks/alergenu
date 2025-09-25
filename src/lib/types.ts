export interface Allergen {
  id: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  allergens?: string[];
  createdAt: any; // O un tipo más específico de Firebase Timestamp
}

export interface Restaurant {
  restaurantName: string;
  ownerName: string;
}
