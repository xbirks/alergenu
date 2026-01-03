'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALLERGENS } from '@/lib/allergens';
import { Loader2, PlusCircle, Trash2, ShieldQuestion, Sparkles } from 'lucide-react';
import { useEffect, useState, useMemo, useRef } from 'react';
import { CategoryCombobox } from '@/components/lilunch/CategoryCombobox';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { AllergenSelector } from '@/components/lilunch/AllergenSelector';
import { I18nString } from '@/types/i18n';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const allergenStatus = z.enum(['no', 'traces', 'yes']);

const formSchema = z.object({
  name_es: z.string().min(1, { message: 'El nombre del plato no puede estar vacío.' }),
  name_en: z.string().optional(),
  category: z.object({
    id: z.string(),
    name_i18n: z.object({
      es: z.string(),
      en: z.string().optional(),
    }).passthrough(),
  }, {
    required_error: "Debes seleccionar una categoría.",
    invalid_type_error: "Debes seleccionar una categoría.",
  }),
  description_es: z.string().optional(),
  description_en: z.string().optional(),
  price: z.string()
    .min(1, 'El precio no puede estar vacío.')
    .refine(val =>
      !isNaN(parseFloat(val.replace(',', '.'))) &&
      parseFloat(val.replace(',', '.')) >= 0, {
      message: 'Introduce un precio válido (ej: 12,50).'
    }
    ),
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
  extras?: {
    name_i18n: I18nString;
    price: number;
    allergens?: { [key: string]: 'no' | 'traces' | 'yes' }
  }[];
  isAvailable: boolean;
  order?: number;
  createdAt?: any;
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

    const data = await response.json();

    if (!response.ok) {
      console.error('Translation API error:', data.details || data.error);
      return '';
    }

    return data.translatedText || '';

  } catch (error) {
    console.error('Failed to fetch translation:', error);
    return '';
  }
}

async function detectAllergens(dishName: string): Promise<string[]> {
  if (!dishName) return [];

  try {
    const response = await fetch('/api/detect-allergens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishName }),
    });

    if (!response.ok) {
      throw new Error('Allergen detection API error');
    }

    const data = await response.json();
    return data.allergens || [];

  } catch (error) {
    console.error('Failed to detect allergens:', error);
    throw error; // Re-lanzar el error para que lo maneje handleDetectAllergens
  }
}

export function MenuItemForm({ existingMenuItem }: MenuItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { user } = useAuth(false);
  const { toast } = useToast();
  const router = useRouter();
  const submissionGuard = useRef(false);
  const isEditMode = !!existingMenuItem;
  const [isAnalyzingAllergens, setIsAnalyzingAllergens] = useState(false);
  const [allergensAnalyzed, setAllergensAnalyzed] = useState(false);

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

      // Back-compat: categoryId (nuevo) o category (antiguo)
      const categoryId = existingMenuItem.categoryId || existingMenuItem.category;
      if (categoryId) {
        fetchAndSetCategory(categoryId);
      }
    }
  }, [isEditMode, existingMenuItem, user, reset, defaultAllergens, form]);

  // Resetear el estado de análisis cuando cambia el nombre del plato
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name_es' && allergensAnalyzed) {
        setAllergensAnalyzed(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, allergensAnalyzed]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (submissionGuard.current) {
      return;
    }
    submissionGuard.current = true;

    if (!user) {
      toast({ title: 'Error de autenticación', variant: 'destructive' });
      submissionGuard.current = false;
      return;
    }

    setIsSubmitting(true);
    setShowSuccessMessage(false);

    try {
      const batch = writeBatch(db);

      const allergensToSave = Object.entries(values.allergens)
        .filter(([, v]) => v !== 'no')
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

      const priceInCents = Math.round(parseFloat(values.price.replace(',', '.')) * 100);

      const extrasToSave = await Promise.all(
        (values.extras || []).map(async (extra) => {
          const extraPriceInCents = Math.round(parseFloat(extra.price.replace(',', '.')) * 100);

          let name_en = extra.name_en || '';
          if (extra.name_es && !name_en) {
            name_en = await translateText(extra.name_es);
          }

          const extraAllergensToSave = Object.entries(extra.allergens || {})
            .filter(([, v]) => v !== 'no')
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

          return {
            name_i18n: { es: extra.name_es, en: name_en },
            price: extraPriceInCents,
            allergens: extraAllergensToSave,
          };
        })
      );

      const docRef = isEditMode && existingMenuItem
        ? doc(db, 'restaurants', user.uid, 'menuItems', existingMenuItem.id)
        : doc(collection(db, 'restaurants', user.uid, 'menuItems'));

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
        lastUpdatedBy: user.uid,
        lastUpdatedByDisplayName: user.displayName || user.email,
      };

      const historyData: any = {
        name_i18n: { es: values.name_es, en: values.name_en || '' },
        description_i18n: { es: values.description_es || '', en: values.description_en || '' },
        category_i18n: values.category.name_i18n,
        price: priceInCents,
        isAvailable: values.isAvailable,
        allergens: allergensToSave,
        extras: extrasToSave,
        updatedAt: serverTimestamp(),
        lastUpdatedBy: user.uid,
        lastUpdatedByDisplayName: user.displayName || user.email,
      };

      if (isEditMode) {
        batch.update(docRef, mainData);
        toast({ title: '¡Plato actualizado!' });
      } else {
        mainData.createdAt = serverTimestamp();
        mainData.order = Date.now();

        toast({ title: 'Traduciendo plato...', description: 'Por favor, espera un momento.' });

        const [translatedName, translatedDescription] = await Promise.all([
          !mainData.name_i18n.en ? translateText(values.name_es) : Promise.resolve(mainData.name_i18n.en),
          !mainData.description_i18n.en ? translateText(values.description_es || '') : Promise.resolve(mainData.description_i18n.en),
        ]);

        if (!mainData.name_i18n.en) mainData.name_i18n.en = translatedName;
        if (!historyData.name_i18n.en) historyData.name_i18n.en = mainData.name_i18n.en;

        if (!mainData.description_i18n.en) mainData.description_i18n.en = translatedDescription;
        if (!historyData.description_i18n.en) historyData.description_i18n.en = mainData.description_i18n.en;

        batch.set(docRef, mainData);
        toast({ title: '¡Plato añadido!', description: `El plato '${values.name_es}' se ha guardado y traducido.` });
      }

      const historyRef = doc(collection(docRef, 'history'));
      batch.set(historyRef, historyData);

      await batch.commit();

      setShowSuccessMessage(true);
      router.push('/dashboard/menu');

    } catch (error) {
      console.error("Error saving item with extras + history: ", error);
      toast({
        title: 'Error al guardar',
        description: 'Ha ocurrido un problema. Por favor, inténtalo de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
      submissionGuard.current = false;
    }
  }

  const handleDetectAllergens = async () => {
    const dishName = form.watch('name_es');
    const dishDescription = form.watch('description_es');

    if (!dishName) {
      toast({
        title: 'Nombre requerido',
        description: 'Por favor, escribe el nombre del plato primero.',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzingAllergens(true);

    try {
      toast({
        title: 'Analizando alérgenos...',
        description: 'La IA está procesando el plato (nombre + ingredientes).'
      });

      // Combinar nombre y descripción para mejor análisis
      const fullDishInfo = dishDescription
        ? `${dishName}. Ingredientes: ${dishDescription}`
        : dishName;

      const detectedAllergenIds = await detectAllergens(fullDishInfo);

      // Resetear todos los alérgenos a 'no'
      const newAllergens = { ...defaultAllergens };

      // Marcar los detectados como 'yes'
      detectedAllergenIds.forEach((allergenId: string) => {
        if (allergenId in newAllergens) {
          newAllergens[allergenId] = 'yes';
        }
      });

      // Actualizar el formulario
      Object.keys(newAllergens).forEach((key) => {
        form.setValue(`allergens.${key}` as any, newAllergens[key]);
      });

      setAllergensAnalyzed(true);

      toast({
        title: '¡Análisis completado!',
        description: `Se detectaron ${detectedAllergenIds.length} alérgenos. Puedes revisar y ajustar el resultado.`
      });

    } catch (error) {
      console.error('Error detecting allergens:', error);
      toast({
        title: 'Error en el análisis',
        description: 'No se pudo analizar. Por favor, añádelos manualmente.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzingAllergens(false);
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
              <FormField
                control={form.control}
                name="name_es"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-lg font-bold'>Nombre del plato (ES)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Paella Valenciana" {...field}
                        className={cn(field.value && 'text-blue-600 font-semibold')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description_es"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-lg font-bold'>Descripción (ES)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="(Opcional) Una breve descripción del plato." {...field}
                        className={cn(field.value && 'text-blue-600 font-semibold')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="en" className="pt-6">
            <div className='space-y-8'>
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-lg font-bold'>Nombre del plato (EN)</FormLabel>
                    <FormControl>
                      <Input placeholder="(Automático) Ej: Valencian Paella" {...field}
                        className={cn(field.value && 'text-blue-600 font-semibold')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-lg font-bold'>Descripción (EN)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="(Automático) A brief description of the dish." {...field}
                        className={cn(field.value && 'text-blue-600 font-semibold')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className='text-lg font-bold'>Categoría</FormLabel>
              <CategoryCombobox value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lg font-bold'>Precio</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input type="text" inputMode="decimal" placeholder="Ej: 12,50" {...field} />
                </FormControl>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground">
                  €
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 rounded-lg border p-4 bg-gray-50">
          <h3 className="text-lg font-bold">Extras / Suplementos</h3>

          <div className="space-y-4 pt-2">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 rounded-md border p-4 bg-white">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <Tabs defaultValue="es">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="es">Extra (ES)</TabsTrigger>
                    <TabsTrigger value="en">Extra (EN)</TabsTrigger>
                  </TabsList>

                  <TabsContent value="es" className="pt-4">
                    <FormField
                      control={form.control}
                      name={`extras.${index}.name_es`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre (ES)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="en" className="pt-4">
                    <FormField
                      control={form.control}
                      name={`extras.${index}.name_en`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre (EN)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>

                <FormField
                  control={form.control}
                  name={`extras.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type="text" inputMode="decimal" {...field} />
                        </FormControl>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground">
                          €
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ShieldQuestion className="h-4 w-4" />
                      Alérgenos del Extra
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pt-4">
                    <div className="space-y-2">
                      {ALLERGENS.map((allergen) => (
                        <FormField
                          key={allergen.id}
                          control={form.control}
                          name={`extras.${index}.allergens.${allergen.id}`}
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between border-b py-2">
                              <FormLabel className="text-lg">{allergen.name}</FormLabel>
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
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                name_es: '',
                name_en: '',
                price: '',
                allergens: { ...defaultAllergens } // evita referencias compartidas
              })
            }
          >
            <PlusCircle className='h-4 w-4 mr-2' />
            Añadir Extra
          </Button>
        </div>

        {/* Alérgenos del plato */}
        <FormField
          name="allergens"
          render={() => (
            <FormItem className="pt-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Alérgenos del Plato Principal</h2>

                {/* Botón de IA */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDetectAllergens}
                  disabled={isAnalyzingAllergens || !form.watch('name_es')}
                  className={cn(
                    'gap-2 transition-all duration-300',
                    {
                      'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500': !allergensAnalyzed && !isAnalyzingAllergens,
                      'bg-orange-500 text-white border-orange-500 cursor-wait': isAnalyzingAllergens,
                      'bg-blue-800 hover:bg-blue-900 text-white border-blue-800': allergensAnalyzed && !isAnalyzingAllergens,
                      'opacity-50 cursor-not-allowed': !form.watch('name_es'),
                    }
                  )}
                >
                  {isAnalyzingAllergens ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analizando...
                    </>
                  ) : allergensAnalyzed ? (
                    <>
                      <ShieldQuestion className="h-4 w-4" />
                      Re-analizar con IA
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Detectar con IA
                    </>
                  )}
                </Button>
              </div>

              {/* Mensaje de ayuda */}
              {isAnalyzingAllergens && (
                <p className="text-sm text-blue-600 animate-pulse mb-4">
                  ⚡ La IA está analizando el plato "{form.watch('name_es')}"...
                </p>
              )}

              {/* Lista de alérgenos */}
              {ALLERGENS.map((allergen) => (
                <FormField
                  key={allergen.id}
                  control={form.control}
                  name={`allergens.${allergen.id}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between border-b py-3">
                      <FormLabel className="text-lg">{allergen.name}</FormLabel>
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

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Disponibilidad */}
        <FormField
          control={form.control}
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between border-b py-4">
              <div>
                <FormLabel className="text-lg font-bold">Disponibilidad</FormLabel>
                <FormDescription>Indica si el plato está disponible o agotado.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="pt-6">
          <Button
            size="lg"
            type="submit"
            className="w-full rounded-full h-14 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Guardar cambios' : 'Añadir plato'}
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
