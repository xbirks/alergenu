'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, CreditCard, Mail } from 'lucide-react';

interface UpsellModalProps {
    isOpen: boolean;
    onClose: () => void;
    used: number;
    total: number;
}

export function UpsellModal({ isOpen, onClose, used, total }: UpsellModalProps) {
    const handlePurchase = () => {
        // TODO: Integrate Stripe for one-time payment
        // Endpoint: /api/stripe/purchase-image-credits
        // Product: "menu_photo_analysis_pack_10" - 10€
        console.log('TODO: Implement Stripe payment');
        alert('Integración con Stripe pendiente. Contacta con soporte para comprar más créditos.');
    };

    const handleContact = () => {
        window.location.href = 'mailto:hola@alergenu.com?subject=Necesito más análisis de imágenes';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                        Has alcanzado el límite
                    </DialogTitle>
                    <DialogDescription>
                        Has usado tus {total} análisis de imágenes incluidos ({used}/{total})
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Offer Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
                        <div className="text-center mb-4">
                            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
                                <Sparkles className="w-4 h-4" />
                                Oferta Especial
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                10€
                            </h3>
                            <p className="text-gray-600">
                                Por 10 análisis adicionales
                            </p>
                        </div>

                        <div className="space-y-2 mb-6">
                            <BenefitItem text="10 análisis más de imágenes" />
                            <BenefitItem text="Traducción automática incluida" />
                            <BenefitItem text="Detección de alérgenos con IA" />
                            <BenefitItem text="Sin suscripción, pago único" />
                        </div>

                        <Button
                            onClick={handlePurchase}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            size="lg"
                        >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Comprar análisis adicionales
                        </Button>

                        <p className="text-xs text-center text-gray-500 mt-3">
                            Pago seguro con Stripe
                        </p>
                    </div>

                    {/* Alternative Option */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-3">
                            ¿Necesitas más de 10 análisis?
                        </p>
                        <Button
                            onClick={handleContact}
                            variant="outline"
                            className="w-full"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Contáctanos para planes personalizados
                        </Button>
                    </div>

                    {/* Manual Entry Reminder */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 text-center">
                            💡 <strong>Recuerda:</strong> Siempre puedes añadir platos manualmente sin límite
                        </p>
                    </div>
                </div>

                {/* TODO Marker for developers */}
                <div className="hidden">
                    {/* 
            TODO: Implement Stripe Integration
            - Create product in Stripe: "menu_photo_analysis_pack_10"
            - Price: 10€ (one-time payment)
            - Create endpoint: /api/stripe/purchase-image-credits
            - On success: call addPurchasedCredits(userId, 10)
            - Redirect to success page or show confirmation
          */}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function BenefitItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span>{text}</span>
        </div>
    );
}
