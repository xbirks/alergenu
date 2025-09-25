
import Link from 'next/link';

export function LegalFooter() {
  return (
    <footer className="w-full mt-auto text-center text-xs text-muted-foreground p-4">
      <div className="mb-2">
        <Link href="/legal/terms-of-service" className="mx-2 hover:underline">
          Términos y Condiciones
        </Link>
        |
        <Link href="/legal/privacy-policy" className="mx-2 hover:underline">
          Política de Privacidad
        </Link>
        |
        <Link href="/legal/legal-notice" className="mx-2 hover:underline">
          Aviso Legal
        </Link>
      </div>
      <p>
        La información sobre alérgenos es gestionada íntegramente por cada restaurante. Alergenu no verifica la exactitud de los datos mostrados, siendo responsabilidad exclusiva del establecimiento garantizar que la información es correcta y está actualizada.
      </p>
    </footer>
  );
}
