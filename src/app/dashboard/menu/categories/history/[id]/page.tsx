'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Loader2, ArrowLeft, User, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { I18nString } from '@/types/i18n';

const getUserEmail = async (uid: string) => {
  // This is a placeholder. In a real scenario, you might need a backend service
  // or a `users` collection to map UIDs to emails for privacy reasons.
  return `User (${uid.substring(0, 5)}...)`;
};

interface CategoryHistory {
  id: string;
  updatedAt: { seconds: number; nanoseconds: number; };
  lastUpdatedBy: string;
  name_i18n: I18nString;
  order: number;
}

export default function CategoryHistoryPage() {
  const { user } = useAuth(false);
  const params = useParams();
  const { id: categoryId } = params;

  const [history, setHistory] = useState<CategoryHistory[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user || !categoryId) return;

    const categoryRef = doc(db, 'restaurants', user.uid, 'categories', categoryId as string);
    getDoc(categoryRef).then(docSnap => {
      if (docSnap.exists()) {
        setCategoryName(docSnap.data().name_i18n.es);
      }
    });

    const historyCollection = collection(categoryRef, 'history');
    const q = query(historyCollection, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as CategoryHistory[];
      setHistory(historyData);

      const userIds = [...new Set(historyData.map(h => h.lastUpdatedBy))];
      const emailMap: Record<string, string> = {};
      for (const uid of userIds) {
        if (!userEmails[uid]) {
          emailMap[uid] = await getUserEmail(uid);
        }
      }
      setUserEmails(prev => ({ ...prev, ...emailMap }));

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, categoryId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/dashboard/menu/categories" className="inline-flex items-center gap-x-2 text-gray-600 font-semibold rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver a Categorías
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Historial de Cambios de Categoría</h1>
        <p className="text-muted-foreground">Viendo el historial para la categoría: <span className="font-semibold text-primary">{categoryName}</span></p>
      </div>

      {history.length > 0 ? (
        <div className="space-y-6">
          {history.map((entry, index) => (
            <Card key={entry.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Cambio #{history.length - index}</CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(entry.updatedAt.seconds * 1000).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{userEmails[entry.lastUpdatedBy] || 'Cargando...'}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="font-mono text-sm"><dt className="font-semibold">Nombre (ES):</dt><dd>{entry.name_i18n?.es}</dd></div>
                  <div className="font-mono text-sm"><dt className="font-semibold">Nombre (EN):</dt><dd>{entry.name_i18n?.en || '-'}</dd></div>
                  <div className="font-mono text-sm"><dt className="font-semibold">Orden:</dt><dd>{entry.order}</dd></div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <h3 className="text-xl font-semibold">No hay historial</h3>
          <p className="text-muted-foreground">Aún no se han registrado cambios para esta categoría.</p>
        </div>
      )}
    </div>
  );
}
