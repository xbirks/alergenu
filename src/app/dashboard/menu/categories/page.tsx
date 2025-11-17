'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { 
  collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, 
  serverTimestamp, writeBatch, getDocs, where
} from 'firebase/firestore';
import { I18nString } from '@/types/i18n';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Trash2, ArrowLeft, PlusCircle, FilePenLine, ArrowUp, ArrowDown, AlertTriangle, Languages, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

interface Category {
  id: string;
  name_i18n: I18nString;
  order: number;
  startTime?: string;
  endTime?: string;
}

interface EditCategoryState {
  id: string;
  name_es: string;
  name_en: string;
  hasTimer: boolean;
  startTime: string;
  endTime: string;
}

async function translateText(text: string, targetLang: string = 'en'): Promise<string> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang }),
    });
    if (!response.ok) throw new Error('Translation failed');
    const data = await response.json();
    return data.translatedText || '';
  } catch (error) {
    console.error('Error during translation:', error);
    return '';
  }
}

export default function CategoriesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<EditCategoryState | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<Category | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const categoriesCollection = collection(db, 'restaurants', user.uid, 'categories');
    const q = query(categoriesCollection, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const fetchedCategories = snapshot.docs.map(doc => ({
          id: doc.id,
          name_i18n: doc.data().name_i18n || { es: doc.data().name, en: '' },
          order: doc.data().order,
          startTime: doc.data().startTime,
          endTime: doc.data().endTime,
        }));
        setCategories(fetchedCategories as Category[]);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching categories: ", error);
        toast({ title: 'Error', description: 'No se pudieron cargar las categorías.', variant: 'destructive' });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, toast]);

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || newCategoryName.trim() === '') return;

    const categoryExists = categories.some(cat => cat.name_i18n.es.toLowerCase() === newCategoryName.trim().toLowerCase());
    if (categoryExists) {
      toast({ title: 'Categoría duplicada', description: 'Ya existe una categoría con este nombre.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order || 0)) + 1 : 1;
      const translatedName = await translateText(newCategoryName.trim());

      await addDoc(collection(db, 'restaurants', user.uid, 'categories'), {
        name_i18n: { es: newCategoryName.trim(), en: translatedName },
        order: newOrder,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastUpdatedBy: user.uid,
      });

      toast({ title: 'Categoría añadida', description: translatedName ? `Traducida a: "${translatedName}"`: 'La traducción falló.' });
      setNewCategoryName('');
    } catch (error) {
      console.error("Error adding category: ", error);
      toast({ title: 'Error', description: 'No se pudo añadir la categoría.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (category: Category) => {
    setCategoryToEdit({
      id: category.id,
      name_es: category.name_i18n.es,
      name_en: category.name_i18n.en || '',
      hasTimer: !!(category.startTime && category.endTime),
      startTime: category.startTime || '08:00',
      endTime: category.endTime || '11:30',
    });
  };

  const handleUpdateCategory = async () => {
    if (!user || !categoryToEdit || !categoryToEdit.name_es.trim()) {
        toast({ title: 'Error de validación', description: 'El nombre no puede estar vacío.', variant: 'destructive' });
        return;
    }

    setIsSubmitting(true);
    const batch = writeBatch(db);
    const categoryDocRef = doc(db, 'restaurants', user.uid, 'categories', categoryToEdit.id);

    const newNameI18n: I18nString = {
        es: categoryToEdit.name_es.trim(),
        en: categoryToEdit.name_en.trim(),
    };
    
    const categoryUpdateData: any = {
        name_i18n: newNameI18n,
        updatedAt: serverTimestamp(),
        lastUpdatedBy: user.uid,
    };

    if (categoryToEdit.hasTimer) {
      categoryUpdateData.startTime = categoryToEdit.startTime;
      categoryUpdateData.endTime = categoryToEdit.endTime;
    } else {
      categoryUpdateData.startTime = null;
      categoryUpdateData.endTime = null;
    }

    try {
        batch.update(categoryDocRef, categoryUpdateData);

        const menuItemsQuery = query(
            collection(db, 'restaurants', user.uid, 'menuItems'), 
            where("categoryId", "==", categoryToEdit.id)
        );
        const menuItemsSnapshot = await getDocs(menuItemsQuery);

        menuItemsSnapshot.forEach(menuItemDoc => {
            const menuItemRef = doc(db, 'restaurants', user.uid, 'menuItems', menuItemDoc.id);
            batch.update(menuItemRef, { category_i18n: newNameI18n });
        });

        await batch.commit();
        toast({ title: 'Categoría actualizada' });
    } catch (error) {
        console.error("Error updating category: ", error);
        toast({ title: 'Error', description: 'No se pudo guardar la categoría.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
        setCategoryToEdit(null);
    }
  };

  const confirmDeleteCategory = async (category: Category) => {
    if (!user) return;

    const menuItemsQuery = query(
        collection(db, 'restaurants', user.uid, 'menuItems'), 
        where("categoryId", "==", category.id)
    );
    const menuItemsSnapshot = await getDocs(menuItemsQuery);

    if (!menuItemsSnapshot.empty) {
        toast({ 
            title: 'Borrado denegado',
            description: `La categoría "${category.name_i18n.es}" está siendo usada por ${menuItemsSnapshot.size} plato(s).`,
            variant: 'destructive',
            duration: 7000,
        });
    } else {
        setDeleteConfirmation(category);
    }
  };

  const handleDeleteCategory = async () => {
    if (!user || !deleteConfirmation) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'restaurants', user.uid, 'categories', deleteConfirmation.id));
      toast({ title: 'Categoría eliminada' });
    } catch (error) {
      console.error("Error deleting category: ", error);
      toast({ title: 'Error', description: 'No se pudo eliminar la categoría.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmation(null);
    }
  };  

  const handleReorder = async (currentIndex: number, direction: 'up' | 'down') => {
    if (!user) return;
    if ((direction === 'up' && currentIndex === 0) || (direction === 'down' && currentIndex === categories.length - 1)) return;

    const otherIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const batch = writeBatch(db);

    const categoryA = categories[currentIndex];
    const categoryB = categories[otherIndex];

    const docRefA = doc(db, 'restaurants', user.uid, 'categories', categoryA.id);
    batch.update(docRefA, { order: categoryB.order });

    const docRefB = doc(db, 'restaurants', user.uid, 'categories', categoryB.id);
    batch.update(docRefB, { order: categoryA.order });

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error reordering categories: ", error);
      toast({ title: 'Error', description: 'No se pudo actualizar el orden.', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  return (
    <>
      <div className="mb-8"><Link href="/dashboard/menu" className="inline-flex items-center gap-x-2 text-gray-600 font-semibold rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 transition-colors"><ArrowLeft className="h-4 w-4" />Volver a mi carta</Link></div>
      <div className="mb-8"><h1 className="text-3xl font-bold mb-2">Gestionar Categorías</h1><p className="text-muted-foreground">Añade, elimina, edita y ordena las categorías de tu carta.</p></div>
      
      <form onSubmit={handleAddCategory} className="flex items-center gap-3 mb-8">
        <Input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nombre (en español) de la nueva categoría"
          className="flex-grow h-14 text-base px-4 rounded-full"
        />
        <Button type="submit" disabled={isSubmitting || newCategoryName.trim() === ''} size="lg" className='h-14 rounded-full font-bold text-lg px-6'>
          {isSubmitting && !categoryToEdit ? <Loader2 className="h-5 w-5 animate-spin" /> : <PlusCircle className="h-5 w-5" />}
          <span className='ml-2 hidden sm:inline'>Añadir</span>
        </Button>
      </form>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Categorías existentes ({categories.length})</h2>
        {categories.length > 0 ? (
          <ul className="border rounded-2xl overflow-hidden bg-white shadow-sm divide-y">
            {categories.map((cat, index) => (
              <li key={cat.id} className="p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className='flex items-center'>
                        <h3 className="font-medium text-lg truncate">{cat.name_i18n.es}</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="ml-2 flex-shrink-0">
                                <Languages className={cn("h-5 w-5", cat.name_i18n.en ? 'text-blue-600' : 'text-gray-300')} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{cat.name_i18n.en ? `Traducido: "${cat.name_i18n.en}"` : 'Pendiente de traducción'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {cat.startTime && cat.endTime && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="ml-2 flex-shrink-0">
                                            <Clock className="h-5 w-5 text-amber-500" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Visible de {cat.startTime} a {cat.endTime}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                      </div>
                    </div>
                    
                    <div className='flex items-center space-x-2 flex-shrink-0'>
                        <Button variant="ghost" size="icon" onClick={() => handleStartEdit(cat)} className='h-10 w-10 rounded-full'><FilePenLine className="h-6 w-6" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDeleteCategory(cat)} className='h-10 w-10 text-destructive rounded-full'><Trash2 className="h-6 w-6" /></Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                      <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => handleReorder(index, 'up')} disabled={index === 0}>
                          <ArrowUp className="h-6 w-6" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => handleReorder(index, 'down')} disabled={index === categories.length - 1}>
                          <ArrowDown className="h-6 w-6" />
                      </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-8">No tienes categorías. ¡Añade la primera!</p>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={categoryToEdit !== null} onOpenChange={() => setCategoryToEdit(null)}>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoría</DialogTitle>
              <DialogDescription>Modifica los nombres y, si quieres, establece un horario de visibilidad.</DialogDescription>
            </DialogHeader>
            {categoryToEdit && (
              <div className="py-4 space-y-6">
                <div className='space-y-4'>
                  <div>
                    <Label htmlFor="name_es">Nombre en Español</Label>
                    <Input id="name_es" value={categoryToEdit.name_es} onChange={(e) => setCategoryToEdit(prev => prev ? {...prev, name_es: e.target.value} : null)} />
                  </div>
                  <div>
                    <Label htmlFor="name_en">Nombre en Inglés</Label>
                    <Input id="name_en" value={categoryToEdit.name_en} onChange={(e) => setCategoryToEdit(prev => prev ? {...prev, name_en: e.target.value} : null)} placeholder='(Opcional)' />
                  </div>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="timer-switch" className="text-lg font-semibold">Activar horario</Label>
                            <p className="text-sm text-muted-foreground">Define una franja horaria para esta categoría.</p>
                        </div>
                        <Switch id="timer-switch" checked={categoryToEdit.hasTimer} onCheckedChange={(checked) => setCategoryToEdit(prev => prev ? {...prev, hasTimer: checked} : null)} />
                    </div>
                    <div className={`space-y-4 transition-opacity ${!categoryToEdit.hasTimer ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        <div className="flex items-center justify-between gap-4">
                            <Label htmlFor="start-time" className="text-lg font-semibold">Desde:</Label>
                            <Input id="start-time" type="time" value={categoryToEdit.startTime} onChange={(e) => setCategoryToEdit(prev => prev ? {...prev, startTime: e.target.value} : null)} className="w-[150px]" disabled={!categoryToEdit.hasTimer}/>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <Label htmlFor="end-time" className="text-lg font-semibold">Hasta:</Label>
                            <Input id="end-time" type="time" value={categoryToEdit.endTime} onChange={(e) => setCategoryToEdit(prev => prev ? {...prev, endTime: e.target.value} : null)} className="w-[150px]" disabled={!categoryToEdit.hasTimer}/>
                        </div>
                    </div>
                </div>
              </div>
            )}
            <DialogFooter className="gap-2">
              <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
              <Button onClick={handleUpdateCategory} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Guardar
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmation !== null} onOpenChange={setDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center"><AlertTriangle className="h-6 w-6 text-destructive mr-2"/>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar "<strong>{deleteConfirmation?.name_i18n.es}</strong>"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
