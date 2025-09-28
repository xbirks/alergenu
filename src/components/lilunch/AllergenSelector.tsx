'use client';

import { cn } from '@/lib/utils';

type AllergenStatus = 'no' | 'traces' | 'yes';

interface AllergenSelectorProps {
  value: AllergenStatus;
  onChange: (value: AllergenStatus) => void;
}

const optionConfig: { [key in AllergenStatus]: { label: string; selectedClassName: string } } = {
  no: {
    label: 'No',
    selectedClassName: 'bg-red-500 text-white hover:bg-red-600',
  },
  traces: {
    label: 'Trazas',
    selectedClassName: 'bg-background text-foreground shadow-sm',
  },
  yes: {
    label: 'Sí',
    selectedClassName: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
};

export function AllergenSelector({ value, onChange }: AllergenSelectorProps) {
  const options: AllergenStatus[] = ['no', 'traces', 'yes'];

  return (
    <div className="inline-flex h-12 items-center justify-center rounded-lg bg-muted p-1 gap-1">
      {options.map((optionValue) => {
        const config = optionConfig[optionValue];
        return (
          <button
            key={optionValue}
            onClick={() => onChange(optionValue)}
            type="button"
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-base font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              value === optionValue
                ? config.selectedClassName
                : 'text-muted-foreground hover:bg-background/50'
            )}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
