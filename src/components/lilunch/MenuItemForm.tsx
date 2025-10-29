'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALLERGENS } from '@/lib/allergens';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { CategoryCombobox } from '@/components/lilunch/CategoryCombobox';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { collection, doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { AllergenSelector } from '@/components/lilunch/AllergenSelector';
import { I18nString } from '@/types/i18n';
import { cn } from '@/lib/utils';

const allergenStatus = z.enum(['no', 'traces', 'yes']);

const formSchema = z.object({
  name_es: z.string().min(1, { message: 'El nombre del plato no puede estar vacío.' }),
  name_en: z.string().optional(),
  category: z.object({
    id: z.string(),
    name_i18n: z.object({ 
      es: z.string(), 
      en: z.string().optional() 
    }).passthrough(),
  }, {
    required_error: "Debes seleccionar una categoría.",
    invalid_type_error: "Debes seleccionar una categoría.",
  }),
  description_es: z.string().optional(),
  description_en: z.string().optional(),
  price: z.string()
    .min(1, 'El precio no puede estar vacío.')
    .refine(val => !isNaN(parseFloat(val.replace(',', '.'))) && parseFloat(val.replace(',', '.')) >= 0, {
      message: 'Introduce un precio válido (ej: 12,50).'
    }),
  allergens: z.record(allergenStatus),
  isAvailable: z.boolean(),
});

export interface MenuItem {
    id: string;
    name?: string;
    name_i18n?: I18nString;
    category?: string;
    categoryId?: string;
    category_i18n?: I18nString;
    price: number;
    description?: string;
    description_i18n?: I18nString;
    allergens?: { [key: string]: 'no' | 'traces' | 'yes' };
    isAvailable: boolean;
}

interface MenuItemFormProps {
  existingMenuItem?: MenuItem | null;
}

async function translateText(text: string): Promise<string> {
  if (!text) return '';
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang: 'en' }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Translation API error:', errorData.details || errorData.error);
      return '';
    }
    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Failed to fetch translation:', error);
    return '';
  }
}

export function MenuItemForm({ existingMenuItem }: MenuItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const isEditMode = !!existingMenuItem;

  const defaultAllergens = useMemo(() => 
    ALLERGENS.reduce((acc, allergen) => {
      acc[allergen.id] = 'no';
      return acc;
    }, {} as Record<string, 'no' | 'traces' | 'yes'>)
  , []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_es: '',
      name_en: '',
      category: null,
      description_es: '',
      description_en: '',
      price: '',
      allergens: defaultAllergens,
      isAvailable: true, 
    },
  });

  const { formState, reset } = form;

  useEffect(() => {
    if (isEditMode && existingMenuItem && user) {
      const fetchAndSetCategory = async (categoryId: string) => {
        const catDoc = await getDoc(doc(db, 'restaurants', user.uid, 'categories', categoryId));
        if (catDoc.exists()) {
          const catData = catDoc.data();
          form.setValue('category', {
            id: catDoc.id,
            name_i18n: catData.name_i18n || { es: catData.name, en: '' },
          });
        }
      };

      const name_i18n = existingMenuItem.name_i18n || { es: existingMenuItem.name || '' };
      const description_i18n = existingMenuItem.description_i18n || { es: existingMenuItem.description || '' };
      const name_en = (name_i18n.en && typeof name_i18n.en === 'string') ? name_i18n.en : '';
      const description_en = (description_i18n.en && typeof description_i18n.en === 'string') ? description_i18n.en : '';
      const priceString = (existingMenuItem.price / 100).toFixed(2).replace('.', ',');

      reset({
        name_es: name_i18n.es || '',
        name_en: name_en,
        description_es: description_i18n.es || '',
        description_en: description_en,
        price: priceString,
        allergens: { ...defaultAllergens, ...existingMenuItem.allergens },
        isAvailable: existingMenuItem.isAvailable !== false,
        category: null,
      });

      const categoryId = existingMenuItem.categoryId || existingMenuItem.category;
      if (categoryId) {
        fetchAndSetCategory(categoryId);
      }
    }
  }, [isEditMode, existingMenuItem, user, form, defaultAllergens, reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: 'Error de autenticación', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    setShowSuccessMessage(false);
    try {
      const batch = writeBatch(db);
      
      const allergensToSave = Object.entries(values.allergens)
        .filter(([, value]) => value !== 'no')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      
      const priceInCents = Math.round(parseFloat(values.price.replace(',', '.')) * 100);

      const docRef = isEditMode && existingMenuItem
        ? doc(db, 'restaurants', user.uid, 'menuItems', existingMenuItem.id)
        : doc(collection(db, 'restaurants', user.uid, 'menuItems'));

      // Objeto de datos principal para el documento del plato
      let mainData: any = {
        name_i18n: { es: values.name_es, en: values.name_en || '' },
        description_i18n: { es: values.description_es || '', en: values.description_en || '' },
        price: priceInCents,
        allergens: allergensToSave,
        categoryId: values.category.id,
        category_i18n: values.category.name_i18n,
        isAvailable: values.isAvailable,
        updatedAt: serverTimestamp(),
        lastUpdatedBy: user.uid,
        lastUpdatedByDisplayName: user.displayName || user.email,
      };

      // Objeto de datos COMPLETO y EXPLÍCITO para el historial
      const historyData = {
        name_i18n: { es: values.name_es, en: values.name_en || '' },
        description_i18n: { es: values.description_es || '', en: values.description_en || '' },
        category_i18n: values.category.name_i18n,
        price: priceInCents,
        isAvailable: values.isAvailable,
        allergens: allergensToSave,
        updatedAt: serverTimestamp(),
        lastUpdatedBy: user.uid,
        lastUpdatedByDisplayName: user.displayName || user.email,
      };

      if (isEditMode) {
        batch.update(docRef, mainData);
        toast({ title: '¡Plato actualizado!', description: `El plato '${values.name_es}' ha sido guardado.` });
      } else {
        mainData.createdAt = serverTimestamp();
        toast({ title: 'Traduciendo plato...', description: 'Por favor, espera un momento.'});
        const [translatedName, translatedDescription] = await Promise.all([
          translateText(values.name_es),
          translateText(values.description_es || '')
        ]);
        mainData.name_i18n.en = translatedName;
        historyData.name_i18n.en = translatedName;
        mainData.description_i18n.en = translatedDescription;
        historyData.description_i18n.en = translatedDescription;

        batch.set(docRef, mainData);
        toast({ title: '¡Plato añadido!', description: `El plato '${values.name_es}' se ha guardado y traducido.` });
      }

      const historyRef = doc(collection(docRef, 'history'));
      batch.set(historyRef, historyData);

      await batch.commit();
      
      setShowSuccessMessage(true);
      router.push('/dashboard/menu');

    } catch (error) {
      console.error("Error saving item with history: ", error);
      toast({ title: 'Error al guardar', description: 'Ha ocurrido un problema. Por favor, inténtalo de nuevo.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {isEditMode ? (
          <Tabs defaultValue="es" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="es">Español</TabsTrigger>
              <TabsTrigger value="en">Inglés</TabsTrigger>
            </TabsList>
            <TabsContent value="es" className="pt-6">
              <div className='space-y-8'>
                <FormField control={form.control} name="name_es" render={({ field }) => <FormItem><FormLabel className='text-lg font-bold text-gray-800'>Nombre del plato (ES)</FormLabel><FormControl><Input placeholder="Ej: Paella Valenciana" {...field} className={cn(field.value && 'text-blue-600 font-semibold')} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="description_es" render={({ field }) => <FormItem><FormLabel className='text-lg font-bold text-gray-800'>Descripción (ES)</FormLabel><FormControl><Textarea placeholder="(Opcional) Una breve descripción del plato." {...field} className={cn(field.value && 'text-blue-600 font-semibold')} /></FormControl><FormMessage /></FormItem>} />
              </div>
            </TabsContent>
            <TabsContent value="en" className="pt-6">
              <div className='space-y-8'>
                <FormField control={form.control} name="name_en" render={({ field }) => <FormItem><FormLabel className='text-lg font-bold text-gray-800'>Nombre del plato (EN)</FormLabel><FormControl><Input placeholder="Ej: Valencian Paella" {...field} className={cn(field.value && 'text-blue-600 font-semibold')} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="description_en" render={({ field }) => <FormItem><FormLabel className='text-lg font-bold text-gray-800'>Descripción (EN)</FormLabel><FormControl><Textarea placeholder="(Optional) A brief description of the dish." {...field} className={cn(field.value && 'text-blue-600 font-semibold')} /></FormControl><FormMessage /></FormItem>} />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <>
            <FormField control={form.control} name="name_es" render={({ field }) => <FormItem><FormLabel className='text-lg font-bold text-gray-800'>Nombre del plato</FormLabel><FormControl><Input placeholder="Ej: Paella Valenciana" {...field} className={cn("h-14 px-5 text-base rounded-full", field.value && "text-blue-600 font-bold")} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="description_es" render={({ field }) => <FormItem><FormLabel className='text-lg font-bold text-gray-800'>Descripción</FormLabel><FormControl><Textarea placeholder="(Opcional) Una breve descripción del plato." {...field} className={cn("text-base rounded-2xl px-5 py-4 h-28", field.value && "text-blue-600 font-bold")} /></FormControl><FormMessage /></FormItem>} />
          </>
        )}

        <FormField control={form.control} name="category" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel className='text-lg font-bold text-gray-800'>Categoría</FormLabel><CategoryCombobox value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel className='text-lg font-bold text-gray-800'>Precio</FormLabel><div className="relative"><FormControl><Input type="text" inputMode="decimal" placeholder="Ej: 12,50" {...field} className="h-14 px-5 text-base rounded-full pr-12" /></FormControl><div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none"><span className="text-muted-foreground text-lg">€</span></div></div><FormMessage /></FormItem>)} />
        
        <FormField
          control={form.control}
          name="allergens"
          render={() => (
            <FormItem className="pt-8">
               <div className="mb-4">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Alérgenos</h2>
                <p className="text-sm text-muted-foreground mt-2">Indica la presencia de alérgenos en el plato.</p>
              </div>
              <div>
                {ALLERGENS.map((allergen) => (
                  <FormField 
                    key={allergen.id} 
                    control={form.control} 
                    name={`allergens.${allergen.id}`} 
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between border-b py-4">
                        <FormLabel className="font-semibold text-lg flex-1">{allergen.name}</FormLabel>
                        <FormControl>
                          <AllergenSelector 
                            value={field.value || 'no'} 
                            onChange={field.onChange} 
                          />
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
                        <FormLabel className="text-3xl font-bold tracking-tight text-gray-900">Disponibilidad</FormLabel>
                        <FormDescription className="text-sm text-muted-foreground">Indica si el plato está actualmente disponible o agotado.</FormDescription>
                    </div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
            )}
        />
        
        <div className="pt-6">
            <Button size="lg" type="submit" className="w-full rounded-full font-bold text-lg h-16 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
                {isSubmitting ? (isEditMode ? 'Guardando...' : 'Traduciendo y guardando...') : (isEditMode ? 'Guardar cambios' : 'Añadir plato')}
            </Button>
            {formState.isSubmitted && !formState.isValid && !showSuccessMessage && (
                <p className="text-center text-sm text-destructive mt-4 font-semibold">
                    Faltan campos obligatorios por completar.
                </p>
            )}
        </div>
      </form>
    </Form>
  );
}
