'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function PreferencesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Form state
  const [restaurantName, setRestaurantName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch initial data
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'restaurants', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRestaurantName(data.restaurantName || '');
          setOwnerName(data.ownerName || '');
        } else {
          setError('No se encontraron datos del restaurante.');
        }
      } catch (err) {
        setError('Error al cargar los datos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, authLoading, router]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      const docRef = doc(db, 'restaurants', user.uid);
      await updateDoc(docRef, {
        restaurantName,
        ownerName,
      });
      setSuccess(true);
    } catch (err) {
      setError('Ocurrió un error al guardar los cambios.');
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3s
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    // El layout padre (dashboard/layout.tsx) ya proporciona el <main> y el padding.
    // Este div solo necesita centrar el contenido.
    <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <form onSubmit={handleSave}>
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Preferencias</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="restaurantName">Nombre del restaurante</Label>
                  <Input
                    id="restaurantName"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    disabled={saving}
                    className="rounded-full"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ownerName">Tu nombre</Label>
                  <Input
                    id="ownerName"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    disabled={saving}
                    className="rounded-full"
                  />
                </div>
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
              </CardContent>
              <CardFooter className="flex justify-end gap-4 items-center">
                {success && <p className="text-sm text-green-600 font-semibold">¡Guardado!</p>}
                <Button type="submit" disabled={saving} className="rounded-full">
                  {saving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                  ) : (
                    'Guardar cambios'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
    </div>
  );
}
