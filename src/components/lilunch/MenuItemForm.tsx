'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ALLERGENS } from '@/lib/allergens';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CategoryCombobox } from '@/components/lilunch/CategoryCombobox';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre del plato es demasiado corto.' }),
  category: z.string().min(1, { message: 'Debes seleccionar o crear una categoría.' }),
  description: z.string().optional(),
  price: z.coerce.number().positive({ message: 'El precio debe ser un número positivo.' }),
  allergens: z.array(z.string()).optional(),
  isAvailable: z.boolean(),
});

interface MenuItem {
    id: string;
    name: string;
    category: string;
    price: number;
    description?: string;
    allergens?: string[];
    isAvailable: boolean;
}

interface MenuItemFormProps {
  existingMenuItem?: MenuItem | null;
}

export function MenuItemForm({ existingMenuItem }: MenuItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const isEditMode = !!existingMenuItem;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      price: undefined,
      allergens: [],
      isAvailable: true, 
    },
  });

  useEffect(() => {
    if (isEditMode && existingMenuItem) {
        form.reset({
            name: existingMenuItem.name,
            category: existingMenuItem.category,
            description: existingMenuItem.description || '',
            price: existingMenuItem.price,
            allergens: existingMenuItem.allergens || [],
            isAvailable: existingMenuItem.isAvailable === false ? false : true,
        });
    }
  }, [isEditMode, existingMenuItem, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast('Error de autenticación', 'error', { description: 'No se ha podido verificar tu identidad.'});
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...values,
        updatedAt: serverTimestamp(),
      };

      if (isEditMode && existingMenuItem) {
        const docRef = doc(db, 'restaurants', user.uid, 'menuItems', existingMenuItem.id);
        await updateDoc(docRef, dataToSave);
        toast('¡Plato actualizado!', 'success', { description: `El plato \'${values.name}\' ha sido guardado.` });
      } else {
        const collectionRef = collection(db, 'restaurants', user.uid, 'menuItems');
        await addDoc(collectionRef, {
            ...dataToSave,
            createdAt: serverTimestamp(),
        });
        toast('¡Plato guardado!', 'success', { description: `El plato \'${values.name}\' ha sido añadido a tu carta.` });
      }
      router.push('/dashboard/menu');

    } catch (error) {
      console.error("Error al guardar el plato: ", error);
      toast('Error al guardar', 'error', { description: 'Ha ocurrido un problema al guardar. Por favor, inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const buttonText = isEditMode ? 'Guardar cambios' : 'Añadir plato';
  const buttonSubmittingText = isEditMode ? 'Guardando cambios...' : 'Añadiendo plato...';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>Nombre del plato</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Paella Valenciana" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className='font-bold'>Categoría</FormLabel>
              <FormControl>
                <CategoryCombobox 
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Clasifica tu plato en una categoría o crea una nueva.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Una breve descripción del plato (opcional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>Precio</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="Ej: 12.50"
                    className="pr-8"
                    {...field}
                  />
                </FormControl>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-muted-foreground sm:text-sm">€</span>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergens"
          render={({ field }) => (
            <FormItem>
               <div className="mb-4">
                <FormLabel className="text-base font-bold">Alérgenos</FormLabel>
                <FormDescription>
                  Marca los alérgenos presentes en este plato.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ALLERGENS.map((allergen) => (
                    <div key={allergen.id} className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(allergen.id)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            const newValue = checked
                              ? [...currentValue, allergen.id]
                              : currentValue.filter((value) => value !== allergen.id);
                            field.onChange(newValue);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {allergen.name}
                      </FormLabel>
                    </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base font-bold">
                            Disponibilidad
                        </FormLabel>
                        <FormDescription>
                            Indica si el plato está actualmente disponible o agotado.
                        </FormDescription>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
        
        <Button type="submit" className="w-full rounded-full font-bold" disabled={isSubmitting || authLoading}>
            {(isSubmitting || authLoading) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? buttonSubmittingText : (authLoading ? 'Verificando usuario...' : buttonText)}
        </Button>

      </form>
    </Form>
  );
}
