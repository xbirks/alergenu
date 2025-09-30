'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { collection, onSnapshot, orderBy, query, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { Loader2, PlusCircle, MoreHorizontal, FilePenLine, Trash2, Eye, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ALLERGENS, Allergen } from '@/lib/allergens';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { AllergenIcon } from '@/components/icons/allergens';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const slugify = (text: string) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') 
    .replace(p, c => b.charAt(a.indexOf(c))) 
    .replace(/&/g, '-and-') 
    .replace(/[^\w\-]+/g, '') 
    .replace(/\-\-+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, ''); 
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  allergens?: { [key: string]: 'yes' | 'traces' | 'no' };
  isAvailable: boolean;
  createdAt: any;
}

interface Category {
  id: string;
  name: string;
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

  const allergensMap = useMemo(() => 
    new Map<string, Allergen>(ALLERGENS.map(a => [a.id, a]))
  , []);

  useEffect(() => {
    if (!user) return;
    const restaurantRef = doc(db, 'restaurants', user.uid);
    getDoc(restaurantRef).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.slug) {
          const newSlug = slugify(data.restaurantName);
          updateDoc(restaurantRef, { slug: newSlug });
          setRestaurantSlug(newSlug);
        } else {
          setRestaurantSlug(data.slug);
        }
      }
    });
  }, [user]);

 useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setError('Por favor, inicia sesión para ver tu carta.');
      setLoading(false);
      return;
    }
    
    setError(null);

    const categoriesQuery = query(collection(db, 'restaurants', user.uid, 'categories'), orderBy('name', 'asc'));
    const unsubscribeCategories = onSnapshot(categoriesQuery, snapshot => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    }, (err) => {
      console.error("Error fetching categories: ", err);
      setError('No se pudieron cargar las categorías.');
    });

    const menuItemsQuery = query(collection(db, 'restaurants', user.uid, 'menuItems'), orderBy('createdAt', 'desc'));
    const unsubscribeMenuItems = onSnapshot(menuItemsQuery, snapshot => {
      const items = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            isAvailable: data.isAvailable !== false, // Default to true if undefined
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
    try {
      await deleteDoc(doc(db, 'restaurants', user.uid, 'menuItems', itemToDelete.id));
      toast({ title: 'Plato eliminado', description: `El plato "${itemToDelete.name}" ha sido eliminado.`});
    } catch (error) {
      toast({ title: 'Error al eliminar', description: 'No se pudo eliminar el plato.', variant: 'destructive'});
    } finally {
      setItemToDelete(null);
    }
  };
  
  const handleAvailabilityToggle = async (item: MenuItem, newStatus: boolean) => {
    if (!user) return;
    const docRef = doc(db, 'restaurants', user.uid, 'menuItems', item.id);
    try {
      await updateDoc(docRef, { isAvailable: newStatus });
      toast({ 
        title: 'Disponibilidad actualizada', 
        description: `El plato \'${item.name}\' ahora está ${newStatus ? 'disponible' : 'no disponible'}.`
      });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar la disponibilidad.', variant: 'destructive' });
    }
  };

  const handleViewPublicMenu = () => {
    if (restaurantSlug) {
      window.open(`/menu/${restaurantSlug}`, '_blank');
    } else {
      toast({ title: 'Generando enlace', description: 'Aún estamos generando el enlace de tu carta, por favor, espera un segundo y vuelve a intentarlo.', variant: 'destructive'});
    }
  };

  const menuByCategory = useMemo(() => {
    const grouped: { [key: string]: MenuItem[] } = {};
    menuItems.forEach(item => {
      const category = item.category || 'Sin categoría';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  }, [menuItems]);

  const renderContent = () => {
    if (loading || authLoading) {
      return <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center mt-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" /><p className="text-muted-foreground">Cargando tu carta...</p></div>;
    }

    if (error) {
      return <div className="border-2 border-destructive/50 bg-destructive/10 rounded-lg p-12 text-center mt-8"><p className="text-destructive font-semibold">{error}</p></div>;
    }

    if (menuItems.length === 0) {
      return (
        <div className="border-2 border-dashed rounded-lg p-12 text-center mt-8">
            <h3 className='text-xl font-semibold mb-2'>Tu carta está vacía</h3>
            <p className="text-muted-foreground">¡Añade tu primer plato para empezar a construir tu menú digital!</p>
        </div>
      );
    }

    const orderedCategories = categories.map(c => c.name).sort();

    return (
      <Accordion type="single" collapsible className="w-full space-y-4 mt-8">
        {orderedCategories.map(categoryName => {
          const items = menuByCategory[categoryName] || [];
          if (items.length === 0) return null;

          const categoryId = categories.find(c => c.name === categoryName)?.id || categoryName;

          return (
            <AccordionItem value={categoryId} key={categoryId} className="border rounded-2xl overflow-hidden shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:no-underline bg-white">
                <span>{categoryName} <span className="font-normal text-muted-foreground">({items.length})</span></span>
                </AccordionTrigger>
              <AccordionContent className="px-6 bg-white">
                <ul className="-mx-6 divide-y divide-gray-200/80">
                  {items.map((item) => {
                    const itemAllergenIds = item.allergens ? Object.keys(item.allergens) : [];
                    const itemAllergens = itemAllergenIds.map(id => allergensMap.get(id)).filter(Boolean) as Allergen[];
                    return (
                       <li key={item.id} className={cn("flex flex-col sm:flex-row sm:items-start sm:justify-between px-6 py-4", !item.isAvailable && "opacity-60")}>
                        <div className="flex-1 min-w-0 mr-0 sm:mr-6">
                            <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                            {item.description && <p className="text-muted-foreground text-sm mt-1">{item.description}</p>}
                            {itemAllergens.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                {itemAllergens.map(allergen => (
                                    <TooltipProvider key={allergen.id}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                        <div className="h-5 w-5 rounded-full flex items-center justify-center" style={{ backgroundColor: allergen.color }}>
                                            <AllergenIcon allergenId={allergen.id} className="h-3 w-3 text-white" />
                                        </div>
                                        </TooltipTrigger>
                                        <TooltipContent><p>{allergen.name}</p></TooltipContent>
                                    </Tooltip>
                                    </TooltipProvider>
                                ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between flex-shrink-0 mt-4 sm:mt-0 self-end sm:self-start w-full sm:w-auto sm:space-x-4">
                            <div className="flex items-center space-x-2">
                                <Switch id={`available-${item.id}`} checked={item.isAvailable} onCheckedChange={(checked) => handleAvailabilityToggle(item, checked)}/>
                                <Label htmlFor={`available-${item.id}`} className="text-sm font-medium text-muted-foreground">{item.isAvailable ? 'Disponible' : 'Agotado'}</Label>
                            </div>
                            <div className='flex items-center space-x-4'>
                                <span className="font-bold text-lg text-right">{item.price.toFixed(2).replace('.', ',')}€</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/menu/edit/${item.id}`)}><FilePenLine className="mr-2 h-4 w-4"/>Editar</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setItemToDelete(item)} className="text-destructive focus:text-destructive/90"><Trash2 className="mr-2 h-4 w-4"/>Eliminar</DropdownMenuItem>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 md:mt-0">
            <Button size="lg" className="w-full font-bold rounded-full h-14 text-lg" onClick={() => router.push('/dashboard/menu/new')}><PlusCircle className="mr-2 h-4 w-4" />Añadir plato</Button>
            <Button size="lg" variant="outline" className="w-full font-bold rounded-full h-14 text-lg" onClick={() => router.push('/dashboard/menu/categories')}><LayoutGrid className="mr-2 h-4 w-4" />Gestionar categorías</Button>
            <Button size="lg" variant="outline" className="w-full font-bold rounded-full h-14 text-lg" onClick={handleViewPublicMenu} disabled={authLoading || !user || !restaurantSlug}><Eye className="mr-2 h-4 w-4" />Ver carta pública</Button>
        </div>
      </header>
      
      <main>
        {renderContent()}
      </main>

      <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutely seguro?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. El plato se eliminará permanentemente de tu carta.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full">Sí, eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
