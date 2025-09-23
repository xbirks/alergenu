import { Egg, Fish, Milk, Nut, Wheat } from 'lucide-react';
import type { Allergen } from '@/lib/types';

const iconMap: Record<string, React.ReactNode> = {
  celery: <span title="Celery">🌿</span>,
  gluten: <Wheat className="size-4" title="Gluten" />,
  crustaceans: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      title="Crustaceans"
    >
      <path d="M7.5 16c-2.5 0-2.5-4-5-4" />
      <path d="M15 20c-4 0-4-4-4-4" />
      <path d="M2.5 12c4.5 0 4.5-4 9-4" />
      <path d="M13 8c2.5 0 2.5-4 5-4" />
      <path d="M11 12c-2.5 0-2.5-4-5-4" />
      <path d="M19 16c1.5 0 3-1 3-3" />
      <path d="M22 13c0-1.5-1.5-3-3-3" />
      <path d="M2.5 12a13.3 13.3 0 0 0 9 9" />
      <path d="M22 8c-2 0-2-2-4-2" />
      <path d="M18 6c-2.5 0-2.5-4-5-4" />
      <circle cx="10" cy="10" r="1" />
    </svg>
  ),
  eggs: <Egg className="size-4" title="Eggs" />,
  fish: <Fish className="size-4" title="Fish" />,
  lupin: <span title="Lupin">🌼</span>,
  milk: <Milk className="size-4" title="Milk" />,
  molluscs: <span title="Molluscs">🐚</span>,
  mustard: <span title="Mustard" className="font-bold text-xs">M</span>,
  peanuts: <Nut className="size-4" title="Peanuts" />,
  sesame: <span title="Sesame" className="font-bold text-xs">S</span>,
  soybeans: <span title="Soybeans">🌱</span>,
  sulphites: <span title="Sulphites" className="font-bold text-xs">SO₂</span>,
  'tree-nuts': <Nut className="size-4" title="Tree Nuts" />,
};

export function AllergenIcon({ allergenId }: { allergenId: Allergen['id'] }) {
  return iconMap[allergenId] || null;
}
