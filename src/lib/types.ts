import type { LucideIcon } from 'lucide-react';

export interface Allergen {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  allergens: string[];
  traces: string[];
  imageId: string;
  lastUpdated: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface Restaurant {
  id: string;
  name: string;
  menu: MenuCategory[];
}
