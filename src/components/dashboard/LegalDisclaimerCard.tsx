'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LegalDisclaimerCardProps {
    onAcceptChange: (accepted: boolean) => void;
}

export function LegalDisclaimerCard({ onAcceptChange }: LegalDisclaimerCardProps) {
    const [isAccepted, setIsAccepted] = useState(false);

    const handleChange = (checked: boolean) => {
        setIsAccepted(checked);
        onAcceptChange(checked);
    };

    return (
        <div className={cn(
            'border-2 rounded-lg p-6 transition-colors',
            isAccepted ? 'border-green-300 bg-green-50' : 'border-orange-300 bg-orange-50'
        )}>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-3">
                        ⚠️ Responsabilidad del Usuario
                    </h3>

                    <div className="text-sm text-gray-700 space-y-3 mb-4">
                        <p>
                            La detección automática de alérgenos e información nutricional mediante inteligencia artificial es una{' '}
                            <strong>herramienta de ayuda</strong>, pero <strong>no sustituye la revisión manual</strong> por parte del responsable del establecimiento.
                        </p>

                        <p>
                            <strong>Usted es el único responsable</strong> de verificar que toda la información (nombres de platos, descripciones, precios y especialmente alérgenos) sea correcta y esté actualizada antes de publicarla.
                        </p>

                        <p>
                            <strong>Alergenu no se hace responsable</strong> de errores, omisiones o inexactitudes en la información generada automáticamente si no ha sido revisada y validada manualmente por el usuario.
                        </p>
                    </div>

                    <div className="bg-white border border-orange-200 rounded-lg p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                            Al marcar esta casilla, confirmo que:
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1.5">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✅</span>
                                <span>He revisado <strong>todos los platos</strong> detectados</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✅</span>
                                <span>He verificado que los <strong>alérgenos</strong> son correctos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✅</span>
                                <span>He comprobado que los <strong>precios</strong> son exactos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✅</span>
                                <span>Entiendo que soy responsable de la información publicada</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="legal-disclaimer"
                            checked={isAccepted}
                            onCheckedChange={handleChange}
                            className="mt-1"
                        />
                        <label
                            htmlFor="legal-disclaimer"
                            className="text-sm font-medium text-gray-900 cursor-pointer select-none"
                        >
                            He leído y acepto la responsabilidad de verificar toda la información antes de publicarla
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
