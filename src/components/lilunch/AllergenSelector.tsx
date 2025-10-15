'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type AllergenStatus = 'no' | 'traces' | 'yes';

interface AllergenSelectorProps {
  value: AllergenStatus;
  onChange: (value: AllergenStatus) => void;
}

export function AllergenSelector({ value, onChange }: AllergenSelectorProps) {
  const options: { id: AllergenStatus; label: string }[] = [
    { id: 'no', label: 'NO' },
    { id: 'traces', label: 'TRAZAS' },
    { id: 'yes', label: 'SI' },
  ];

  return (
    <div className="flex items-center space-x-2">
      {options.map((option) => (
        <Button
          key={option.id}
          type="button"
          variant="ghost"
          onClick={() => onChange(option.id)}
          className={cn(
            'px-4 py-2 h-auto rounded-full text-sm font-semibold transition-colors',
            {
              'bg-red-500 text-white hover:bg-red-600': value === 'no' && option.id === 'no',
              'bg-yellow-500 text-white hover:bg-yellow-600': value === 'traces' && option.id === 'traces',
              'bg-blue-600 text-white hover:bg-blue-700': value === 'yes' && option.id === 'yes',
              'text-gray-500 hover:bg-gray-200': value !== option.id,
            }
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}