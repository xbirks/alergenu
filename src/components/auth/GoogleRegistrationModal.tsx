'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase/firebase';
import { signOut } from 'firebase/auth';

interface GoogleRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (restaurantName: string, termsAccepted: boolean) => Promise<void>;
    userDisplayName?: string;
}

export function GoogleRegistrationModal({
    isOpen,
    onClose,
    onComplete,
    userDisplayName
}: GoogleRegistrationModalProps) {
    const [restaurantName, setRestaurantName] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!restaurantName || !termsAccepted) {
            setError('Por favor, completa todos los campos y acepta los términos.');
            return;
        }

        setLoading(true);
        try {
            await onComplete(restaurantName, termsAccepted);
        } catch (error: any) {
            setError(error.message || 'Error al completar el registro');
            setLoading(false);
        }
    };

    const handleClose = async () => {
        if (!loading) {
            // Si cierra sin completar, desloguear al usuario
            try {
                await signOut(auth);
            } catch (error) {
                console.error('Error signing out:', error);
            }
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        ¡Bienvenido{userDisplayName ? `, ${userDisplayName.split(' ')[0]}` : ''}!
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Solo necesitamos un dato más para completar tu registro
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div>
                        <Label htmlFor='restaurant-name' className="text-base font-bold text-gray-800 pb-2 inline-block">
                            Nombre del restaurante*
                        </Label>
                        <Input
                            id='restaurant-name'
                            required
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            className="h-12 px-5 text-base rounded-full"
                            disabled={loading}
                            placeholder="Ej: Restaurante El Sabor"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 px-2">
                            <Switch
                                id="terms"
                                checked={termsAccepted}
                                onCheckedChange={setTermsAccepted}
                                disabled={loading}
                            />
                            <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                                Acepto los <Link href="/legal/terms-of-service" className="underline" target="_blank">términos y condiciones</Link>.*
                            </Label>
                        </div>
                    </div>

                    {error && (
                        <p className='text-center text-sm text-red-600 bg-red-50 p-3 rounded-md'>
                            {error}
                        </p>
                    )}

                    <div className="pt-2">
                        <Button
                            type='submit'
                            size="lg"
                            className="w-full rounded-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                    Completando registro...
                                </>
                            ) : (
                                'Completar registro'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
