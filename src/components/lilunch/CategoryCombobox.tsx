'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface Category {
    id: string;
    name: string;
}

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
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
        orderBy('name')
    );
    const unsubscribe = onSnapshot(catQuery, (snapshot) => {
        const cats = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setDbCategories(cats);
    }, (error) => {
        console.error("Error al cargar categorías: ", error);
        toast({ title: 'Error al cargar categorías', description: 'No se pudieron cargar las categorías. Compruébalo en la gestión de categorías.', variant: 'destructive'});
    });
    return () => unsubscribe();
  }, [user, toast]);

  const handleSelectCategory = (categoryName: string) => {
    onChange(categoryName);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between h-12 text-lg', className)}
        >
          {value ? dbCategories.find(c => c.name === value)?.name : 'Selecciona una categoría...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                  value={category.name}
                  onSelect={() => handleSelectCategory(category.name)}
                  className="cursor-pointer text-lg py-2"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === category.name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
