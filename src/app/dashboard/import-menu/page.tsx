'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MenuUploadHero } from '@/components/landing/MenuUploadHero';
import { AnimatedProgressBar } from '@/components/landing/AnimatedProgressBar';
import { MenuReviewTable } from '@/components/dashboard/MenuReviewTable';
import { LegalDisclaimerCard } from '@/components/dashboard/LegalDisclaimerCard';
import { UpsellModal } from '@/components/dashboard/UpsellModal';
import { DetectedMenuItem } from '@/ai/menuPhotoAnalysis';
import { checkUsageLimit, incrementUsage } from '@/lib/usageTracking';
import { auth } from '@/lib/firebase/firebase';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

type ImportState = 'idle' | 'analyzing' | 'review' | 'error';

export default function ImportMenuPage() {
    const router = useRouter();
    const [state, setState] = useState<ImportState>('idle');
    const [analyzedItems, setAnalyzedItems] = useState<DetectedMenuItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [legalAccepted, setLegalAccepted] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    // Usage tracking
    const [usageData, setUsageData] = useState({ canUpload: true, remaining: 5, total: 5, used: 0 });
    const [showUpsellModal, setShowUpsellModal] = useState(false);

    useEffect(() => {
        // Check usage limit on mount
        const checkUsage = async () => {
            const user = auth.currentUser;
            if (!user) {
                router.push('/login');
                return;
            }

            const usage = await checkUsageLimit(user.uid);
            setUsageData(usage);

            if (!usage.canUpload) {
                setShowUpsellModal(true);
            }
        };

        checkUsage();
    }, [router]);

    const handleFileSelected = async (file: File) => {
        const user = auth.currentUser;
        if (!user) {
            toast.error('Debes iniciar sesión para continuar');
            router.push('/login');
            return;
        }

        if (!usageData.canUpload) {
            setShowUpsellModal(true);
            return;
        }

        setState('analyzing');
        setErrorMessage('');
        setSuggestions([]);

        try {
            const token = await user.getIdToken();
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/analyze-menu-photo', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error === 'limit_reached') {
                    setErrorMessage(data.message);
                    setState('error');
                    setShowUpsellModal(true);
                    return;
                }

                throw new Error(data.message || 'Error al analizar la imagen');
            }

            // Handle quality issues
            if (!data.success && data.qualityIssue) {
                setErrorMessage(data.message);
                setSuggestions(data.suggestions || []);
                setState('error');

                // Update remaining count
                setUsageData(prev => ({ ...prev, remaining: data.remaining, used: prev.used + 1 }));
                return;
            }

            // Success!
            setAnalyzedItems(data.items);
            setCategories(data.detectedCategories);
            setState('review');

            // Update remaining count
            setUsageData(prev => ({ ...prev, remaining: data.remaining, used: prev.used + 1 }));

            toast.success(`✅ ${data.items.length} platos detectados correctamente`);

        } catch (error) {
            console.error('Error analyzing menu:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
            setState('error');
            toast.error('Error al analizar la imagen');
        }
    };

    const handleItemsConfirmed = async (items: DetectedMenuItem[]) => {
        if (!legalAccepted) {
            toast.error('Debes aceptar el disclaimer legal para continuar');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            toast.error('Debes iniciar sesión para continuar');
            router.push('/login');
            return;
        }

        setIsImporting(true);

        try {
            // Import items to Firestore
            const menuItemsRef = collection(db, 'users', user.uid, 'menuItems');

            for (const item of items) {
                await addDoc(menuItemsRef, {
                    name: item.name_i18n.es,
                    name_i18n: item.name_i18n,
                    description: item.description_i18n?.es || '',
                    description_i18n: item.description_i18n || { es: '', en: '' },
                    price: item.price,
                    category: item.category,
                    allergens: item.allergens,
                    traces: [], // Can be edited later
                    isAvailable: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }

            toast.success(`🎉 ${items.length} platos importados correctamente`);
            router.push('/dashboard/dishes');

        } catch (error) {
            console.error('Error importing items:', error);
            toast.error('Error al importar los platos');
        } finally {
            setIsImporting(false);
        }
    };

    const handleTryAgain = () => {
        setState('idle');
        setErrorMessage('');
        setSuggestions([]);
        setLegalAccepted(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Camera className="w-8 h-8 text-blue-600" />
                            Importar Carta desde Foto
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Sube una foto de tu carta y la IA extraerá todos los platos automáticamente
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/dashboard/dishes')}
                    >
                        Volver a mis platos
                    </Button>
                </div>

                {/* Usage Counter */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-900">
                                Análisis de imágenes
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                                Has usado <strong>{usageData.used}</strong> de <strong>{usageData.total}</strong> análisis
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                                {usageData.remaining}
                            </p>
                            <p className="text-xs text-blue-700">restantes</p>
                        </div>
                    </div>
                    {usageData.remaining <= 2 && usageData.remaining > 0 && (
                        <p className="text-xs text-orange-600 mt-2">
                            ⚠️ Te quedan pocos análisis. Considera comprar más créditos.
                        </p>
                    )}
                </div>
            </div>

            {/* Content */}
            {state === 'idle' && (
                <MenuUploadHero
                    onFileSelected={handleFileSelected}
                    isAnalyzing={false}
                />
            )}

            {state === 'analyzing' && (
                <div className="max-w-2xl mx-auto">
                    <AnimatedProgressBar isActive={true} />
                    <p className="text-center text-gray-600 mt-8">
                        Esto puede tardar unos 30 segundos. ¡Merece la pena la espera! ☕
                    </p>
                </div>
            )}

            {state === 'review' && (
                <div className="space-y-8">
                    <MenuReviewTable
                        items={analyzedItems}
                        categories={categories}
                        onItemsConfirmed={handleItemsConfirmed}
                    />

                    <LegalDisclaimerCard onAcceptChange={setLegalAccepted} />

                    <div className="flex justify-end">
                        <Button
                            onClick={() => handleItemsConfirmed(analyzedItems)}
                            disabled={!legalAccepted || isImporting}
                            size="lg"
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isImporting ? 'Importando...' : `Importar ${analyzedItems.length} platos`}
                        </Button>
                    </div>
                </div>
            )}

            {state === 'error' && (
                <div className="max-w-2xl mx-auto">
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Ups, algo no ha ido bien</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>

                    {suggestions.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                            <h3 className="font-semibold text-blue-900 mb-3">
                                💡 Consejos para mejorar la foto:
                            </h3>
                            <ul className="space-y-2">
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">•</span>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="text-center">
                        <Button onClick={handleTryAgain} size="lg">
                            Intentar de nuevo
                        </Button>
                        <p className="text-sm text-gray-600 mt-4">
                            Te quedan {usageData.remaining} análisis restantes
                        </p>
                    </div>
                </div>
            )}

            {/* Upsell Modal */}
            <UpsellModal
                isOpen={showUpsellModal}
                onClose={() => setShowUpsellModal(false)}
                used={usageData.used}
                total={usageData.total}
            />
        </div>
    );
}
