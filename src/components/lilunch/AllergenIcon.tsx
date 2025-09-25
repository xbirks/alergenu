'use client';

import { AllergenIcon as BaseAllergenIcon } from '@/components/icons/allergens';

/**
 * @deprecated Use AllergenIcon from @/components/icons/allergens instead
 */
export const StaticAllergenIcon = ({ id, className }: { id: string; className?: string }) => {
  return <BaseAllergenIcon allergenId={id} className={className} />;
};
