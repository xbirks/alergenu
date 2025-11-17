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

export interface MenuItem {
  id: string;
  name: string;
  name_i18n?: I18nString;
  description?: string;
  description_i18n?: I18nString;
  price: number;
  category: string; // This is the category name for display
  categoryId: string; // This is the category ID for filtering
  allergens: string[];
  traces: string[];
  isAvailable: boolean;
  createdAt?: any; // Firebase Timestamp
  updatedAt?: any; // Firebase Timestamp
  order?: number;
  extras?: any[];
}

export interface Restaurant {
  restaurantName: string;
  ownerName: string;
  slug: string;
  qrScans?: number;
}
