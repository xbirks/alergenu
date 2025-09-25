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
  getDocs
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2, ArrowLeft, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
}

const PREDEFINED_CATEGORIES = [
  'Entrantes',
  'Platos Principales',
  'Arroces',
  'Hamburguesas',
  'Tapas y Raciones',
  'Postres',
  'Bebidas',
  'Vinos',
  'Cafés e Infusiones',
];

export default function CategoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect for listening to real-time category changes
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const categoriesCollection = collection(db, 'restaurants', user.uid, 'categories');
    const q = query(categoriesCollection, orderBy('name'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const fetchedCategories = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name as string }));
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

  // Effect for one-time seeding of predefined categories
  useEffect(() => {
    if (!user) return;

    const seededFlag = `seeded_categories_${user.uid}`;
    if (localStorage.getItem(seededFlag)) {
      return;
    }

    const categoriesCollection = collection(db, 'restaurants', user.uid, 'categories');
    
    const checkAndSeed = async () => {
      try {
        const snapshot = await getDocs(categoriesCollection);
        if (snapshot.empty) {
          const batch = writeBatch(db);
          PREDEFINED_CATEGORIES.forEach(name => {
            const docRef = doc(categoriesCollection);
            batch.set(docRef, { name, createdAt: serverTimestamp() });
          });
          await batch.commit();
          toast({ title: 'Categorías de ejemplo creadas', description: 'Hemos añadido algunas para que empieces.' });
        }
        localStorage.setItem(seededFlag, 'true');
      } catch (error) {
        console.error("Error seeding categories: ", error);
        toast({ title: 'Error', description: 'No se pudieron crear las categorías de ejemplo.', variant: 'destructive' });
      }
    };

    checkAndSeed();

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
      await addDoc(categoriesCollection, {
        name: newCategory.trim(),
        createdAt: serverTimestamp()
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

  const handleDeleteCategory = async (categoryId: string) => {
    if (!user) return;
    try {
      const categoryDoc = doc(db, 'restaurants', user.uid, 'categories', categoryId);
      await deleteDoc(categoryDoc);
      toast({ title: 'Categoría eliminada' });
    } catch (error) {
      console.error("Error deleting category: ", error);
      toast({ title: 'Error', description: 'No se pudo eliminar la categoría.', variant: 'destructive' });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard/menu" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a mi carta
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestionar Categorías</h1>
        <p className="text-muted-foreground">Añade o elimina las categorías de tu carta.</p>
      </div>

      <form onSubmit={handleAddCategory} className="flex items-center gap-2 mb-8">
        <Input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nombre de la nueva categoría"
          className="flex-grow"
        />
        <Button type="submit" disabled={isSubmitting || newCategory.trim() === ''} className='rounded-full'>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
          <span className='ml-2 hidden sm:inline'>Añadir</span>
        </Button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Categorías existentes</h2>
        {categories.length > 0 ? (
          <ul className="border rounded-lg overflow-hidden">
            {categories.map((cat, index) => (
              <li key={cat.id} className={`flex items-center justify-between p-4 ${index > 0 ? 'border-t' : ''}`}>
                <span className="font-medium">{cat.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)} className='text-destructive rounded-full'>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          !loading && (
            <p className="text-muted-foreground text-center py-8">No tienes categorías. ¡Añade la primera!</p>
          )
        )}
      </div>
    </div>
  );
}
