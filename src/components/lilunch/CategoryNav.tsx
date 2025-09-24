'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';

interface Category {
  id: string;
  name: string;
}

export function CategoryNav({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id || null);
  const [isSticky, setIsSticky] = useState(false);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const navRef = useRef<HTMLElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const navElement = navRef.current;
      if (navElement) {
        if (window.scrollY > navElement.offsetTop) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
      
      if (isScrolling.current) return;

      const headerHeight = 80;
      const stickyNavHeight = 60;
      const offset = headerHeight + stickyNavHeight + 20;

      let currentCategory = '';
      for (const category of categories) {
        const element = document.getElementById(category.id);
        if (element && element.offsetTop <= window.scrollY + offset) {
          currentCategory = category.id;
        }
      }
      
      if (currentCategory && activeCategory !== currentCategory) {
        setActiveCategory(currentCategory);
        const button = buttonRefs.current[currentCategory];
        button?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories, activeCategory]);

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      isScrolling.current = true;
      setActiveCategory(id);

      const headerHeight = 80;
      const stickyNavHeight = 60;
      const y = element.getBoundingClientRect().top + window.scrollY - headerHeight - stickyNavHeight;
      
      window.scrollTo({ top: y, behavior: 'smooth' });

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 1000); // Reset after 1 second
    }
  };

  return (
    <nav ref={navRef} className={cn("z-30 w-full bg-background/80 backdrop-blur-sm border-b", isSticky ? 'sticky top-[80px]' : 'relative')}>
      <div className="container px-4 sm:px-6">
        <ScrollArea className="whitespace-nowrap">
          <div className="flex h-[60px] items-center gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                ref={(el) => buttonRefs.current[category.id] = el}
                variant="ghost"
                className={cn(
                    "rounded-full h-9 px-4 font-medium transition-colors uppercase text-sm",
                    activeCategory === category.id ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-transparent hover:bg-accent'
                )}
                onClick={() => scrollToCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </nav>
  );
}
