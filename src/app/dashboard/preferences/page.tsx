'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Download, FileText, History } from 'lucide-react';
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
import { ALLERGENS } from '@/lib/allergens';

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
interface MenuItem {
  id: string;
  name: string;
  name_i18n?: { es: string; en?: string };
}
interface MenuItemHistory {
  id: string;
  updatedAt: { seconds: number; };
  lastUpdatedBy: string;
  lastUpdatedByDisplayName?: string;
  name_i18n?: { es: string; en?: string };
  category_i18n?: { es: string; en?: string };
  price: number;
  isAvailable: boolean;
  description_i18n?: { es: string; en?: string };
  allergens?: { [key: string]: 'no' | 'traces' | 'yes' };
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

  // State for Legal & History Section
  const [legalAcceptance, setLegalAcceptance] = useState<LegalAcceptance | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    if (authLoading || subscriptionLoading) return; // Wait for both auth and subscription to load
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [restaurantDoc, legalDoc, menuItemsSnapshot] = await Promise.all([
          getDoc(doc(db, 'restaurants', user.uid)),
          getDoc(doc(db, 'legalAcceptances', user.uid)),
          getDocs(query(collection(db, 'restaurants', user.uid, 'menuItems')))
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

        const items = menuItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
        setMenuItems(items);

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

  const generateHistoryPdf = async () => {
    if (!selectedMenuItemId || !user) {
      toast({ title: 'Error', description: 'Por favor, selecciona un plato para generar el informe.', variant: 'destructive' });
      return;
    }
    setGeneratingPdf(true);

    try {
      const historyQuery = query(collection(db, 'restaurants', user.uid, 'menuItems', selectedMenuItemId, 'history'), orderBy('updatedAt', 'desc'));
      const historySnapshot = await getDocs(historyQuery);
      const historyData = historySnapshot.docs.map(doc => doc.data() as MenuItemHistory).reverse(); // Oldest first

      if (historyData.length === 0) {
        toast({ title: 'Historial vacío', description: 'No hay cambios registrados para este plato.' });
        return;
      }

      const selectedItem = menuItems.find(item => item.id === selectedMenuItemId);
      const docPdf = new jsPDF();
      const pageHeight = docPdf.internal.pageSize.getHeight();
      const pageWidth = docPdf.internal.pageSize.getWidth();
      const margin = 14;
      const firstColWidth = 40;
      const secondColWidth = pageWidth - margin * 2 - firstColWidth;
      const cellPadding = 3;

      // --- HEADER ---
      docPdf.setFontSize(24);
      docPdf.setFont('helvetica', 'bold');
      docPdf.setTextColor(40, 50, 60);
      docPdf.text("Alergenu", margin, 22);
      docPdf.setFontSize(10);
      docPdf.setFont('helvetica', 'normal');
      docPdf.setTextColor(100);
      docPdf.text(`Restaurante: ${restaurantName || '[No especificado]'}`, margin, 30);
      docPdf.text(`Propietario: ${ownerName || '[No especificado]'}`, margin, 35);

      // --- REPORT TITLE ---
      docPdf.setFontSize(18);
      docPdf.setFont('helvetica', 'bold');
      docPdf.setTextColor(0);
      const title = `Informe de Historial: ${selectedItem?.name_i18n?.es || selectedItem?.name || '...'}`;
      const splitTitle = docPdf.splitTextToSize(title, pageWidth - margin * 2);
      docPdf.text(splitTitle, margin, 50);
      let currentY = 55 + (splitTitle.length * 5);
      docPdf.setFontSize(10);
      docPdf.setFont('helvetica', 'normal');
      docPdf.setTextColor(150);
      docPdf.text(`Generado el: ${new Date().toLocaleString('es-ES')}`, margin, currentY);
      currentY += 15;

      // --- HISTORY LOOP ---
      for (const [index, entry] of historyData.entries()) {
        const date = new Date(entry.updatedAt.seconds * 1000).toLocaleString('es-ES');
        const userName = entry.lastUpdatedByDisplayName || 'Sistema (Registro Anterior)';

        if (currentY + 20 > pageHeight - margin) { // Check space for header
          docPdf.addPage();
          currentY = margin;
        }

        autoTable(docPdf, {
          startY: currentY,
          head: [[`Cambio #${index + 1} · ${date} · por ${userName}`]],
          headStyles: { fillColor: [41, 41, 41], textColor: 255, fontStyle: 'bold', halign: 'left' },
          theme: 'grid',
        });
        currentY = (docPdf as any).lastAutoTable.finalY;

        const price = entry.price ? `${(entry.price / 100).toFixed(2).replace('.', ',')}€` : '-';
        const availability = typeof entry.isAvailable === 'boolean' ? (entry.isAvailable ? 'Disponible' : 'No Disponible') : '-';
        const categoryName = entry.category_i18n?.es || '-';
        const description = entry.description_i18n?.es || '-';
        const allergenDetails = entry.allergens
          ? ALLERGENS.map(a => {
            const status = entry.allergens?.[a.id];
            if (status === 'yes') return `- ${a.name} (Contiene)`;
            if (status === 'traces') return `- ${a.name} (Trazas)`;
            return null;
          }).filter(Boolean).join('\n')
          : 'Sin cambios declarados.';

        const rows = [
          { label: 'Categoría', value: categoryName },
          { label: 'Descripción', value: description },
          { label: 'Precio', value: price },
          { label: 'Disponibilidad', value: availability },
          { label: 'Alérgenos', value: allergenDetails || 'Sin alérgenos declarados.' },
        ];

        docPdf.setLineWidth(0.2);
        docPdf.setFontSize(10);

        for (const row of rows) {
          docPdf.setFont('helvetica', 'bold');
          const labelLines = docPdf.splitTextToSize(row.label, firstColWidth - cellPadding * 2);
          docPdf.setFont('helvetica', 'normal');
          const valueLines = docPdf.splitTextToSize(row.value, secondColWidth - cellPadding * 2);
          const rowHeight = Math.max(labelLines.length, valueLines.length) * 5 + cellPadding * 2;

          if (currentY + rowHeight > pageHeight - margin) {
            docPdf.addPage();
            currentY = margin;
          }

          docPdf.rect(margin, currentY, firstColWidth, rowHeight);
          docPdf.rect(margin + firstColWidth, currentY, secondColWidth, rowHeight);

          docPdf.setFont('helvetica', 'bold');
          docPdf.text(labelLines, margin + cellPadding, currentY + cellPadding + 4);
          docPdf.setFont('helvetica', 'normal');
          docPdf.text(valueLines, margin + firstColWidth + cellPadding, currentY + cellPadding + 4);

          currentY += rowHeight;
        }
        currentY += 10; // Space between entries
      }

      // --- FOOTER ---
      const pageCount = (docPdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        docPdf.setPage(i);
        docPdf.setFontSize(8);
        docPdf.setTextColor(150);
        docPdf.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
      }

      docPdf.save(`historial_${(selectedItem?.name_i18n?.es || 'plato').replace(/\s+/g, '_')}.pdf`);

    } catch (e) {
      console.error(e);
      toast({ title: 'Error al generar PDF', description: 'No se pudo crear el informe. Inténtalo de nuevo.', variant: 'destructive' });
    } finally {
      setGeneratingPdf(false);
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
                <History className="h-7 w-7 text-primary" />
                <CardTitle className="text-2xl">Informe de Historial de Plato</CardTitle>
              </div>
              <CardDescription className="pt-2 text-base">Selecciona un plato para generar un informe PDF con todos sus cambios.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Select onValueChange={setSelectedMenuItemId} disabled={generatingPdf}>
                  <SelectTrigger className="flex-1 h-16 text-base px-5 rounded-full text-blue-600 font-bold">
                    <SelectValue placeholder="Selecciona un plato..." />
                  </SelectTrigger>
                  <SelectContent>
                    {menuItems.length > 0 ? (
                      menuItems.map(item => (
                        <SelectItem key={item.id} value={item.id} className="text-base py-3">{item.name_i18n?.es || item.name}</SelectItem>
                      ))
                    ) : (
                      <p className="p-4 text-sm text-muted-foreground">No tienes platos en tu carta.</p>
                    )}
                  </SelectContent>
                </Select>
                <Button onClick={generateHistoryPdf} disabled={!selectedMenuItemId || generatingPdf} size="lg" className="h-16 text-lg font-bold rounded-full w-full mt-4 sm:w-auto sm:mt-0">
                  {generatingPdf ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Generando...</> : <><FileText className="mr-2 h-5 w-5" />Generar PDF</>}
                </Button>
              </div>
            </CardContent>
          </Card>

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
