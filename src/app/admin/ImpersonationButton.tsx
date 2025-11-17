
"use client";

import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase"; // Client-side auth
import { createImpersonationToken } from "./actions"; // Server action
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Import Button component
import { Loader2 } from "lucide-react"; // Import Loader2 icon
import { cn } from "@/lib/utils"; // Import cn for conditional classnames

export default function ImpersonationButton({ uid }: { uid: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImpersonation = async () => {
        setIsLoading(true);
        setError(null);

        if (!uid) {
            setError("Este restaurante no tiene un usuario asociado (no UID).");
            setIsLoading(false);
            return;
        }

        // 1. Llama a la acción del servidor para obtener el token personalizado
        const result = await createImpersonationToken(uid);

        if (result.error || !result.token) {
            setError(result.error || "No se pudo obtener el token de suplantación.");
            setIsLoading(false);
            return;
        }

        try {
            // 2. Inicia sesión con el token personalizado en el cliente
            await signInWithCustomToken(auth, result.token);

            // 3. Redirige al dashboard del cliente
            // El listener onIdTokenChanged que creamos antes se encargará de actualizar la cookie de sesión
            router.push('/dashboard');

        } catch (error: any) {
            console.error("Error al iniciar sesión con el token personalizado:", error);
            setError(`Error en el login: ${error.message}`);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Button 
                onClick={handleImpersonation} 
                disabled={isLoading || !uid}
                size="lg" // Use lg size
                className={cn(
                    "w-full font-bold rounded-full h-14 text-lg", // Apply dashboard button styling
                    isLoading ? "cursor-not-allowed opacity-70" : ""
                )}
            >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading ? "Impersonando..." : "Impersonar"}
            </Button>
            {error && <p className="text-red-500 text-xs mt-2 text-center">¡Error: {error}</p>}
        </div>
    );
}
