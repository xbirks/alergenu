export interface I18nString {
  es: string;
  en?: string;
}

export interface Allergen {
  id: string;
  name: string;
  iconUrl: string;
  isCustom?: boolean;
}

export interface Category {
  id: string;
  name: string;
  name_i18n?: I18nString;
  order: number;
  startTime?: string;
  endTime?: string;
}

// The new structure for a menu item's extra/supplement
export interface MenuItemExtra {
  name_i18n: I18nString;
  price: number;
  allergens?: string[]; // Array of allergen IDs for the extra
}

export interface MenuItem {
  id: string;
  name: string;
  name_i18n?: I18nString;
  description?: string;
  description_i18n?: I18nString;
  price: number;
  category: string; 
  categoryId: string; 
  allergens: string[]; // Allergens for the main dish
  traces: string[];
  isAvailable: boolean;
  createdAt?: any; // Firebase Timestamp
  updatedAt?: any; // Firebase Timestamp
  order?: number;
  extras?: MenuItemExtra[]; // Use the new, structured type for extras
}

export interface Restaurant {
  restaurantName: string;
  ownerName: string;
  slug: string;
  qrScans?: number;
}
