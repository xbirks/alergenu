'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { collection, onSnapshot, orderBy, query, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { Loader2, PlusCircle, MoreHorizontal, FilePenLine, Trash2, Eye, LayoutGrid, Languages } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ALLERGENS, Allergen } from '@/lib/allergens';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { AllergenIcon } from '@/components/icons/allergens';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { I18nString } from '@/types/i18n';
import { MenuItem } from '@/components/lilunch/MenuItemForm';

const slugify = (text: string) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-').replace(p, c => b.charAt(a.indexOf(c))).replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

interface Category {
  id: string;
  name_i18n: I18nString;
  order: number;
}

export default function MenuPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurantSlug, setRestaurantSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const allergensMap = useMemo(() => new Map<string, Allergen>(ALLERGENS.map(a => [a.id, a])), []);

  useEffect(() => {
    if (user) {
      const restaurantRef = doc(db, 'restaurants', user.uid);
      getDoc(restaurantRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data.slug && data.restaurantName) {
            const newSlug = slugify(data.restaurantName);
            updateDoc(restaurantRef, { slug: newSlug });
            setRestaurantSlug(newSlug);
          } else {
            setRestaurantSlug(data.slug);
          }
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setError('Por favor, inicia sesión para ver tu carta.');
      setLoading(false);
      return;
    }

    const categoriesQuery = query(collection(db, 'restaurants', user.uid, 'categories'), orderBy('order', 'asc'));
    const unsubscribeCategories = onSnapshot(categoriesQuery, snapshot => {
      const cats = snapshot.docs.map(doc => ({
        id: doc.id,
        name_i18n: doc.data().name_i18n || { es: doc.data().name, en: '' }, // Backwards compatibility
        order: doc.data().order,
      } as Category));
      setCategories(cats);
    }, err => {
      console.error("Error fetching categories: ", err);
      setError('No se pudieron cargar las categorías.');
    });

    const menuItemsQuery = query(collection(db, 'restaurants', user.uid, 'menuItems'), orderBy('createdAt', 'desc'));
    const unsubscribeMenuItems = onSnapshot(menuItemsQuery, snapshot => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          isAvailable: data.isAvailable !== false,
          name_i18n: data.name_i18n || { es: data.name, en: '' }, // Backwards compatibility
          description_i18n: data.description_i18n || { es: data.description, en: '' }, // Backwards compatibility
          ...data,
        } as MenuItem;
      });
      setMenuItems(items);
      setLoading(false);
    }, err => {
      console.error("Error fetching menu items: ", err);
      setError('Hubo un problema al cargar tu carta.');
      setLoading(false);
    });

    return () => {
      unsubscribeCategories();
      unsubscribeMenuItems();
    };
  }, [user, authLoading]);

  const handleDelete = async () => {
    if (!itemToDelete || !user) return;
    const itemName = itemToDelete.name_i18n?.es || itemToDelete.name;
    try {
      await deleteDoc(doc(db, 'restaurants', user.uid, 'menuItems', itemToDelete.id));
      toast({ title: 'Plato eliminado', description: `El plato "${itemName}" ha sido eliminado.` });
    } catch (error) {
      toast({ title: 'Error al eliminar', variant: 'destructive' });
    } finally {
      setItemToDelete(null);
    }
  };

  const handleAvailabilityToggle = async (item: MenuItem, newStatus: boolean) => {
    if (!user) return;
    const itemName = item.name_i18n?.es || item.name;
    const docRef = doc(db, 'restaurants', user.uid, 'menuItems', item.id);
    try {
      await updateDoc(docRef, { isAvailable: newStatus });
      toast({ title: 'Disponibilidad actualizada', description: `El plato '${itemName}' ahora está ${newStatus ? 'disponible' : 'no disponible'}.` });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar la disponibilidad.', variant: 'destructive' });
    }
  };

  const handleViewPublicMenu = () => {
    if (restaurantSlug) {
      window.open(`/menu/${restaurantSlug}`, '_blank');
    } else {
      toast({ title: 'Generando enlace', description: 'Espera un segundo y vuelve a intentarlo.', variant: 'destructive' });
    }
  };

  const menuByCategory = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      const categoryId = item.categoryId || item.category || 'uncategorized';
      if (!acc[categoryId]) acc[categoryId] = [];
      acc[categoryId].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [menuItems]);

  const renderContent = () => {
    if (loading || authLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (error) return <div className="bg-destructive/10 p-12 text-center mt-8"><p>{error}</p></div>;
    if (menuItems.length === 0) return <div className="border-dashed p-12 text-center mt-8"><h3 className='font-semibold'>Tu carta está vacía</h3><p>¡Añade tu primer plato!</p></div>;

    return (
      <Accordion type="single" collapsible className="w-full space-y-4 mt-8">
        {categories.map(category => {
          const items = menuByCategory[category.id] || [];
          if (items.length === 0) return null;

          return (
            <AccordionItem value={category.id} key={category.id} className="border rounded-2xl overflow-hidden shadow-sm bg-white">
              <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:no-underline">
                <span>{category.name_i18n.es} <span className="font-normal text-muted-foreground">({items.length})</span></span>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <ul className="-mx-6 divide-y">
                  {items.map((item) => {
                    const itemAllergens = Object.keys(item.allergens || {}).map(id => allergensMap.get(id)).filter(Boolean) as Allergen[];
                    const name_i18n = item.name_i18n || { es: item.name || '' };
                    const description_i18n = item.description_i18n || { es: item.description || '' };

                    return (
                      <li key={item.id} className={cn("flex flex-col sm:flex-row sm:items-start justify-between px-6 py-4", !item.isAvailable && "opacity-50")}>
                        <div className="flex-1 min-w-0 mr-6">
                          <div className='flex items-center'>
                             <h3 className="font-bold text-lg">{name_i18n.es}</h3>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="ml-2">
                                       <Languages className={cn("h-5 w-5", name_i18n.en ? 'text-blue-600' : 'text-gray-300')} />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{name_i18n.en ? 'Traducido al inglés' : 'Traducción automática pendiente'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                          </div>
                          {description_i18n.es && <p className="text-muted-foreground text-sm mt-1">{description_i18n.es}</p>}
                          {itemAllergens.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              {itemAllergens.map(allergen => (
                                <TooltipProvider key={allergen.id}><Tooltip><TooltipTrigger>
                                  <div className="h-5 w-5 rounded-full flex items-center justify-center" style={{ backgroundColor: allergen.color }}>
                                    <AllergenIcon allergenId={allergen.id} className="h-3 w-3 text-white" />
                                  </div>
                                </TooltipTrigger><TooltipContent><p>{allergen.name}</p></TooltipContent></Tooltip></TooltipProvider>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between flex-shrink-0 mt-4 sm:mt-0 w-full sm:w-auto space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch id={`available-${item.id}`} checked={item.isAvailable} onCheckedChange={(c) => handleAvailabilityToggle(item, c)} />
                            <Label htmlFor={`available-${item.id}`} className="text-sm">{item.isAvailable ? 'Disponible' : 'Agotado'}</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <span className="font-bold text-lg">{(item.price / 100).toFixed(2).replace('.', ',')}€</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/menu/edit/${item.id}`)}><FilePenLine className="mr-2 h-4 w-4"/>Editar</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setItemToDelete(item)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Eliminar</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    );
  };

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold">Mi Carta</h1>
          <p className="text-muted-foreground">Gestiona los platos y categorías de tu restaurante.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <Button id="tour-add-dish-button" size="lg" className="w-full font-bold rounded-full h-14 text-lg" onClick={() => router.push('/dashboard/menu/new')}><PlusCircle className="mr-2 h-4 w-4" />Añadir plato</Button>
            <Button id="tour-manage-categories-button" size="lg" variant="outline" className="w-full font-bold rounded-full h-14 text-lg" onClick={() => router.push('/dashboard/menu/categories')}><LayoutGrid className="mr-2 h-4 w-4" />Categorías</Button>
            <Button id="tour-view-public-menu-button" size="lg" variant="outline" className="w-full font-bold rounded-full h-14 text-lg" onClick={handleViewPublicMenu} disabled={!restaurantSlug}><Eye className="mr-2 h-4 w-4" />Ver carta</Button>
        </div>
      </header>
      <main>{renderContent()}</main>
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminarlo?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. El plato se eliminará permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} variant="destructive">Sí, eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
