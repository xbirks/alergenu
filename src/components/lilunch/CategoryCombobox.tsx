'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { I18nString } from '@/types/i18n';

export interface Category {
  id: string;
  name_i18n: I18nString;
  order: number;
}

interface CategoryComboboxProps {
  value: Category | null;
  onChange: (value: Category | null) => void;
  className?: string;
}

export function CategoryCombobox({ value, onChange, className }: CategoryComboboxProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [dbCategories, setDbCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    if (!user) return;
    const catQuery = query(
      collection(db, 'restaurants', user.uid, 'categories'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(catQuery, (snapshot) => {
      const cats = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          // Handle legacy categories that only have `name`
          name_i18n: data.name_i18n || { es: data.name || 'Sin nombre', en: '' },
          order: data.order || 0,
        } as Category;
      });
      setDbCategories(cats);
    }, (error) => {
      console.error("Error loading categories: ", error);
      toast({ title: 'Error al cargar categorías', variant: 'destructive' });
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleSelectCategory = (category: Category) => {
    onChange(category);
    setOpen(false);
  };

  const displayedValue = value ? value.name_i18n.es : 'Selecciona una categoría...';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between h-14 px-5 text-base rounded-full',
            !value && 'text-muted-foreground font-normal',
            value && 'text-blue-600 font-bold',
            className
          )}
        >
          {displayedValue}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Buscar categoría..." />
          <CommandList>
            <CommandEmpty>No se encontraron categorías.</CommandEmpty>
            <CommandGroup>
              {dbCategories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name_i18n.es}
                  onSelect={() => handleSelectCategory(category)}
                  className="cursor-pointer text-base py-2"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value?.id === category.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {category.name_i18n.es}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
