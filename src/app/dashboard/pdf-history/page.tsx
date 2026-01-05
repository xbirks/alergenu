'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getDoc, doc } from 'firebase/firestore';

// UI Components
import { Button } from '@/components/ui/button';
import { Loader2, FileText, History } from 'lucide-react';
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

// Custom Hooks
import { useSubscription } from '@/hooks/useSubscription';

// Types
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
    extras?: Array<{ name: string; price: number }>;
}

export default function PdfHistoryPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth(false);
    const { toast } = useToast();
    const { subscriptionStatus, isLoading: subscriptionLoading } = useSubscription();

    const [restaurantName, setRestaurantName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedMenuItemId, setSelectedMenuItemId] = useState<string | null>(null);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    useEffect(() => {
        if (authLoading || subscriptionLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [restaurantDoc, menuItemsSnapshot] = await Promise.all([
                    getDoc(doc(db, 'restaurants', user.uid)),
                    getDocs(query(collection(db, 'restaurants', user.uid, 'menuItems')))
                ]);

                if (restaurantDoc.exists()) {
                    const data = restaurantDoc.data();
                    setRestaurantName(data.restaurantName || '');
                    setOwnerName(data.ownerName || '');
                }

                const items = menuItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
                // Ordenar alfabéticamente por nombre
                items.sort((a, b) => {
                    const nameA = (a.name_i18n?.es || a.name || '').toLowerCase();
                    const nameB = (b.name_i18n?.es || b.name || '').toLowerCase();
                    return nameA.localeCompare(nameB, 'es');
                });
                setMenuItems(items);

            } catch (err) {
                console.error(err);
                toast({ title: 'Error', description: 'Error al cargar los datos.', variant: 'destructive' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, authLoading, router, subscriptionLoading, toast]);

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
                setGeneratingPdf(false);
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

                if (currentY + 20 > pageHeight - margin) {
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

                // ✅ NUEVO: Agregar extras
                const extrasDetails = entry.extras && entry.extras.length > 0
                    ? entry.extras.map((extra: any) => {
                        const extraPrice = extra.price ? `+${(extra.price / 100).toFixed(2).replace('.', ',')}€` : '';
                        return `- ${extra.name}: ${extraPrice}`;
                    }).join('\n')
                    : 'Sin extras.';

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
                    { label: 'Extras', value: extrasDetails }, // ✅ AGREGADO
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
                currentY += 10;
            }

            // --- FOOTER ---
            const pageCount = (docPdf as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                docPdf.setPage(i);
                docPdf.setFontSize(8);
                docPdf.setTextColor(150);
                docPdf.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
            }

            // Generar el PDF como blob y forzar descarga
            const pdfBlob = docPdf.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `historial_${(selectedItem?.name_i18n?.es || 'plato').replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast({ title: '¡PDF generado!', description: 'El historial se ha descargado correctamente.' });

        } catch (e) {
            console.error(e);
            toast({ title: 'Error al generar PDF', description: 'No se pudo crear el informe. Inténtalo de nuevo.', variant: 'destructive' });
        } finally {
            setGeneratingPdf(false);
        }
    };

    if (loading || authLoading || subscriptionLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold tracking-tight">Historial PDF</h1>
                <p className="text-muted-foreground mt-2 text-lg">Genera informes detallados del historial de cambios de tus platos.</p>
            </header>

            <Card className="max-w-3xl">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <History className="h-7 w-7 text-primary" />
                        <CardTitle className="text-2xl">Informe de Historial de Plato</CardTitle>
                    </div>
                    <CardDescription className="pt-2 text-base">
                        Selecciona un plato para generar un informe PDF con todos sus cambios, incluyendo categoría, descripción, precio, disponibilidad, extras y alérgenos.
                    </CardDescription>
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
        </div>
    );
}
