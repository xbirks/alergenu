'use client';

import { useEffect, useState } from 'react';
import { Scan, Shield, Languages, CheckCircle2, Search, Layout, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStage {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const stages: ProgressStage[] = [
    { id: 'ocr', label: 'Escaneo y OCR', icon: <Scan className="w-5 h-5" /> },
    { id: 'items', label: 'Extracción de productos', icon: <Search className="w-5 h-5" /> },
    { id: 'allergens', label: 'Detección de alérgenos', icon: <Shield className="w-5 h-5" /> },
    { id: 'structure', label: 'Categorización inteligente', icon: <Layout className="w-5 h-5" /> },
    { id: 'translation', label: 'Traducción profesional', icon: <Languages className="w-5 h-5" /> },
];

interface ProgressState {
    range: [number, number];
    label: string;
    icon: React.ReactNode;
    color: string;
}

const progressStates: ProgressState[] = [
    {
        range: [0, 20],
        label: 'Escaneando imagen...',
        icon: <Scan className="w-6 h-6" />,
        color: 'from-blue-400 to-blue-500',
    },
    {
        range: [20, 40],
        label: 'Extrayendo platos...',
        icon: <Search className="w-6 h-6" />,
        color: 'from-blue-500 to-blue-600',
    },
    {
        range: [40, 60],
        label: 'Detectando alérgenos...',
        icon: <Shield className="w-6 h-6" />,
        color: 'from-blue-600 to-indigo-600',
    },
    {
        range: [60, 75],
        label: 'Estructurando categorías...',
        icon: <Layout className="w-6 h-6" />,
        color: 'from-indigo-600 to-blue-700',
    },
    {
        range: [75, 90],
        label: 'Traduciendo al inglés...',
        icon: <Languages className="w-6 h-6" />,
        color: 'from-blue-700 to-blue-600',
    },
    {
        range: [90, 100],
        label: 'Finalizando...',
        icon: <CheckCircle2 className="w-6 h-6" />,
        color: 'from-blue-600 to-blue-500',
    },
];

interface AnimatedProgressBarProps {
    isActive: boolean;
    onComplete?: () => void;
}

export function AnimatedProgressBar({ isActive, onComplete }: AnimatedProgressBarProps) {
    const [progress, setProgress] = useState(0);
    const [currentStateIndex, setCurrentStateIndex] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setProgress(0);
            setCurrentStateIndex(0);
            return;
        }

        // Simulate progress over ~15 seconds for a snappy feel but technical enough
        const totalDuration = 18000;
        const intervalTime = 100;
        const incrementPerInterval = (100 / totalDuration) * intervalTime;

        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = Math.min(prev + incrementPerInterval, 98);

                // Update current state based on progress
                const newStateIndex = progressStates.findIndex(
                    (state) => newProgress >= state.range[0] && newProgress <= state.range[1]
                );
                if (newStateIndex !== -1 && newStateIndex !== currentStateIndex) {
                    setCurrentStateIndex(newStateIndex);
                }

                if (newProgress >= 98) {
                    onComplete?.();
                }

                return newProgress;
            });
        }, intervalTime);

        return () => clearInterval(interval);
    }, [isActive, currentStateIndex, onComplete]);

    if (!isActive) return null;

    const currentState = progressStates[currentStateIndex];

    return (
        <div className="w-full max-w-2xl mx-auto px-4 md:px-0 py-8">
            {/* Main Stage Notification */}
            <div className="flex flex-col items-center text-center mb-10">
                <div className={cn(
                    'w-28 h-28 rounded-full flex items-center justify-center shadow-2xl mb-6 bg-gradient-to-br transition-all duration-700 transform hover:scale-110 border border-white/20',
                    currentState.color
                )}>
                    <div className="text-white animate-pulse">
                        {currentState.icon}
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-blue-600 mb-2">
                    {currentState.label}
                </h3>
                <p className="text-blue-500 font-medium">
                    Procesando con Inteligencia Artificial de alta precisión
                </p>
            </div>

            {/* Stages Grid (Checklist style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {stages.map((stage, idx) => {
                    const isCompleted = progress > (idx + 1) * 20;
                    const isCurrent = progress > idx * 20 && progress <= (idx + 1) * 20;

                    return (
                        <div
                            key={stage.id}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-full border transition-all duration-500",
                                isCompleted ? "bg-blue-50 border-blue-200/50 shadow-sm" :
                                    isCurrent ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-lg scale-105" : "bg-white border-gray-200/50 opacity-60"
                            )}
                        >
                            <div className={cn(
                                "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 border",
                                isCompleted ? "bg-blue-600 text-white shadow-lg shadow-blue-200/50 border-blue-700" :
                                    isCurrent ? "bg-blue-500 text-white animate-pulse shadow-xl shadow-blue-300/50 border-blue-600" : "bg-white text-gray-400 border-gray-200"
                            )}>
                                {isCompleted ? <Check className="w-5 h-5" /> : stage.icon}
                            </div>
                            <span className={cn(
                                "font-semibold transition-colors duration-300",
                                isCompleted ? "text-blue-700" :
                                    isCurrent ? "text-blue-800" : "text-gray-400"
                            )}>
                                {stage.label}
                            </span>
                            {isCurrent && <Loader2 className="w-4 h-4 ml-auto animate-spin text-blue-600" />}
                        </div>
                    );
                })}
            </div>

            {/* Progress Central Area */}
            <div className="relative mb-12">
                <div className="relative h-10 bg-white rounded-full overflow-hidden shadow-inner border border-gray-100">
                    <div
                        className={cn(
                            'h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out relative',
                            currentState.color
                        )}
                        style={{ width: `${progress}%` }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
                    </div>
                </div>

                <div className="flex justify-between mt-5 px-2">
                    <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">IA Análisis</span>
                    <span className="text-5xl font-black text-blue-600 tabular-nums">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>


            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 10px;
                }
                @keyframes progress-flow {
                    from { background-position: 0 0; }
                    to { background-position: 40px 0; }
                }
                .animate-progress-flow {
                    animation: progress-flow 1.5s linear infinite;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
