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
  name: z.string().min(1, { message: 'El nombre del plato no puede estar vacío.' }),
  category: z.string().min(1, { message: 'Debes seleccionar una categoría.' }),
  description: z.string().optional(),
  price: z.coerce.number().positive({ message: 'El precio debe ser un número positivo.' }),
  allergens: z.record(allergenStatus),
  isAvailable: z.boolean(),
});

interface MenuItem {
    id: string;
    name: string;
    category: string;
    price: number;
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

  const { formState: { errors } } = form;

  useEffect(() => {
    if (isEditMode && existingMenuItem) {
        const currentAllergens = { ...defaultAllergens, ...existingMenuItem.allergens };
        form.reset({
            name: existingMenuItem.name,
            category: existingMenuItem.category,
            description: existingMenuItem.description || '',
            price: existingMenuItem.price / 100,
            allergens: currentAllergens,
            isAvailable: existingMenuItem.isAvailable === false ? false : true,
        });
    }
  }, [isEditMode, existingMenuItem, form, defaultAllergens]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (Object.keys(errors).length > 0) return;

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
        price: Math.round(values.price * 100),
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
  const buttonSubmittingText = isEditMode ? 'Guardando...' : 'Añadiendo plato...';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lg font-bold text-gray-800 pb-2 inline-block'>Nombre del plato</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ej: Paella Valenciana" 
                  {...field} 
                  className={`h-14 px-5 text-base rounded-full ${errors.name ? 'border-2 border-red-500' : ''} ${field.value ? 'text-blue-600 font-bold' : ''}`}/>
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
              <FormLabel className='text-lg font-bold text-gray-800 pb-2 inline-block'>Categoría</FormLabel>
              <FormControl>
                <CategoryCombobox 
                  value={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.category}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lg font-bold text-gray-800 pb-2 inline-block'>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="(Opcional) Una breve descripción del plato ayudará al comensal a decidirse."
                  {...field}
                  className={`text-base rounded-2xl px-5 py-4 h-28 ${field.value ? 'text-blue-600 font-bold' : ''}`}
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
              <FormLabel className='text-lg font-bold text-gray-800 pb-2 inline-block'>Precio</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="Ej: 12,50"
                    {...field}
                    className={`h-14 px-5 text-base rounded-full pr-12 ${errors.price ? 'border-2 border-red-500' : ''} ${field.value ? 'text-blue-600 font-bold' : ''}`}
                  />
                </FormControl>
                <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
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
            <FormItem className="pt-8">
               <div className="mb-4">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Alérgenos</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Para cada alérgeno, indica si el plato no lo contiene, si tiene trazas o si está presente.
                </p>
              </div>
              <div>
                {ALLERGENS.map((allergen) => (
                    <FormField
                      key={allergen.id}
                      control={form.control}
                      name={`allergens.${allergen.id}` as const}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between border-b py-4">
                           <FormLabel className="font-semibold text-lg flex-1">
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
                <FormItem className="flex flex-row items-center justify-between border-b py-4">
                    <div className="space-y-1.5">
                        <FormLabel className="text-3xl font-bold tracking-tight text-gray-900">
                            Disponibilidad
                        </FormLabel>
                        <FormDescription className="text-sm text-muted-foreground">
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
        
        <div className="pt-6">
            <Button size="lg" type="submit" className="w-full rounded-full font-bold text-lg h-16 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting || authLoading}>
                {(isSubmitting || authLoading) 
                    ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> 
                    : null
                }
                {isSubmitting ? buttonSubmittingText : (authLoading ? 'Verificando...' : buttonText)}
            </Button>
        </div>

      </form>
    </Form>
  );
}
