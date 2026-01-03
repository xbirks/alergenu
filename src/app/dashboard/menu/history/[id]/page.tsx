'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Loader2, ArrowLeft, User, Clock, CheckCircle, AlertTriangle, VenetianMask } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ALLERGENS } from '@/lib/allergens';
import { I18nString } from '@/types/i18n';

interface MenuItemHistory {
  id: string;
  updatedAt: { seconds: number; nanoseconds: number; };
  lastUpdatedBy: string;
  name_i18n?: I18nString;
  price: number;
  isAvailable: boolean;
  description_i18n?: I18nString;
  allergens?: { [key: string]: 'no' | 'traces' | 'yes' };
  category?: { id: string, name_i18n: I18nString };
}

export default function MenuItemHistoryPage() {
  const { user } = useAuth(false);
  const params = useParams();
  const { id: menuItemId } = params;

  const [history, setHistory] = useState<MenuItemHistory[]>([]);
  const [menuItemName, setMenuItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [userDisplayData, setUserDisplayData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user || !menuItemId) return;

    const itemRef = doc(db, 'restaurants', user.uid, 'menuItems', menuItemId as string);
    getDoc(itemRef).then(docSnap => {
      if (docSnap.exists()) {
        setMenuItemName(docSnap.data().name_i18n?.es || docSnap.data().name);
      }
    });

    const historyCollection = collection(itemRef, 'history');
    const q = query(historyCollection, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MenuItemHistory[];
      setHistory(historyData);

      const userIds = [...new Set(historyData.map(h => h.lastUpdatedBy))].filter(Boolean);
      const displayDataMap: Record<string, string> = {};

      for (const uid of userIds) {
        if (!userDisplayData[uid]) {
          if (uid === 'SYSTEM') {
            displayDataMap[uid] = 'Sistema (Registro Anterior)';
          } else {
            const userDocRef = doc(db, 'users', uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              displayDataMap[uid] = userData.displayName || userData.email || `Usuario (${uid.substring(0, 5)}...)`;
            } else {
              displayDataMap[uid] = `ID: ${uid.substring(0, 5)}...`;
            }
          }
        }
      }
      setUserDisplayData(prev => ({ ...prev, ...displayDataMap }));

      setLoading(false);
    }, (error) => {
      console.error("Error fetching history: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, menuItemId]);

  const AllergenDisplay = ({ allergens }: { allergens?: { [key: string]: 'no' | 'traces' | 'yes' } }) => {
    const declaredAllergens = ALLERGENS.map(allergen => ({ ...allergen, status: allergens?.[allergen.id] || 'no' })).filter(a => a.status !== 'no');
    if (declaredAllergens.length === 0) return <div className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-green-500" /><span>Sin alérgenos declarados.</span></div>;
    return <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 pt-2">{declaredAllergens.map(allergen => <div key={allergen.id} className="flex items-center gap-2 text-sm">{allergen.status === 'yes' ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <VenetianMask className="h-4 w-4 text-orange-500" />}<span className="font-semibold">{allergen.name}</span><span className="text-muted-foreground">({allergen.status === 'yes' ? 'Sí' : 'Trazas'})</span></div>)}</div>;
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div>
          <Link href="/dashboard/menu" className="inline-flex items-center gap-x-2 text-gray-600 font-semibold rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 transition-colors mb-4"><ArrowLeft className="h-4 w-4" />Volver a mi carta</Link>
          <h1 className="text-4xl font-extrabold tracking-tight">Historial de Cambios</h1>
          <p className="text-lg text-muted-foreground">Para el plato: <span className="font-bold text-primary">{menuItemName}</span></p>
        </div>
      </div>
      {history.length > 0 ? (
        <div className="space-y-8">
          {history.map((entry, index) => (
            <div key={entry.id} className="border rounded-xl p-6 bg-card shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <Clock className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Cambio #{history.length - index}: {new Date(entry.updatedAt.seconds * 1000).toLocaleString('es-ES')}</h3>
              </div>
              <div className="space-y-4 pl-9">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><User className="h-4 w-4" /><span>{userDisplayData[entry.lastUpdatedBy] || 'Cargando...'}</span></div>
                  <Badge variant={entry.isAvailable ? 'default' : 'destructive'}>{entry.isAvailable ? 'Disponible' : 'No Disponible'}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div><span className="font-bold">Nombre:</span> {entry.name_i18n?.es || '-'}</div>
                  <div><span className="font-bold">Precio:</span> {(entry.price / 100).toFixed(2)}€</div>
                  <div className="col-span-2"><span className="font-bold">Descripción:</span> {entry.description_i18n?.es || '-'}</div>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Alérgenos Declarados:</h4>
                  <AllergenDisplay allergens={entry.allergens} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border-dashed border-2 rounded-lg bg-gray-50">
          <h3 className="text-2xl font-bold">Historial Vacío</h3>
          <p className="text-muted-foreground mt-2">No se han registrado cambios para este plato todavía.</p>
        </div>
      )}
    </div>
  );
}
