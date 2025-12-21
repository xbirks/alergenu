'use client';

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface UnsavedChangesModalProps {
    isOpen: boolean;
    onStay: () => void;
    onLeave: () => void;
}

export function UnsavedChangesModal({ isOpen, onStay, onLeave }: UnsavedChangesModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onStay()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                        <AlertDialogTitle>¿Salir sin guardar?</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-base">
                        Tienes cambios sin guardar. Si sales ahora, perderás todos los cambios realizados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col gap-3 sm:flex-col">
                    <Button
                        onClick={onStay}
                        size="lg"
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full"
                    >
                        Quedarme y guardar
                    </Button>
                    <button
                        onClick={onLeave}
                        className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
                    >
                        Salir sin guardar
                    </button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
