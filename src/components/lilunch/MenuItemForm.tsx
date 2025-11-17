'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALLERGENS } from '@/lib/allergens';
import { Loader2, PlusCircle, Trash2, ShieldQuestion } from 'lucide-react';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  extras: z.array(
    z.object({
      name_es: z.string().min(1, 'El nombre no puede estar vacío.'),
      name_en: z.string().optional(),
      price: z.string().refine(val => !isNaN(parseFloat(val.replace(',', '.'))), {
        message: 'Precio inválido.'
      }),
      allergens: z.record(allergenStatus).optional(),
    })
  ).optional(),
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
    extras?: { name_i18n: I18nString; price: number; allergens?: { [key: string]: 'no' | 'traces' | 'yes' } }[];
    isAvailable: boolean;
    order?: number;
    createdAt?: any;
}

interface MenuItemFormProps {
  existingMenuItem?: MenuItem | null;
}

async function translateText(text: string): Promise<string> {
    // ... (implementation unchanged)
    return '';
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
      category: undefined,
      description_es: '',
      description_en: '',
      price: '',
      extras: [],
      allergens: defaultAllergens,
      isAvailable: true, 
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "extras"
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
      const priceString = (existingMenuItem.price / 100).toFixed(2).replace('.', ',');
      
      const existingExtras = existingMenuItem.extras
        ? existingMenuItem.extras.map(extra => ({
            name_es: extra.name_i18n?.es || '',
            name_en: extra.name_i18n?.en || '',
            price: (extra.price / 100).toFixed(2).replace('.', ','),
            allergens: { ...defaultAllergens, ...extra.allergens },
          }))
        : [];

      reset({
        name_es: name_i18n.es || '',
        name_en: name_i18n.en || '',
        description_es: description_i18n.es || '',
        description_en: description_i18n.en || '',
        price: priceString,
        extras: existingExtras,
        allergens: { ...defaultAllergens, ...existingMenuItem.allergens },
        isAvailable: existingMenuItem.isAvailable !== false,
        category: undefined,
      });

      if (existingMenuItem.categoryId) {
        fetchAndSetCategory(existingMenuItem.categoryId);
      }
    }
  }, [isEditMode, existingMenuItem, user, reset, defaultAllergens, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) { /* ... */ return; }
    setIsSubmitting(true);
    try {
      const batch = writeBatch(db);
      const allergensToSave = Object.entries(values.allergens).filter(([, v]) => v !== 'no').reduce((acc, [k, v]) => ({...acc, [k]: v}), {});
      const priceInCents = Math.round(parseFloat(values.price.replace(',', '.')) * 100);

      const extrasToSave = await Promise.all(
        (values.extras || []).map(async (extra) => {
          const extraPriceInCents = Math.round(parseFloat(extra.price.replace(',', '.')) * 100);
          let name_en = extra.name_en || '';
          if (extra.name_es && !extra.name_en) { name_en = await translateText(extra.name_es); }

          const extraAllergensToSave = Object.entries(extra.allergens || {}).filter(([, v]) => v !== 'no').reduce((acc, [k, v]) => ({...acc, [k]: v}), {});

          return {
            name_i18n: { es: extra.name_es, en: name_en },
            price: extraPriceInCents,
            allergens: extraAllergensToSave,
          };
        })
      );

      const docRef = isEditMode && existingMenuItem ? doc(db, 'restaurants', user.uid, 'menuItems', existingMenuItem.id) : doc(collection(db, 'restaurants', user.uid, 'menuItems'));
      
      let mainData: any = {
        name_i18n: { es: values.name_es, en: values.name_en || '' },
        description_i18n: { es: values.description_es || '', en: values.description_en || '' },
        price: priceInCents,
        extras: extrasToSave,
        allergens: allergensToSave,
        categoryId: values.category.id,
        category_i18n: values.category.name_i18n,
        isAvailable: values.isAvailable,
        updatedAt: serverTimestamp(),
      };

      if (isEditMode) {
        batch.update(docRef, mainData);
        toast({ title: '¡Plato actualizado!'});
      } else {
        mainData.createdAt = serverTimestamp();
        mainData.order = Date.now();
        if (values.name_es && !mainData.name_i18n.en) { mainData.name_i18n.en = await translateText(values.name_es); }
        if (values.description_es && !mainData.description_i18n.en) { mainData.description_i18n.en = await translateText(values.description_es); }
        batch.set(docRef, mainData);
        toast({ title: '¡Plato añadido!'});
      }

      await batch.commit();
      router.push('/dashboard/menu');
    } catch (error) {
      console.error("Error saving item: ", error);
      toast({ title: 'Error al guardar', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="es" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="es">Español</TabsTrigger>
            <TabsTrigger value="en">Inglés</TabsTrigger>
          </TabsList>
          <TabsContent value="es" className="pt-6">
            <div className='space-y-8'>
              <FormField control={form.control} name="name_es" render={({ field }) => <FormItem><FormLabel className='text-lg font-bold'>Nombre del plato (ES)</FormLabel><FormControl><Input placeholder="Ej: Paella Valenciana" {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="description_es" render={({ field }) => <FormItem><FormLabel className='text-lg font-bold'>Descripción (ES)</FormLabel><FormControl><Textarea placeholder="(Opcional) Una breve descripción del plato." {...field} /></FormControl><FormMessage /></FormItem>} />
            </div>
          </TabsContent>
          <TabsContent value="en" className="pt-6">
            <div className='space-y-8'>
              <FormField control={form.control} name="name_en" render={({ field }) => <FormItem><FormLabel className='text-lg font-bold'>Nombre del plato (EN)</FormLabel><FormControl><Input placeholder="(Automático) Ej: Valencian Paella" {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="description_en" render={({ field }) => <FormItem><FormLabel className='text-lg font-bold'>Descripción (EN)</FormLabel><FormControl><Textarea placeholder="(Automático) A brief description of the dish." {...field} /></FormControl><FormMessage /></FormItem>} />
            </div>
          </TabsContent>
        </Tabs>

        <FormField control={form.control} name="category" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel className='text-lg font-bold'>Categoría</FormLabel><CategoryCombobox value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel className='text-lg font-bold'>Precio</FormLabel><div className="relative"><FormControl><Input type="text" inputMode="decimal" placeholder="Ej: 12,50" {...field} /></FormControl><div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground">€</div></div><FormMessage /></FormItem>)} />
        
        <div className="space-y-4 rounded-lg border p-4 bg-gray-50">
          <h3 className="text-lg font-bold">Extras / Suplementos</h3>
          <div className="space-y-4 pt-2">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 rounded-md border p-4 bg-white">
                <div className="flex justify-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
                <Tabs defaultValue="es">
                  <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="es">Extra (ES)</TabsTrigger><TabsTrigger value="en">Extra (EN)</TabsTrigger></TabsList>
                  <TabsContent value="es" className="pt-4"><FormField control={form.control} name={`extras.${index}.name_es`} render={({ field }) => <FormItem><FormLabel>Nombre (ES)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /></TabsContent>
                  <TabsContent value="en" className="pt-4"><FormField control={form.control} name={`extras.${index}.name_en`} render={({ field }) => <FormItem><FormLabel>Nombre (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /></TabsContent>
                </Tabs>
                <FormField control={form.control} name={`extras.${index}.price`} render={({ field }) => <FormItem><FormLabel>Precio</FormLabel><div className="relative"><FormControl><Input type="text" inputMode="decimal" {...field} /></FormControl><div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground">€</div></div><FormMessage /></FormItem>} />
                <Collapsible>
                  <CollapsibleTrigger asChild><Button variant="outline" size="sm" className="gap-2"><ShieldQuestion className="h-4 w-4" />Alérgenos del Extra</Button></CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div className="space-y-2">
                    {ALLERGENS.map((allergen) => (
                      <FormField key={allergen.id} control={form.control} name={`extras.${index}.allergens.${allergen.id}`} render={({ field }) => (
                        <FormItem className="flex items-center justify-between border-b py-2">
                          <FormLabel>{allergen.name}</FormLabel>
                          <FormControl><AllergenSelector value={field.value || 'no'} onChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}/>
                    ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ name_es: '', name_en: '', price: '', allergens: defaultAllergens })}><PlusCircle className='h-4 w-4 mr-2'/>Añadir Extra</Button>
        </div>

        <FormField name="allergens" render={() => (
          <FormItem className="pt-4">
             <div className="mb-4"><h2 className="text-xl font-bold">Alérgenos del Plato Principal</h2></div>
            {ALLERGENS.map((allergen) => (
              <FormField key={allergen.id} control={form.control} name={`allergens.${allergen.id}`} render={({ field }) => (
                <FormItem className="flex items-center justify-between border-b py-3">
                  <FormLabel>{allergen.name}</FormLabel>
                  <FormControl><AllergenSelector value={field.value || 'no'} onChange={field.onChange} /></FormControl>
                </FormItem>
              )}/>
            ))}
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="isAvailable" render={({ field }) => (
            <FormItem className="flex items-center justify-between border-b py-4">
                <div>
                    <FormLabel className="text-lg font-bold">Disponibilidad</FormLabel>
                    <FormDescription>Indica si el plato está disponible o agotado.</FormDescription>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
        )} />
        
        <div className="pt-6">
            <Button size="lg" type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Guardar cambios' : 'Añadir plato'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
