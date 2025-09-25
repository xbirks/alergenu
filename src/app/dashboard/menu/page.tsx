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
import { useToast } from '@/hooks/use-toast';

// Helper function to create a URL-friendly slug from a string
const slugify = (text: string) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  allergens?: string[];
  isAvailable: boolean;
}

export default function MenuPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurantSlug, setRestaurantSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const allergensMap = useMemo(() => 
    new Map<string, Allergen>(ALLERGENS.map(a => [a.id, a]))
  , []);

  // Effect to update existing restaurant with a slug if it doesn't have one
  useEffect(() => {
    if (!user) return;

    const restaurantRef = doc(db, 'restaurants', user.uid);
    
    const checkForSlug = async () => {
      try {
        const docSnap = await getDoc(restaurantRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data.slug) {
            console.log('Restaurant slug not found. Creating one...');
            const newSlug = slugify(data.restaurantName);
            await updateDoc(restaurantRef, { slug: newSlug });
            setRestaurantSlug(newSlug);
             console.log(`Slug "${newSlug}" created and saved.`);
          } else {
            setRestaurantSlug(data.slug);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error checking or updating slug: ", error);
      }
    };

    checkForSlug();
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setError('Por favor, inicia sesión para gestionar tu carta.');
      setLoading(false);
      return;
    }

    const menuItemsQuery = query(
      collection(db, 'restaurants', user.uid, 'menuItems'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(menuItemsQuery, 
      (snapshot) => {
        const items = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            isAvailable: data.isAvailable === false ? false : true,
            ...data,
          } as MenuItem;
        });
        setMenuItems(items);
        setLoading(false);
      },
      (err) => {
        console.error("Error al cargar los platos: ", err);
        setError('Hubo un problema al cargar tu carta. Inténtalo de nuevo.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user, authLoading]);

  const handleDelete = async () => {
    if (!itemToDelete || !user) return;
    try {
      const docRef = doc(db, 'restaurants', user.uid, 'menuItems', itemToDelete.id);
      await deleteDoc(docRef);
      toast({ title: 'Plato eliminado', description: `El plato "${itemToDelete.name}" ha sido eliminado.`});
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast({ title: 'Error al eliminar', description: 'No se pudo eliminar el plato. Por favor, inténtalo de nuevo.', variant: 'destructive'});
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
      console.error("Error al actualizar la disponibilidad: ", error);
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

  const renderContent = () => {
    if (loading || authLoading) {
      return (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center mt-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Cargando tu carta...</p>
        </div>
      );
    }

    if (error) {
      return (
         <div className="border-2 border-destructive/50 bg-destructive/10 rounded-lg p-12 text-center mt-8">
          <p className="text-destructive font-semibold">{error}</p>
        </div>
      );
    }

    if (menuItems.length === 0) {
      return (
        <div className="border-2 border-dashed rounded-lg p-12 text-center mt-8">
            <h3 className='text-xl font-semibold mb-2'>Tu carta está vacía</h3>
            <p className="text-muted-foreground">¡Añade tu primer plato para empezar a construir tu menú digital!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {menuItems.map((item) => {
          const itemAllergens = item.allergens?.map(id => allergensMap.get(id)).filter(Boolean) as Allergen[] || [];
          return (
            <div key={item.id} className={cn("bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col transition-opacity", !item.isAvailable && "opacity-50")}>
              <div className="p-4 pb-2 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight pr-2">{item.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/menu/edit/${item.id}`)}>
                        <FilePenLine className="mr-2 h-4 w-4"/>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setItemToDelete(item)} className="text-destructive focus:text-destructive/90">
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {item.description && (
                  <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                )}
              </div>
              
              <div className="px-4 pb-4 pt-2 mt-auto">
                {itemAllergens.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {itemAllergens.map(allergen => (
                      <div key={allergen.id} title={allergen.name}>
                        <img src={`/allergens/${allergen.icon}`} alt={allergen.name} className="h-6 w-6" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">{item.category}</span>
                  <span className="font-bold text-lg">{item.price.toFixed(2).replace('.', ',')}€</span>
                </div>
                 <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                    <Switch 
                        id={`available-${item.id}`}
                        checked={item.isAvailable}
                        onCheckedChange={(checked) => handleAvailabilityToggle(item, checked)}
                    />
                    <Label htmlFor={`available-${item.id}`} className={cn("text-sm font-medium", !item.isAvailable && "text-muted-foreground")}>
                        {item.isAvailable ? 'Disponible' : 'Agotado'}
                    </Label>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold">Mi Carta</h1>
          <p className="text-muted-foreground">Gestiona los platos y categorías de tu restaurante.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4 md:mt-0">
            <Button
                variant="outline"
                className="w-full font-bold md:w-auto shadow-sm rounded-full"
                onClick={handleViewPublicMenu}
                disabled={authLoading || !user || !restaurantSlug}
            >
                <Eye className="mr-2 h-4 w-4" />
                Ver carta pública
            </Button>
             <Button 
              variant="outline"
              className="w-full font-bold md:w-auto shadow-sm rounded-full"
              onClick={() => router.push('/dashboard/menu/categories')}>
              <LayoutGrid className="mr-2 h-4 w-4" />
              Gestionar categorías
            </Button>
            <Button 
              className="w-full font-bold md:w-auto shadow-sm rounded-full"
              onClick={() => router.push('/dashboard/menu/new')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir plato
            </Button>
        </div>
      </header>
      
      <main>
        {renderContent()}
      </main>

      <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El plato se eliminará permanentemente de tu carta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full">
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
