
import Link from 'next/link';
import Image from 'next/image';

export function LegalFooter() {
  return (
    <footer className="w-full mt-auto bg-gradient-to-b from-background to-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Column 1: About & Logo */}
          <div className="space-y-4">
            <Link href="/dashboard" className="inline-block">
              <Image
                src="/alergenu.png"
                alt="Alergenu - Gestión de Alérgenos para Restaurantes"
                width={140}
                height={47}
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plataforma profesional para la gestión de alérgenos en restaurantes. Cumple normativa y protege a tus clientes.
            </p>
          </div>

          {/* Column 2: SEO Links */}
          <div>
            <Link href="/recursos" className="font-semibold text-sm mb-4 text-foreground hover:text-primary transition-colors inline-block">
              Recursos
            </Link>
            <ul className="space-y-2.5 mt-4">
              <li>
                <Link href="/recursos/carta-qr-gratis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Carta QR gratis
                </Link>
              </li>
              <li>
                <Link href="/recursos/normativa-europea-alergenos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Normativa Europea
                </Link>
              </li>
              <li>
                <Link href="/recursos/como-hacer-carta-alergenos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cómo hacer carta de alérgenos
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">Información Legal</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/legal/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">Contacto</h3>
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:andresortega@ermo.es" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                andresortega@ermo.es
              </a>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-foreground">Síguenos</h4>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/alergenuapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/alergenu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-border space-y-3">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
            <strong>Aviso importante:</strong> La información sobre alérgenos es gestionada íntegramente por cada restaurante. Alergenu no verifica la exactitud de los datos mostrados, siendo responsabilidad exclusiva del establecimiento garantizar que la información es correcta y está actualizada.
          </p>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Alergenu. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
