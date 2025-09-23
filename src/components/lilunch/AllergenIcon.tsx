import { Egg, Fish, Leaf, Milk, Nut, Wheat, Soup, Shell, Salad, Bot, Snowflake, Grape, Bean } from 'lucide-react';
import type { Allergen } from '@/lib/types';

const iconMap: Record<string, React.ReactNode> = {
  celery: <Leaf className="size-4" title="Apio" />,
  gluten: <Wheat className="size-4" title="Gluten" />,
  crustaceans: <Shell className="size-4" title="Crustáceos" />,
  eggs: <Egg className="size-4" title="Huevos" />,
  fish: <Fish className="size-4" title="Pescado" />,
  lupin: <Salad className="size-4" title="Altramuces" />,
  milk: <Milk className="size-4" title="Leche" />,
  molluscs: <Soup className="size-4" title="Moluscos" />,
  mustard: <Bot className="size-4" title="Mostaza" />,
  peanuts: <Nut className="size-4" title="Cacahuetes" />,
  sesame: <Snowflake className="size-4" title="Sésamo" />,
  soybeans: <Bean className="size-4" title="Soja" />,
  sulphites: <Grape className="size-4" title="Sulfitos" />,
  'tree-nuts': <Nut className="size-4" title="Frutos de cáscara" />,
};

export function AllergenIcon({ allergenId }: { allergenId: Allergen['id'] }) {
  return iconMap[allergenId] || null;
}
