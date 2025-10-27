'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface CategorySliderProps {
  orderedCategoryNames: string[];
  categoryTranslationMap: Map<string, any>;
  isDailyMenuVisible: boolean;
  lang: string;
  getTranslated: (i18nField: any, lang: string) => string;
  filteredGroupedMenu: { [categoryName: string]: any[] };
  generateSafeId: (name: string) => string;
}

const staticTexts = {
  dailyMenu: { es: 'Menú del Día', en: 'Daily Menu' },
};

export function CategorySlider({
  orderedCategoryNames,
  categoryTranslationMap,
  isDailyMenuVisible,
  lang,
  getTranslated,
  filteredGroupedMenu,
  generateSafeId,
}: CategorySliderProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const dailyMenuSectionId = 'daily-menu';

  const handleCategoryClick = (sectionId: string) => {
    setActiveCategory(sectionId);
    const chip = sliderRef.current?.querySelector(`[data-sectionid="${sectionId}"]`);
    chip?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  return (
    <div className="my-8">
      <div ref={sliderRef} className="flex space-x-3 overflow-x-auto py-2 no-scrollbar px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8">
        {isDailyMenuVisible && (
          <Link
            href={`#${dailyMenuSectionId}`}
            data-sectionid={dailyMenuSectionId}
            onClick={() => handleCategoryClick(dailyMenuSectionId)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-colors duration-200 no-underline ${
              activeCategory === dailyMenuSectionId
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getTranslated(staticTexts.dailyMenu, lang)}
          </Link>
        )}
        {orderedCategoryNames.map((categoryName) => {
          const sectionId = generateSafeId(categoryName);
          const translatedName = getTranslated(categoryTranslationMap.get(categoryName), lang) || categoryName;
          const hasItems = filteredGroupedMenu[categoryName] && filteredGroupedMenu[categoryName].length > 0;

          if (!sectionId || !hasItems) return null;
          
          return (
            <Link
              key={sectionId}
              href={`#${sectionId}`}
              data-sectionid={sectionId}
              onClick={() => handleCategoryClick(sectionId)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-colors duration-200 no-underline ${
                activeCategory === sectionId 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {translatedName}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
