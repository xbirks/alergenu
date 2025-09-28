'use client';

import { AllergenIcon } from '@/components/icons/allergens';
import { ALLERGENS } from '@/lib/allergens';

interface AllergenIconDisplayProps {
  allergenId: string;
  type: 'contains' | 'traces';
  className?: string;
  isHighlighted?: boolean;
}

// Helper function to add alpha to a hex color
const addAlpha = (color: string, opacity: number) => {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

export const AllergenIconDisplay = ({ allergenId, type, className, isHighlighted = false }: AllergenIconDisplayProps) => {
  const allergen = ALLERGENS.find(a => a.id === allergenId);

  if (!allergen) return null;

  const baseClasses = 'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200';
  
  // Define styles based on allergen type and state
  const styles = {
    contains: {
      backgroundColor: allergen.color,
      color: 'white'
    },
    traces: {
      backgroundColor: addAlpha(allergen.color, 0.15),
      border: `2px dashed ${allergen.color}`,
      color: allergen.color
    },
    highlighted: {
      backgroundColor: '#ef4444', // Red-500
      color: 'white',
      transform: 'scale(1.05)',
      border: '2px solid #ef4444'
    },
  };

  // Determine which style to apply
  let styleToApply;
  if (isHighlighted) {
    styleToApply = styles.highlighted;
  } else {
    styleToApply = styles[type];
  }

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={styleToApply}
      title={`${allergen.name}${type === 'traces' ? ' (Trazas)' : ''}`}
    >
      <AllergenIcon 
        allergenId={allergenId} 
        className="w-4 h-4" 
      />
    </div>
  );
};
