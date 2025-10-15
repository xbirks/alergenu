export interface Allergen {
  id: string;
  name: string;
  iconUrl: string;
  isCustom?: boolean;
}

export interface Category {
  id: string;
  name: string;
  name_en?: string;
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  allergens: string[];
  traces: string[];
  isAvailable: boolean;
  createdAt?: any; // Firebase Timestamp
}

export interface Restaurant {
  restaurantName: string;
  ownerName: string;
  slug: string;
  qrScans?: number;
}
