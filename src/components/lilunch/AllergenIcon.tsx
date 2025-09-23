import { Egg, Fish, Leaf, Milk, Nut, Wheat, Soup, Shell, Salad, Bot, Snowflake, Grape, Bean } from 'lucide-react';
import type { Allergen } from '@/lib/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  celery: <Leaf title="Apio" />,
  gluten: <Wheat title="Gluten" />,
  crustaceans: <Shell title="Crustáceos" />,
  eggs: <Egg title="Huevos" />,
  fish: <Fish title="Pescado" />,
  lupin: <Salad title="Altramuces" />,
  milk: <Milk title="Leche" />,
  molluscs: <Soup title="Moluscos" />,
  mustard: <Bot title="Mostaza" />,
  peanuts: <Nut title="Cacahuetes" />,
  sesame: <Snowflake title="Sésamo" />,
  soybeans: <Bean title="Soja" />,
  sulphites: <Grape title="Sulfitos" />,
  'tree-nuts': <Nut title="Frutos de cáscara" />,
};

interface AllergenIconProps {
    allergenId: Allergen['id'];
    className?: string;
    iconClassName?: string;
}

export function AllergenIcon({ allergenId, className, iconClassName }: AllergenIconProps) {
    const icon = iconMap[allergenId]

    if (!icon) return null;

    return (
        <div className={cn("flex items-center justify-center rounded-md p-1", className)}>
            {React.cloneElement(icon as React.ReactElement, { className: cn("size-4", iconClassName) })}
        </div>
    );
}
