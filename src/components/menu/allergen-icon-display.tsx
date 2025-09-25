'use client';

import { AllergenIcon } from '@/components/icons/allergens';
import { ALLERGENS } from '@/lib/allergens';

interface AllergenIconDisplayProps {
  allergenId: string;
  type: 'contains' | 'traces';
  className?: string;
  isHighlighted?: boolean;
}

export const AllergenIconDisplay = ({ allergenId, type, className, isHighlighted = false }: AllergenIconDisplayProps) => {
  const allergen = ALLERGENS.find(a => a.id === allergenId);

  if (!allergen) return null;

  const baseClasses = 'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200';
  
  const styles = {
    contains: { backgroundColor: allergen.color, color: 'white' },
    traces: { borderColor: allergen.color, borderWidth: '2px', borderStyle: 'dashed' as const },
    highlighted: { backgroundColor: '#ef4444', color: 'white', transform: 'scale(1.05)' },
  };

  let styleToApply = styles[type];
  if (isHighlighted) {
    styleToApply = styles.highlighted;
  }

  const iconStyle = type === 'traces' && !isHighlighted ? { color: allergen.color } : { color: 'white' };

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={styleToApply}
      title={allergen.name}
    >
      <AllergenIcon allergenId={allergenId} className="w-4 h-4" style={iconStyle} />
    </div>
  );
};
