
"use client";

import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase"; // Client-side auth
import { createImpersonationToken } from "./actions"; // Server action
import { useRouter } from "next/navigation";
import { useState } from "react";

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
        <div>
            <button 
                onClick={handleImpersonation} 
                disabled={isLoading || !uid}
                style={isLoading || !uid ? styles.buttonLoading : styles.button}
                title={!uid ? "No se puede suplantar: falta el UID del propietario" : "Iniciar sesión como propietario de este restaurante"}
            >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión como este usuario"}
            </button>
            {error && <p style={styles.errorText}>{error}</p>}
        </div>
    );
}


const styles: { [key: string]: React.CSSProperties } = {
    button: {
        backgroundColor: '#4a90e2',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 500,
        width: '100%',
        transition: 'background-color 0.2s',
    },
    buttonLoading: {
        backgroundColor: '#a0aec0', // greyed out
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'not-allowed',
        fontSize: '0.9rem',
        fontWeight: 500,
        width: '100%',
    },
    errorText: {
        color: '#d9534f', // red
        fontSize: '0.8rem',
        marginTop: '5px',
    }
};