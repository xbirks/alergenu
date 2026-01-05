'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// PDF Generation
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Custom Hooks and Components
import { useSubscription } from '@/hooks/useSubscription';
import ManageSubscriptionButton from '@/components/dashboard/ManageSubscriptionButton';

// Types
interface LegalAcceptance {
  userId: string;
  version: string;
  ipAddress: string;
  acceptedAt: { seconds: number; nanoseconds: number; };
}

// The main component
export default function PreferencesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(false);
  const { toast } = useToast();
  const { subscriptionStatus, isLoading: subscriptionLoading } = useSubscription();

  // State for Preferences Form
  const [restaurantName, setRestaurantName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // State for Legal Section
  const [legalAcceptance, setLegalAcceptance] = useState<LegalAcceptance | null>(null);

  useEffect(() => {
    if (authLoading || subscriptionLoading) return; // Wait for both auth and subscription to load
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [restaurantDoc, legalDoc] = await Promise.all([
          getDoc(doc(db, 'restaurants', user.uid)),
          getDoc(doc(db, 'legalAcceptances', user.uid))
        ]);

        if (restaurantDoc.exists()) {
          const data = restaurantDoc.data();
          setRestaurantName(data.restaurantName || '');
          setOwnerName(data.ownerName || '');
          setStripeCustomerId(data.stripeCustomerId || null); // Fetch Stripe Customer ID
        } else {
          setError('No se encontraron datos del restaurante.');
        }

        if (legalDoc.exists()) {
          setLegalAcceptance(legalDoc.data() as LegalAcceptance);
        }

      } catch (err) {
        setError('Error al cargar los datos de la página.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router, subscriptionLoading]); // Add subscriptionLoading to dependencies

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      const docRef = doc(db, 'restaurants', user.uid);
      await updateDoc(docRef, { restaurantName, ownerName });
      setSuccess(true);
      toast({ title: '¡Éxito!', description: 'Tus datos han sido actualizados.' });
    } catch (err) {
      setError('Ocurrió un error al guardar los cambios.');
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const generateLegalPdf = () => {
    if (!legalAcceptance || !user) return;
    const docPdf = new jsPDF();
    const acceptanceDate = legalAcceptance.acceptedAt ? new Date(legalAcceptance.acceptedAt.seconds * 1000).toLocaleString('es-ES') : 'N/A';
    docPdf.setFontSize(18);
    docPdf.text('Justificante de Aceptación de Términos', 14, 22);
    docPdf.setFontSize(11);
    docPdf.text(`Fecha de emisión: ${new Date().toLocaleString('es-ES')}`, 14, 30);
    autoTable(docPdf, {
      startY: 40,
      head: [['Concepto', 'Valor']],
      body: [
        ['ID de Usuario', legalAcceptance.userId],
        ['Email de Registro', user.email || 'N/A'],
        ['Fecha de Aceptación', acceptanceDate],
        ['Dirección IP', legalAcceptance.ipAddress],
        ['Versión de Términos', legalAcceptance.version],
      ],
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
    });
    docPdf.save(`justificante-legal-${user.uid.substring(0, 5)}.pdf`);
  };

  if (loading || authLoading || subscriptionLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // Determine if the user has a relevant subscription state for showing the Stripe button
  const hasPaidOrIsPaying = stripeCustomerId && subscriptionStatus !== 'trialing' && subscriptionStatus !== null;

  return (
    <div className="space-y-12">
      <section>
        <header className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Tus Datos</h2>
          <p className="text-muted-foreground mt-1">Modifica los datos principales de tu restaurante y tu cuenta.</p>
        </header>
        <form onSubmit={handleSave} className="max-w-xl space-y-8">
          <div className="grid gap-3">
            <Label htmlFor="restaurantName" className="text-lg font-bold text-gray-800">Nombre del restaurante</Label>
            <Input
              id="restaurantName"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              disabled={saving}
              className={cn("h-14 px-5 text-base rounded-full", restaurantName && "text-blue-600 font-bold")}
            />
            <p className="text-xs text-muted-foreground ml-5">Cambiar este nombre no afectará a tu QR, que tiene una dirección única.</p>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="ownerName" className="text-lg font-bold text-gray-800">Tu nombre y apellidos</Label>
            <Input
              id="ownerName"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              disabled={saving}
              className={cn("h-14 px-5 text-base rounded-full", ownerName && "text-blue-600 font-bold")}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-start gap-4 items-center pt-4">
            <Button type="submit" disabled={saving} size="lg" className="h-16 rounded-full font-bold text-lg w-full sm:w-auto px-10">
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : 'Guardar cambios'}
            </Button>
            {success && <p className="text-sm text-green-600 font-semibold">¡Guardado!</p>}
          </div>
        </form>
      </section>

      <section>
        <header className="mb-8 border-t pt-12">
          <h2 className="text-3xl font-bold tracking-tight">Informes y Justificantes</h2>
          <p className="text-muted-foreground mt-1">Genera documentos importantes para la seguridad jurídica de tu negocio.</p>
        </header>
        <div className="space-y-8 max-w-2xl">
          <Card className="bg-slate-50 border-0 shadow-none">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Download className="h-7 w-7 text-green-600" />
                <CardTitle className="text-2xl">Justificante de Alta</CardTitle>
              </div>
              <CardDescription className="pt-2 text-base">Descarga el certificado de aceptación de términos y condiciones.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={generateLegalPdf} variant="outline" size="lg" className="h-14 text-lg font-bold rounded-full w-full sm:w-auto" disabled={!legalAcceptance}>
                <Download className="mr-2 h-5 w-5" /> Descargar Justificante
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {user && stripeCustomerId && hasPaidOrIsPaying && (
        <ManageSubscriptionButton userId={user.uid} isSubscribed={hasPaidOrIsPaying} />
      )}
    </div>
  );
}
