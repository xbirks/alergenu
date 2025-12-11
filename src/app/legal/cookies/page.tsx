import React from 'react';
import Link from 'next/link';

export default function CookiesPolicyPage() {
    return (
        <div className="prose lg:prose-xl max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-5xl font-bold mb-8">Política de Cookies</h1>

            <p className="text-lg text-gray-600 mb-8">
                <strong>Última actualización:</strong> Diciembre 2024
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-4">1. ¿Qué son las cookies?</h2>
            <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas una página web.
                Se utilizan para hacer que el sitio funcione de manera más eficiente, mejorar tu experiencia, y proporcionar
                información a los propietarios del sitio.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-4">2. ¿Qué cookies utiliza Alergenu?</h2>
            <p>
                En Alergenu utilizamos diferentes tipos de cookies según su finalidad:
            </p>

            <h3 className="text-xl font-bold mt-8 mb-2">2.1. Cookies Necesarias (Técnicas)</h3>
            <p>
                Estas cookies son esenciales para el funcionamiento del sitio web. Sin ellas, no podrías utilizar
                servicios básicos como el inicio de sesión o la gestión de tu cuenta.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg my-4">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2 pr-4">Cookie</th>
                            <th className="text-left py-2 pr-4">Propósito</th>
                            <th className="text-left py-2">Duración</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="py-2 pr-4 font-mono text-xs">alergenu_cookie_consent</td>
                            <td className="py-2 pr-4">Almacena tu consentimiento sobre cookies</td>
                            <td className="py-2">Persistente</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 pr-4 font-mono text-xs">alergenu_cookie_preferences</td>
                            <td className="py-2 pr-4">Guarda tus preferencias de cookies</td>
                            <td className="py-2">Persistente</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 pr-4 font-mono text-xs">firebase_auth_*</td>
                            <td className="py-2 pr-4">Gestiona la autenticación del usuario (Firebase)</td>
                            <td className="py-2">Sesión</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                <strong>Base legal:</strong> Interés legítimo - estas cookies son necesarias para la prestación del servicio
                que has solicitado (Art. 6.1.f RGPD).
            </p>

            <h3 className="text-xl font-bold mt-8 mb-2">2.2. Cookies de Preferencias (localStorage)</h3>
            <p>
                Estas cookies se almacenan localmente en tu navegador y no se transmiten a nuestros servidores:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg my-4">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2 pr-4">Item</th>
                            <th className="text-left py-2 pr-4">Propósito</th>
                            <th className="text-left py-2">Duración</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="py-2 pr-4 font-mono text-xs">alergenu_language</td>
                            <td className="py-2 pr-4">Guarda tu preferencia de idioma</td>
                            <td className="py-2">Persistente</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 pr-4 font-mono text-xs">selectedAllergens</td>
                            <td className="py-2 pr-4">Almacena tus alérgenos seleccionados (solo en tu dispositivo)</td>
                            <td className="py-2">Persistente</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                <strong>Nota importante:</strong> La información sobre tus alérgenos se almacena únicamente en tu dispositivo.
                Nunca se envía a nuestros servidores ni es accesible para Alergenu, garantizando tu privacidad y la protección
                de datos sensibles de salud.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-2">2.3. Cookies Analíticas</h3>
            <p>
                Utilizamos Google Analytics para entender cómo los visitantes utilizan nuestro sitio web. Esta información
                nos ayuda a mejorar la experiencia del usuario y el rendimiento del sitio.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg my-4">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2 pr-4">Cookie</th>
                            <th className="text-left py-2 pr-4">Propósito</th>
                            <th className="text-left py-2">Duración</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="py-2 pr-4 font-mono text-xs">_ga</td>
                            <td className="py-2 pr-4">Distingue usuarios únicos (Google Analytics)</td>
                            <td className="py-2">2 años</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 pr-4 font-mono text-xs">_ga_*</td>
                            <td className="py-2 pr-4">Mantiene el estado de la sesión (Google Analytics 4)</td>
                            <td className="py-2">2 años</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                <strong>Proveedor:</strong> Google Ireland Limited<br />
                <strong>Más información:</strong> <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">Política de cookies de Google</a><br />
                <strong>Base legal:</strong> Consentimiento del usuario (Art. 6.1.a RGPD)
            </p>
            <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
                ⚠️ <strong>Estas cookies solo se cargan si aceptas las cookies analíticas.</strong> Si no das tu consentimiento,
                Google Analytics no se cargará en absoluto.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-2">2.4. Cookies de Marketing (Futuro)</h3>
            <p>
                Actualmente no utilizamos cookies de marketing o publicidad. En el futuro, si decidimos implementarlas
                (por ejemplo, para campañas de Google Ads o Facebook Pixel), te informaremos y solicitaremos tu consentimiento
                explícito antes de activarlas.
            </p>
            <p>
                <strong>Base legal:</strong> Consentimiento del usuario (Art. 6.1.a RGPD)
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-4">3. ¿Cómo gestionar tus preferencias de cookies?</h2>
            <p>
                Puedes gestionar tus preferencias de cookies de las siguientes formas:
            </p>

            <h3 className="text-xl font-bold mt-8 mb-2">3.1. Banner de Cookies</h3>
            <p>
                Al visitar Alergenu por primera vez, verás un banner que te permite:
            </p>
            <ul>
                <li><strong>Aceptar todas:</strong> Consientes el uso de todas las cookies (necesarias, analíticas y marketing)</li>
                <li><strong>Solo necesarias:</strong> Solo se activarán las cookies esenciales para el funcionamiento del sitio</li>
                <li><strong>Configurar preferencias:</strong> Puedes seleccionar qué categorías de cookies deseas aceptar</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-2">3.2. Configuración del Navegador</h3>
            <p>
                También puedes gestionar las cookies directamente desde tu navegador:
            </p>
            <ul>
                <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</li>
                <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio</li>
                <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web</li>
                <li><strong>Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies y permisos del sitio</li>
            </ul>
            <p className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                ℹ️ <strong>Nota:</strong> Si bloqueas todas las cookies desde tu navegador, es posible que algunas funcionalidades
                del sitio no funcionen correctamente, como el inicio de sesión o la gestión de tu cuenta.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-4">4. Duración de las cookies</h2>
            <p>
                Las cookies pueden ser de sesión (se eliminan al cerrar el navegador) o persistentes (permanecen durante un
                tiempo determinado). La duración específica de cada cookie está indicada en las tablas anteriores.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-4">5. Cookies de terceros</h2>
            <p>
                Alergenu utiliza servicios de terceros que pueden establecer sus propias cookies:
            </p>
            <ul>
                <li>
                    <strong>Google Firebase:</strong> Servicio de autenticación y base de datos
                    <br />
                    <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">
                        Política de privacidad de Firebase
                    </a>
                </li>
                <li>
                    <strong>Google Analytics:</strong> Servicio de análisis web (solo con tu consentimiento)
                    <br />
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                        Política de privacidad de Google
                    </a>
                </li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-4">6. Actualización de esta política</h2>
            <p>
                Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en nuestras prácticas o
                por motivos legales. Te recomendamos revisar esta página regularmente.
            </p>
            <p>
                Si realizamos cambios significativos, te informaremos mediante un aviso destacado en el sitio web o a través
                del banner de cookies.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-4">7. Más información</h2>
            <p>
                Para más información sobre cómo tratamos tus datos personales, consulta nuestra{' '}
                <Link href="/legal/privacy-policy" className="text-primary hover:underline">
                    Política de Privacidad
                </Link>.
            </p>
            <p>
                Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos en:
            </p>
            <ul>
                <li><strong>Email:</strong> andresortega@ermo.es</li>
                <li><strong>Titular:</strong> Andrés Ortega Montoya</li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8">
                <h3 className="font-bold text-lg mb-2">✅ Compromiso con tu privacidad</h3>
                <p className="mb-0">
                    En Alergenu, tu privacidad es nuestra prioridad. Solo activamos cookies analíticas y de marketing
                    con tu consentimiento explícito. Puedes cambiar tus preferencias en cualquier momento desde el
                    banner de cookies o tu navegador.
                </p>
            </div>
        </div>
    );
}
