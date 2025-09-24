import Link from "next/link";

export function LegalFooter() {
  return (
    <footer className="p-4 text-center text-xs text-muted-foreground border-t mt-8">
      <div className="container flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <p className="text-balance max-w-prose">
          La información sobre alérgenos es proporcionada por cada restaurante. Alergenu es una herramienta de visualización. Confirma siempre con el personal del establecimiento en caso de duda.
        </p>
        <nav className="flex gap-4 sm:gap-6 flex-wrap justify-center">
          <Link href="/legal/terms-of-service" className="hover:text-foreground">
            Términos
          </Link>
          <Link href="/legal/privacy-policy" className="hover:text-foreground">
            Privacidad
          </Link>
          <Link href="/legal/legal-notice" className="hover:text-foreground">
            Aviso Legal
          </Link>
        </nav>
      </div>
    </footer>
  );
}
