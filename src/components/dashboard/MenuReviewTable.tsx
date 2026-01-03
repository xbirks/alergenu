'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DetectedMenuItem } from '@/ai/menuPhotoAnalysis';
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuReviewTableProps {
    items: DetectedMenuItem[];
    categories: string[];
    onItemsConfirmed: (items: DetectedMenuItem[]) => void;
}

export function MenuReviewTable({ items: initialItems, categories, onItemsConfirmed }: MenuReviewTableProps) {
    const [items, setItems] = useState(initialItems);
    const [reviewedItems, setReviewedItems] = useState<Set<number>>(new Set());
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories));

    const allReviewed = reviewedItems.size === items.length;
    const reviewedCount = reviewedItems.size;

    const handleItemReviewed = (index: number, reviewed: boolean) => {
        const newReviewed = new Set(reviewedItems);
        if (reviewed) {
            newReviewed.add(index);
        } else {
            newReviewed.delete(index);
        }
        setReviewedItems(newReviewed);
    };

    const handleMarkAllReviewed = () => {
        if (allReviewed) {
            setReviewedItems(new Set());
        } else {
            setReviewedItems(new Set(items.map((_, i) => i)));
        }
    };

    const handleItemChange = (index: number, field: keyof DetectedMenuItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const handleConfirm = () => {
        onItemsConfirmed(items);
    };

    // Group items by category
    const itemsByCategory = items.reduce((acc, item, index) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push({ item, index });
        return acc;
    }, {} as Record<string, Array<{ item: DetectedMenuItem; index: number }>>);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Revisa los platos detectados
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {reviewedCount} de {items.length} platos revisados
                    </p>
                </div>

                <Button
                    onClick={handleMarkAllReviewed}
                    variant="outline"
                    size="sm"
                >
                    {allReviewed ? 'Desmarcar todos' : 'Marcar todos como revisados'}
                </Button>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-green-600 h-full transition-all duration-300"
                    style={{ width: `${(reviewedCount / items.length) * 100}%` }}
                />
            </div>

            {/* Items by Category */}
            <div className="space-y-4">
                {Object.entries(itemsByCategory).map(([category, categoryItems]) => {
                    const isExpanded = expandedCategories.has(category);
                    const categoryReviewed = categoryItems.every(({ index }) => reviewedItems.has(index));

                    return (
                        <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {isExpanded ? (
                                        <ChevronDown className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    )}
                                    <h3 className="font-semibold text-gray-900">{category}</h3>
                                    <Badge variant="secondary">
                                        {categoryItems.length} platos
                                    </Badge>
                                    {categoryReviewed && (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    )}
                                </div>
                            </button>

                            {/* Category Items */}
                            {isExpanded && (
                                <div className="divide-y divide-gray-200">
                                    {categoryItems.map(({ item, index }) => (
                                        <ItemRow
                                            key={index}
                                            item={item}
                                            index={index}
                                            isReviewed={reviewedItems.has(index)}
                                            categories={categories}
                                            onReviewedChange={(reviewed) => handleItemReviewed(index, reviewed)}
                                            onItemChange={(field, value) => handleItemChange(index, field, value)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Confirm Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleConfirm}
                    disabled={!allReviewed}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                >
                    {allReviewed ? (
                        <>
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Importar {items.length} platos
                        </>
                    ) : (
                        <>
                            <Circle className="w-5 h-5 mr-2" />
                            Revisa todos los platos para continuar
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

interface ItemRowProps {
    item: DetectedMenuItem;
    index: number;
    isReviewed: boolean;
    categories: string[];
    onReviewedChange: (reviewed: boolean) => void;
    onItemChange: (field: keyof DetectedMenuItem, value: any) => void;
}

function ItemRow({ item, index, isReviewed, categories, onReviewedChange, onItemChange }: ItemRowProps) {
    return (
        <div className={cn(
            'p-4 transition-colors',
            isReviewed ? 'bg-green-50' : 'bg-white hover:bg-gray-50'
        )}>
            <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="pt-1">
                    <Checkbox
                        checked={isReviewed}
                        onCheckedChange={onReviewedChange}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">
                                Nombre (ES)
                            </label>
                            <Input
                                value={item.name_i18n.es}
                                onChange={(e) => onItemChange('name_i18n', { ...item.name_i18n, es: e.target.value })}
                                className="font-medium"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">
                                Nombre (EN)
                            </label>
                            <Input
                                value={item.name_i18n.en}
                                onChange={(e) => onItemChange('name_i18n', { ...item.name_i18n, en: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">
                                Descripción (ES)
                            </label>
                            <Textarea
                                value={item.description_i18n?.es || ''}
                                onChange={(e) => onItemChange('description_i18n', {
                                    ...item.description_i18n,
                                    es: e.target.value
                                })}
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-gray-700 mb-1 block">
                                    Categoría
                                </label>
                                <Select
                                    value={item.category}
                                    onValueChange={(value) => onItemChange('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-700 mb-1 block">
                                    Precio (€)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={item.price}
                                    onChange={(e) => onItemChange('price', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">
                                Alérgenos detectados
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {item.allergens.length > 0 ? (
                                    item.allergens.map((allergen) => (
                                        <Badge key={allergen} variant="secondary" className="text-xs">
                                            {allergen}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-500">Sin alérgenos detectados</span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Podrás editar los alérgenos después de importar
                            </p>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">
                                Descripción (EN)
                            </label>
                            <Textarea
                                value={item.description_i18n?.en || ''}
                                onChange={(e) => onItemChange('description_i18n', {
                                    ...item.description_i18n,
                                    en: e.target.value
                                })}
                                rows={2}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
