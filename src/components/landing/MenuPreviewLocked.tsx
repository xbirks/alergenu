'use client';

import { Button } from '@/components/ui/button';
import { DetectedMenuItem } from '@/ai/menuPhotoAnalysis';
import { AlertCircle } from 'lucide-react';
import { AllergenIconDisplay } from '@/components/menu/allergen-icon-display';

interface MenuPreviewLockedProps {
    items: DetectedMenuItem[];
    categories: string[];
    onRegisterClick: () => void;
}

export function MenuPreviewLocked({ items, categories, onRegisterClick }: MenuPreviewLockedProps) {
    // Group items by category
    const itemsByCategory = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, DetectedMenuItem[]>);

    const formatPrice = (price: number) => {
        return (price).toFixed(2).replace('.', ',') + '€';
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Success Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-full text-l font-semibold mb-6">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    Tu carta está lista
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Así se verá en tu carta digital
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Hemos detectado <strong>{items.length} platos</strong> organizados en <strong>{categories.length} categorías</strong>
                </p>
            </div>

            {/* Mobile Mockup - EXACT copy from public-menu-client.tsx */}
            <div className="relative mb-12">
                <div className="mx-auto w-full max-w-[360px]">
                    {/* iPhone Frame */}
                    <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3.5rem] p-3 shadow-2xl">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-10" />

                        {/* Screen - WHITE background */}
                        <div className="relative bg-white rounded-[3rem] overflow-hidden" style={{ height: '720px' }}>
                            <div className="h-full overflow-y-auto">
                                {/* Header */}
                                <div className="px-3 py-6">
                                    <p className="text-xs text-blue-600">Bienvenido a la carta digital de</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'Manrope', lineHeight: '110%' }}>
                                        Tu Restaurante
                                    </h3>
                                </div>

                                {/* Menu Items - EXACT structure from lines 479-516 */}
                                <div className="space-y-10 mt-4">
                                    {categories.map(categoryName => {
                                        const categoryItems = itemsByCategory[categoryName] || [];
                                        if (categoryItems.length === 0) return null;

                                        return (
                                            <section key={categoryName} className="scroll-mt-28">
                                                {/* Category Header - EXACT from line 481 */}
                                                <div className="-mx-3">
                                                    <h2 className="bg-blue-600 text-white text-lg font-semibold px-3 py-3 tracking-normal">
                                                        {categoryName}
                                                    </h2>
                                                </div>

                                                {/* Items - EXACT from lines 486-516 */}
                                                <div className="space-y-4 mt-6 px-3">
                                                    {categoryItems.slice(0, 5).map((item, index) => (
                                                        <div key={index}>
                                                            <div className="flex justify-between items-start gap-3 mt-6">
                                                                <div className="flex-grow">
                                                                    <h3 className="font-semibold text-sm text-gray-800 tracking-normal" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>
                                                                        {item.name_i18n.es}
                                                                    </h3>
                                                                    {item.description_i18n?.es && (
                                                                        <p className="font-regular text-xs text-gray-500 mt-1 tracking-regular" style={{ fontFamily: 'Manrope', lineHeight: '130%' }}>
                                                                            {item.description_i18n.es}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <p className="font-semibold text-sm text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Manrope', lineHeight: '140%' }}>
                                                                    {formatPrice(item.price)}
                                                                </p>
                                                            </div>

                                                            {/* Allergens - Slightly smaller icons */}
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {item.allergens?.map((id: string) => (
                                                                    <AllergenIconDisplay key={`${id}-contains`} allergenId={id} type="contains" className="!w-6 !h-6" />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Validation Notice */}
            <div className="max-w-md mx-auto mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Revisa y ajusta antes de publicar</p>
                        <p>Verifica que los alérgenos y precios sean correctos. Podrás editarlos en tu panel de control.</p>
                    </div>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="text-center space-y-4 mb-20">
                <Button
                    onClick={onRegisterClick}
                    size="lg"
                    className="w-full max-w-md rounded-full h-14 text-lg font-bold"
                    style={{ backgroundColor: '#2563EB' }}
                >
                    Continuar
                </Button>

                {/* Secondary CTA */}
                <Button
                    onClick={onRegisterClick}
                    size="lg"
                    variant="outline"
                    className="w-full max-w-md rounded-full h-14 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                    Añadir más fotos
                </Button>
            </div>
        </div>
    );
}
