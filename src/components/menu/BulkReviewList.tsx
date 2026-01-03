'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch, deleteDoc, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Check, AlertTriangle, Trash2, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { MenuItem } from '@/components/lilunch/MenuItemForm';
import { AllergenSelector } from '@/components/lilunch/AllergenSelector';
import { ALLERGENS } from '@/lib/allergens';
import { cn } from '@/lib/utils';
import { CategoryCombobox } from '@/components/lilunch/CategoryCombobox';
import { useRouter } from 'next/navigation';
import { AllergenIcon } from '@/components/icons/allergens';

type ReviewMenuItem = MenuItem & { confidence?: 'high' | 'low' };

export function BulkReviewList() {
    const { user, loading: authLoading } = useAuth(false);
    const router = useRouter();
    const [items, setItems] = useState<ReviewMenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);
    // Added exitingIds for animation support
    const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

    // Fetch pending items
    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setLoading(false);
            return;
        }

        const qPending = query(
            collection(db, 'restaurants', user.uid, 'menuItems'),
            where('reviewStatus', '==', 'pending'),
            orderBy('order', 'asc')
        );

        const unsubscribe = onSnapshot(qPending, (snapshot) => {
            const fetchedItems = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    name_i18n: data.name_i18n || { es: data.name || '', en: '' },
                    price: data.price || 0,
                    allergens: data.allergens || {},
                } as ReviewMenuItem;
            });
            setItems(fetchedItems);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading]);

    const handleConfirmToggle = async (item: MenuItem, isChecked: boolean) => {
        if (!user) return;

        if (isChecked) {
            // Trigger exit animation
            setExitingIds(prev => new Set(prev).add(item.id));

            // Wait for animation (matched to CSS transition)
            await new Promise(resolve => setTimeout(resolve, 500));

            setIsSaving(true);
            try {
                const itemRef = doc(db, 'restaurants', user.uid, 'menuItems', item.id);
                await updateDoc(itemRef, { reviewStatus: null });
                toast.success('Plato validado');
            } catch (error: any) {
                console.error("Error validating:", error);
                // Revert animation if error
                setExitingIds(prev => {
                    const next = new Set(prev);
                    next.delete(item.id);
                    return next;
                });
                toast.error(`Error al validar: ${error.message || error.code || 'Inténtalo de nuevo'}`);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleDelete = async (itemId: string) => {
        if (!user) return;
        if (!confirm('¿Seguro que quieres borrar este plato?')) return;

        // Trigger exit animation
        setExitingIds(prev => new Set(prev).add(itemId));
        await new Promise(resolve => setTimeout(resolve, 500));

        setIsSaving(true);
        try {
            await deleteDoc(doc(db, 'restaurants', user.uid, 'menuItems', itemId));
            toast.success('Plato eliminado');
        } catch (error: any) {
            setExitingIds(prev => {
                const next = new Set(prev);
                next.delete(itemId);
                return next;
            });
            toast.error(`Error al eliminar: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdate = async (item: MenuItem, updates: Partial<MenuItem>) => {
        if (!user) return;

        // Optimistic UI update could be done here, but for now we rely on Firestore listener
        setIsSaving(true);
        try {
            const itemRef = doc(db, 'restaurants', user.uid, 'menuItems', item.id);
            console.log('Updating item:', item.id, 'with:', updates);
            await updateDoc(itemRef, updates);

            // Show success toast for category changes
            if (updates.categoryId) {
                toast.success('Categoría actualizada');
            }
        } catch (error: any) {
            console.error("Error updating item:", error);
            toast.error(`No se pudo guardar: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Modified to allow only ONE expanded item at a time (accordion style)
    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set<string>(); // Start fresh
            if (!prev.has(id)) {
                next.add(id); // Only add the new one if it wasn't already open
            }
            return next;
        });
    };

    const handleFinish = async () => {
        if (isSaving) {
            toast.warning('Guardando cambios pendientes, espera un momento...');
            return;
        }

        // Brief delay to ensure any immediate blur events processed
        await new Promise(resolve => setTimeout(resolve, 300));

        router.push('/dashboard/menu');
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    // Processing finished (or empty list)
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
                <div className="bg-blue-100 p-6 rounded-full inline-block animate-in zoom-in">
                    <Check className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">¡Todo revisado!</h2>
                <p className="text-lg text-gray-600 max-w-lg">
                    Ya no quedan platos pendientes de revisión.
                </p>
                <Button
                    size="lg"
                    className="rounded-full px-10 bg-blue-600 hover:bg-blue-700 h-14 text-lg shadow-lg shadow-blue-200"
                    onClick={handleFinish}
                >
                    Ir a mi Carta
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full py-8 md:space-y-8 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-blue-600 tracking-tight">
                        Revisión de Carta
                    </h1>
                    <p className="text-2xl text-gray-400 font-medium pt-1">
                        {items.length} platos pendientes
                    </p>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <Button
                        onClick={handleFinish}
                        variant="ghost"
                        className="text-gray-500 hover:text-blue-600 font-medium text-lg rounded-full"
                    >
                        Saltar revisión restante
                    </Button>
                </div>
            </div>

            {/* List Header (Desktop Only) */}
            <div className="hidden xl:grid grid-cols-[3fr_2fr_1.5fr_auto_auto] gap-6 pb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                <div>Nombre del Plato</div>
                <div>Categoría</div>
                <div className="text-right pr-4">Precio</div>
                <div className="text-right">Detalles</div>
                <div className="text-right">Acción</div>
            </div>

            {/* Items List */}
            <div className="space-y-8 md:space-y-0 md:divide-y md:divide-gray-100 md:border-t md:border-gray-100 pb-32">
                {items.map((item, idx) => {
                    const isExpanded = expandedIds.has(item.id);
                    const isExiting = exitingIds.has(item.id);

                    // Client-side robust check for low confidence
                    const hasNoAllergens = !item.allergens || Object.keys(item.allergens).length === 0;
                    const isFree = item.price === 0;
                    // We check if it is explicitly low, OR if it matches our criteria (fallback for old items)
                    const isLowConfidence = item.confidence === 'low' || hasNoAllergens || isFree;

                    // Calculate active allergens for display
                    const activeAllergens = Object.entries(item.allergens || {})
                        .filter(([_, val]) => {
                            const v = (val as string).toLowerCase();
                            return v === 'si' || v === 'yes' || v === 'trazas' || v === 'traces';
                        })
                        .map(([id]) => id);

                    return (
                        <div
                            key={item.id}
                            className={cn(
                                "group py-4 transition-all duration-500 md:hover:bg-blue-50/30",
                                isExpanded && "md:bg-blue-50/30",
                                // Mobile: Add more spacing
                                "border-b border-gray-100 md:border-none px-2 lg:px-4",
                                isExiting && "opacity-0 -translate-x-full max-h-0 py-0 my-0 overflow-hidden"
                            )}
                        >
                            {/* Desktop/Tablet Grid Layout */}
                            <div className="hidden md:grid md:grid-cols-1 xl:grid-cols-[3fr_2fr_1.5fr_auto_auto] gap-4 xl:gap-6 items-center">

                                <div className="relative">
                                    <Input
                                        defaultValue={item.name_i18n?.es}
                                        className="font-bold text-lg md:text-xl h-12 rounded-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                        placeholder="Nombre del plato"
                                        onBlur={(e) => {
                                            if (e.target.value !== item.name_i18n?.es) {
                                                const newNameI18n = {
                                                    es: e.target.value,
                                                    en: item.name_i18n?.en || ''
                                                };
                                                handleUpdate(item, {
                                                    name_i18n: newNameI18n as any
                                                });
                                            }
                                        }}
                                    />
                                    {isLowConfidence && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 animate-pulse" title="Este plato requiere revisión">
                                            <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full whitespace-nowrap">
                                                {(() => {
                                                    if (hasNoAllergens) return 'Sin alérgenos';
                                                    if (isFree) return 'Precio 0€';
                                                    return 'Revisar datos';
                                                })()}
                                            </span>
                                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                        </div>
                                    )}
                                </div>

                                <CategoryCombobox
                                    value={{
                                        id: item.categoryId || 'unknown',
                                        name_i18n: item.category_i18n || { es: 'Sin categoría', en: '' },
                                        order: 0
                                    }}
                                    onChange={(cat) => {
                                        if (cat) {
                                            handleUpdate(item, {
                                                categoryId: cat.id,
                                                category: cat.name_i18n.es, // Fix for legacy
                                                category_i18n: cat.name_i18n
                                            });
                                        }
                                    }}
                                    className="h-12 rounded-full text-lg bg-white border-gray-200"
                                />

                                {/* PRICE AND ALLERGENS COLUMN */}
                                <div className="flex flex-col items-end gap-1">
                                    <div className="relative w-full">
                                        <Input
                                            defaultValue={(item.price / 100).toFixed(2).replace('.', ',')}
                                            className="pr-10 text-right text-lg h-12 rounded-full border-gray-200 focus:border-blue-500 bg-white"
                                            onBlur={(e) => {
                                                const val = parseFloat(e.target.value.replace(',', '.'));
                                                if (!isNaN(val)) {
                                                    handleUpdate(item, { price: Math.round(val * 100) });
                                                }
                                            }}
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
                                    </div>
                                    {/* Allergen Icons Display */}
                                    <div className="flex justify-end gap-1 flex-wrap max-w-[150px]">
                                        {activeAllergens.length > 0 && activeAllergens.map(id => {
                                            const allergen = ALLERGENS.find(a => a.id === id);
                                            if (!allergen) return null;
                                            return (
                                                <div
                                                    key={id}
                                                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                                                    style={{
                                                        backgroundColor: allergen.color,
                                                        color: 'white'
                                                    }}
                                                    title={allergen.name}
                                                >
                                                    <AllergenIcon
                                                        allergenId={id}
                                                        className="w-4 h-4"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="ghost"
                                        onClick={() => toggleExpand(item.id)}
                                        className={cn(
                                            "rounded-full gap-2 px-4 h-12 hover:bg-blue-100 hover:text-blue-700",
                                            isExpanded ? "text-blue-700 bg-blue-50" : "text-gray-400"
                                        )}
                                    >
                                        <span className="text-base font-medium">Más detalles</span>
                                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </Button>

                                    <Button
                                        onClick={() => handleConfirmToggle(item, true)}
                                        disabled={isSaving}
                                        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 font-semibold shadow-md hover:shadow-lg transition-all"
                                    >
                                        <Check className="h-5 w-5 mr-2" />
                                        Validar plato
                                    </Button>
                                </div>
                            </div>

                            {/* Mobile Layout (Stacked) */}
                            <div className="md:hidden flex flex-col space-y-3 pb-2">
                                {/* Row 1: Name */}
                                <div className="relative w-full">
                                    <Input
                                        defaultValue={item.name_i18n?.es}
                                        className="font-bold text-lg h-12 rounded-full border-gray-200 focus:border-blue-500 bg-white w-full"
                                        placeholder="Nombre del plato"
                                        onBlur={(e) => {
                                            if (e.target.value !== item.name_i18n?.es) {
                                                const newNameI18n = {
                                                    es: e.target.value,
                                                    en: item.name_i18n?.en || ''
                                                };
                                                handleUpdate(item, {
                                                    name_i18n: newNameI18n as any
                                                });
                                            }
                                        }}
                                    />
                                    {isLowConfidence && <AlertTriangle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-500 animate-pulse" />}
                                </div>

                                {/* Row 2: Category */}
                                <CategoryCombobox
                                    value={{
                                        id: item.categoryId || 'unknown',
                                        name_i18n: item.category_i18n || { es: 'Sin categoría', en: '' },
                                        order: 0
                                    }}
                                    onChange={(cat) => {
                                        if (cat) {
                                            handleUpdate(item, {
                                                categoryId: cat.id,
                                                category: cat.name_i18n.es, // Fix for legacy
                                                category_i18n: cat.name_i18n
                                            });
                                        }
                                    }}
                                    className="h-12 rounded-full text-lg bg-white border-gray-200 w-full"
                                />

                                {/* Row 3: Price */}
                                <div className="relative w-full">
                                    <Input
                                        defaultValue={(item.price / 100).toFixed(2).replace('.', ',')}
                                        className="pr-10 text-left text-lg h-12 rounded-full border-gray-200 focus:border-blue-500 bg-white w-full"
                                        placeholder="Precio"
                                        onBlur={(e) => {
                                            const val = parseFloat(e.target.value.replace(',', '.'));
                                            if (!isNaN(val)) {
                                                handleUpdate(item, { price: Math.round(val * 100) });
                                            }
                                        }}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
                                </div>
                                {/* Mobile Allergen Icons */}
                                <div className="flex gap-1 flex-wrap">
                                    {activeAllergens.length > 0 && activeAllergens.map(id => {
                                        const allergen = ALLERGENS.find(a => a.id === id);
                                        if (!allergen) return null;
                                        return (
                                            <div
                                                key={id}
                                                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                                                style={{
                                                    backgroundColor: allergen.color,
                                                    color: 'white'
                                                }}
                                                title={allergen.name}
                                            >
                                                <AllergenIcon
                                                    allergenId={id}
                                                    className="w-4 h-4"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Row 4: Expand and Validate buttons */}
                                <div className="flex items-center justify-between pt-2 px-1 gap-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleExpand(item.id)}
                                        className="text-blue-600 font-medium hover:bg-transparent h-auto py-2 px-3 rounded-full"
                                    >
                                        {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                                    </Button>

                                    <Button
                                        onClick={() => handleConfirmToggle(item, true)}
                                        disabled={isSaving}
                                        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 font-semibold shadow-md hover:shadow-lg transition-all flex-1"
                                    >
                                        <Check className="h-5 w-5 mr-2" />
                                        Validar
                                    </Button>
                                </div>
                            </div>

                            {/* EXPANDED CONTENT (Common) - Removed visual container as requested */}
                            {isExpanded && (
                                <div className="mt-6 md:mx-4 animate-in slide-in-from-top-2 fade-in duration-200">
                                    <div className="grid lg:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-base font-semibold text-gray-900 block ml-1">Descripción</label>
                                            <Textarea
                                                defaultValue={item.description_i18n?.es}
                                                placeholder="Ingredientes, preparación..."
                                                className="resize-none h-32 rounded-3xl border-gray-200 p-4 text-lg focus:border-blue-500 focus:ring-blue-500 bg-white"
                                                onBlur={(e) => {
                                                    if (e.target.value !== item.description_i18n?.es) {
                                                        handleUpdate(item, {
                                                            description_i18n: { ...item.description_i18n, es: e.target.value }
                                                        });
                                                    }
                                                }}
                                            />

                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between ml-1">
                                                <label className="text-base font-semibold text-gray-900">Alérgenos</label>
                                            </div>
                                            <div className="grid grid-cols-1 gap-1">
                                                {ALLERGENS.map((allergen) => (
                                                    <div key={allergen.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                                        <span className="text-base font-medium text-gray-700 flex items-center gap-2">
                                                            {/* We could add generic icons here if needed, but keeping it simple for now */}
                                                            {allergen.name}
                                                        </span>
                                                        <AllergenSelector
                                                            value={item.allergens?.[allergen.id] || 'no'}
                                                            onChange={(val) => {
                                                                const currentAllergens = item.allergens || {};
                                                                const newAllergens = { ...currentAllergens, [allergen.id]: val };
                                                                handleUpdate(item, { allergens: newAllergens });
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-end border-t border-gray-100 pt-6 gap-3">
                                        <Button
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full h-12 px-6"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 className="h-5 w-5 mr-2" /> Eliminar plato
                                        </Button>

                                        <Button
                                            onClick={() => handleConfirmToggle(item, true)}
                                            disabled={isSaving}
                                            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 font-semibold shadow-md hover:shadow-lg transition-all"
                                        >
                                            <Check className="h-5 w-5 mr-2" />
                                            Validar plato
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer Save Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 flex justify-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Button
                    size="lg"
                    onClick={handleFinish}
                    disabled={isSaving}
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-14 px-12 text-xl shadow-xl shadow-blue-200 w-full md:w-auto font-bold"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            Guardar y Finalizar <ArrowRight className="ml-2 h-6 w-6" />
                        </>
                    )}
                </Button>
            </div>

            {/* Spacer (for fixed footer) */}
            <div className="h-28" />
        </div>
    );
}