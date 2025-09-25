'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CategoryTabsProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

export function CategoryTabs({ categories, onSelectCategory }: CategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const handleSelect = (category: string) => {
    setActiveCategory(category);
    onSelectCategory(category);
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-0 bg-white z-10 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex gap-2 p-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            className="rounded-full font-bold transition-all duration-200"
            onClick={() => handleSelect(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
