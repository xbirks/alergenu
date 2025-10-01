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
import { Switch } from '@/components/ui/switch';
import { ALLERGENS } from '@/lib/allergens';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CategoryCombobox } from '@/components/lilunch/CategoryCombobox';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { AllergenSelector } from '@/components/lilunch/AllergenSelector';

const allergenStatus = z.enum(['no', 'traces', 'yes']);

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre del plato es demasiado corto.' }),
  category: z.string().min(1, { message: 'Debes seleccionar o crear una categoría.' }),
  description: z.string().optional(),
  price: z.coerce.number().positive({ message: 'El precio debe ser un número positivo.' }),
  allergens: z.record(allergenStatus).optional(),
  isAvailable: z.boolean(),
});

interface MenuItem {
    id: string;
    name: string;
    category: string;
    price: number; // Stored in cents
    description?: string;
    allergens?: { [key: string]: 'no' | 'traces' | 'yes' };
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

  const defaultAllergens = useMemo(() => {
    return ALLERGENS.reduce((acc, allergen) => {
      acc[allergen.id] = 'no';
      return acc;
    }, {} as Record<string, 'no' | 'traces' | 'yes'>);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      price: undefined,
      allergens: defaultAllergens,
      isAvailable: true, 
    },
  });

  useEffect(() => {
    if (isEditMode && existingMenuItem) {
        const currentAllergens = { ...defaultAllergens, ...existingMenuItem.allergens };
        form.reset({
            name: existingMenuItem.name,
            category: existingMenuItem.category,
            description: existingMenuItem.description || '',
            price: existingMenuItem.price / 100, // Convert from cents to euros for display
            allergens: currentAllergens,
            isAvailable: existingMenuItem.isAvailable === false ? false : true,
        });
    }
  }, [isEditMode, existingMenuItem, form, defaultAllergens]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: 'Error de autenticación', description: 'No se ha podido verificar tu identidad.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const allergensToSave: { [key: string]: 'no' | 'traces' | 'yes' } = {};
      if (values.allergens) {
        for (const [key, value] of Object.entries(values.allergens)) {
          if (value !== 'no') {
            allergensToSave[key] = value;
          }
        }
      }

      const dataToSave = {
        ...values,
        price: Math.round(values.price * 100), // Convert from euros to cents for storage
        allergens: allergensToSave,
        updatedAt: serverTimestamp(),
      };

      if (isEditMode && existingMenuItem) {
        const docRef = doc(db, 'restaurants', user.uid, 'menuItems', existingMenuItem.id);
        await updateDoc(docRef, dataToSave);
        toast({ title: '¡Plato actualizado!', description: `El plato \'${values.name}\' ha sido guardado.` });
      } else {
        const collectionRef = collection(db, 'restaurants', user.uid, 'menuItems');
        await addDoc(collectionRef, {
            ...dataToSave,
            createdAt: serverTimestamp(),
        });
        toast({ title: '¡Plato guardado!', description: `El plato \'${values.name}\' ha sido añadido a tu carta.` });
      }
      router.push('/dashboard/menu');

    } catch (error) {
      console.error("Error al guardar el plato: ", error);
      toast({ title: 'Error al guardar', description: 'Ha ocurrido un problema al guardar. Por favor, inténtalo de nuevo.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const buttonText = isEditMode ? 'Guardar cambios' : 'Añadir plato';
  const buttonSubmittingText = isEditMode ? 'Guardando cambios...' : 'Añadiendo plato...';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold text-lg'>Nombre del plato</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Paella Valenciana" {...field} className={`h-12 text-lg ${field.value ? 'text-blue-600 font-bold' : ''}`}/>
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
              <FormLabel className='font-bold text-lg'>Categoría</FormLabel>
              <FormControl>
                <CategoryCombobox 
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription className="text-base">
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
              <FormLabel className='font-bold text-lg'>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Una breve descripción del plato (opcional)"
                  {...field}
                  className={`text-lg ${field.value ? 'text-blue-600 font-bold' : ''}`}
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
              <FormLabel className='font-bold text-lg'>Precio</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="Ej: 12.50"
                    className={`pr-10 h-12 text-lg ${field.value ? 'text-blue-600 font-bold' : ''}`}
                    {...field}
                  />
                </FormControl>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-muted-foreground text-lg">€</span>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergens"
          render={() => (
            <FormItem>
               <div className="mb-4">
                <FormLabel className="text-lg font-bold">Alérgenos</FormLabel>
                <FormDescription className="text-base">
                  Para cada alérgeno, indica si el plato no lo contiene, si tiene trazas o si está presente.
                </FormDescription>
              </div>
              <div className="space-y-4">
                {ALLERGENS.map((allergen) => (
                    <FormField
                      key={allergen.id}
                      control={form.control}
                      name={`allergens.${allergen.id}` as const}
                      render={({ field }) => (
                        <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4">
                           <FormLabel className="font-semibold text-lg mb-4 sm:mb-0">
                                {allergen.name}
                            </FormLabel>
                          <FormControl>
                            <AllergenSelector value={field.value} onChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
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
                        <FormLabel className="text-lg font-bold">
                            Disponibilidad
                        </FormLabel>
                        <FormDescription className="text-base">
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
        
        <Button size="lg" type="submit" className="w-full rounded-full font-bold text-lg h-14" disabled={isSubmitting || authLoading}>
            {(isSubmitting || authLoading) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? buttonSubmittingText : (authLoading ? 'Verificando usuario...' : buttonText)}
        </Button>

      </form>
    </Form>
  );
}
