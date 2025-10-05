'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  getDocs,
  where,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Loader2, Trash2, ArrowLeft, PlusCircle, FilePenLine, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  order: number;
}

export default function CategoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  // One-time effect to migrate existing categories to include an 'order' field.
  useEffect(() => {
    if (!user) return;

    const migrationFlag = `migrated_category_order_${user.uid}`;
    if (localStorage.getItem(migrationFlag)) {
        return;
    }

    const categoriesCollection = collection(db, 'restaurants', user.uid, 'categories');
    const q = query(categoriesCollection, orderBy('name', 'asc'));

    getDocs(q).then(snapshot => {
        if (snapshot.empty) {
            localStorage.setItem(migrationFlag, 'true');
            return;
        }

        const needsMigration = snapshot.docs.some(doc => doc.data().order === undefined);

        if (needsMigration) {
            const batch = writeBatch(db);
            snapshot.docs.forEach((doc, index) => {
                const docRef = doc.ref;
                batch.update(docRef, { order: index + 1 });
            });

            batch.commit().then(() => {
                toast({ title: 'Sistema actualizado', description: 'Hemos actualizado el sistema de ordenación de categorías.' });
                localStorage.setItem(migrationFlag, 'true');
            }).catch(error => {
                console.error("Error migrating category order: ", error);
            });
        } else {
            localStorage.setItem(migrationFlag, 'true');
        }
    });

  }, [user, toast]);

  // Effect for listening to real-time category changes, ordered by the 'order' field.
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
          name: doc.data().name as string,
          order: doc.data().order as number,
        }));
        setCategories(fetchedCategories);
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
    if (!user || newCategory.trim() === '') return;

    const categoryExists = categories.some(cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase());
    if (categoryExists) {
      toast({ title: 'Categoría duplicada', description: 'Esta categoría ya existe.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const categoriesCollection = collection(db, 'restaurants', user.uid, 'categories');
      const newOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order || 0)) + 1 : 1;
      await addDoc(categoriesCollection, {
        name: newCategory.trim(),
        createdAt: serverTimestamp(),
        order: newOrder,
      });
      toast({ title: 'Categoría añadida' });
      setNewCategory('');
    } catch (error) {
      console.error("Error adding category: ", error);
      toast({ title: 'Error', description: 'No se pudo añadir la categoría.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReorder = async (currentIndex: number, direction: 'up' | 'down') => {
    if (!user) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === categories.length - 1) return;

    const otherIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const categoryA = categories[currentIndex];
    const categoryB = categories[otherIndex];

    const batch = writeBatch(db);
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

  const handleDeleteCategory = async (categoryId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'restaurants', user.uid, 'categories', categoryId));
      toast({ title: 'Categoría eliminada' });
    } catch (error) {
      console.error("Error deleting category: ", error);
      toast({ title: 'Error', description: 'No se pudo eliminar la categoría.', variant: 'destructive' });
    }
  };
  
  const handleStartEdit = (category: Category) => {
    setCategoryToEdit(category);
    setNewCategoryName(category.name);
  };

  const handleRenameCategory = async () => {
    if (!user || !categoryToEdit || newCategoryName.trim() === '') return;
    const newName = newCategoryName.trim();
    if (newName === categoryToEdit.name) {
      setCategoryToEdit(null);
      return;
    }

    const categoryDocRef = doc(db, 'restaurants', user.uid, 'categories', categoryToEdit.id);
    try {
        await writeBatch(db).update(categoryDocRef, { name: newName }).commit();
        toast({ title: 'Categoría actualizada' });
    } catch (error) {
        toast({ title: 'Error de actualización', variant: 'destructive' });
    } finally {
        setCategoryToEdit(null);
        setNewCategoryName('');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>
    );
  }

  return (
    <>
      <div className="mb-8"><Link href="/dashboard/menu" className="inline-flex items-center gap-x-2 text-gray-600 font-semibold rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 transition-colors"><ArrowLeft className="h-4 w-4" />Volver a mi carta</Link></div>
      <div className="mb-8"><h1 className="text-3xl font-bold mb-2">Gestionar Categorías</h1><p className="text-muted-foreground">Añade, elimina, renombra y ordena las categorías de tu carta.</p></div>
      <form onSubmit={handleAddCategory} className="flex items-center gap-3 mb-8">
        <Input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nombre de la nueva categoría"
          className="flex-grow h-14 text-base px-4 rounded-full"
        />
        <Button type="submit" disabled={isSubmitting || newCategory.trim() === ''} size="lg" className='h-14 rounded-full font-bold text-lg px-6'>
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <PlusCircle className="h-5 w-5" />}
          <span className='ml-2 hidden sm:inline'>Añadir</span>
        </Button>
      </form>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Categorías existentes</h2>
        {categories.length > 0 ? (
          <ul className="border rounded-2xl overflow-hidden bg-white shadow-sm">
            {categories.map((cat, index) => (
              <li key={cat.id} className={`flex items-center justify-between p-3 ${index > 0 ? 'border-t' : ''}`}>
                <div className="flex items-center">
                    <div className="flex flex-col mr-4 text-muted-foreground">
                        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleReorder(index, 'up')} disabled={index === 0}>
                            <ArrowUp className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleReorder(index, 'down')} disabled={index === categories.length - 1}>
                            <ArrowDown className="h-6 w-6" />
                        </Button>
                    </div>
                    <span className="font-medium text-lg">{cat.name}</span>
                </div>
                <div className='flex items-center space-x-1'>
                    <Button variant="ghost" size="icon" onClick={() => handleStartEdit(cat)} className='h-11 w-11 rounded-full text-muted-foreground'><FilePenLine className="h-6 w-6" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)} className='h-11 w-11 text-destructive rounded-full'><Trash2 className="h-6 w-6" /></Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="text-muted-foreground text-center py-8">No tienes categorías. ¡Añade la primera!</p>
        )}
      </div>
      <Dialog open={categoryToEdit !== null} onOpenChange={() => setCategoryToEdit(null)}>
        <DialogContent>
            <DialogHeader><DialogTitle>Renombrar Categoría</DialogTitle></DialogHeader>
            <div className="py-4"><Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nuevo nombre de la categoría" /></div>
            <DialogFooter className="gap-2"><DialogClose asChild><Button variant="outline" className='rounded-full'>Cancelar</Button></DialogClose><Button onClick={handleRenameCategory} className='rounded-full'>Guardar Cambios</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
