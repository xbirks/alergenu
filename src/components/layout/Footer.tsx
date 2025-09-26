
import Link from 'next/link';
import Image from 'next/image';

export function LegalFooter() {
  return (
    <footer className="w-full mt-auto text-center text-xs text-muted-foreground p-4 flex flex-col items-center">
      <Link href="/dashboard" className="mb-4">
        <Image
          src="/alergenu.png" 
          alt="Alergenu Logo"
          width={120} 
          height={40}
        />
      </Link>
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
      <p className="max-w-2xl mt-2 text-xxs">
        La información sobre alérgenos es gestionada íntegramente por cada restaurante. Alergenu no verifica la exactitud de los datos mostrados, siendo responsabilidad exclusiva del establecimiento garantizar que la información es correcta y está actualizada.
      </p>
    </footer>
  );
}
