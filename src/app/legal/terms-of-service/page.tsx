import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="prose lg:prose-xl max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-5xl font-bold mb-8">Términos y Condiciones de Uso</h1>

        <h2 className="text-3xl font-bold mt-12 mb-4">1. Identificación del Titular</h2>
        <p>
            En cumplimiento de lo dispuesto por la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y comercio electrónico (LSSI-CE), se informa que el presente sitio web y la aplicación “Alergenu” son titularidad de:
        </p>
        <ul>
            <li><strong>Titular:</strong> Andrés Ortega Montoya</li>
            <li><strong>NIF:</strong> 49570884L</li>
            <li><strong>Domicilio:</strong> Plaza Rafael Atard 20A, piso 2, puerta 3, 46940, Manises, Valencia (España)</li>
            <li><strong>Correo electrónico:</strong> hola@soyandres.es</li>
            <li><strong>Teléfono de contacto:</strong> 675 392 216</li>
        </ul>
        <p>En adelante, “el Titular” o “Alergenu”.</p>

        <h2 className="text-3xl font-bold mt-12 mb-4">2. Objeto y Ámbito de Aplicación</h2>
        <p>
            Las presentes condiciones regulan el acceso, navegación y uso del sitio web y de la aplicación web Alergenu (en adelante, “la Plataforma”), así como las responsabilidades derivadas de su utilización.
        </p>
        <p>
            El acceso y uso de la Plataforma atribuyen la condición de Usuario, ya sea Restaurante (Usuario Registrado) o Cliente Final (Usuario No Registrado), implicando la aceptación plena y sin reservas de todas las disposiciones contenidas en este documento.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">3. Descripción del Servicio</h2>
        <p>
            Alergenu es una aplicación web que permite a los restaurantes digitalizar sus menús y gestionar la información de alérgenos de sus platos.
        </p>
        <p>Funcionalidades principales:</p>
        <ul>
            <li><strong>Para Restaurantes:</strong> Registro, gestión del perfil, creación y edición de menús, asignación de alérgenos, generación de códigos QR y traducción automática de los textos.</li>
            <li><strong>Para Clientes Finales:</strong> Acceso sin registro a los menús de los restaurantes, filtrado de platos en función de sus alergias y visualización en distintos idiomas.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4">4. Condiciones de Uso</h2>
        <h3 className="text-xl font-bold mt-8 mb-2">4.1. Usuarios Registrados (Restaurantes)</h3>
        <ul>
            <li>El acceso y uso de las funcionalidades para restaurantes requieren registro y autenticación mediante correo electrónico y contraseña gestionados por Firebase Authentication.</li>
            <li>El Usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de toda la información introducida en su cuenta.</li>
            <li>El Usuario garantiza que los datos proporcionados son veraces, exactos y actualizados.</li>
        </ul>

        <h3 className="text-xl font-bold mt-8 mb-2">4.2. Usuarios Finales (Clientes)</h3>
        <ul>
            <li>Los clientes acceden libremente al menú del restaurante a través de un enlace o código QR, sin necesidad de registro ni de facilitar datos personales.</li>
            <li>La selección de alérgenos se almacena únicamente en el dispositivo del usuario (mediante localStorage) y no se transmite a los servidores de Alergenu.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4">5. Responsabilidad del Contenido</h2>
        <p>
            Los restaurantes son los únicos responsables de la veracidad, exactitud y actualización de la información publicada en sus menús, incluyendo ingredientes, precios y alérgenos.
        </p>
        <p>
            Alergenu actúa como proveedor de servicio tecnológico, sin intervenir en la elaboración, validación o garantía de dicha información.
        </p>
        <p>
            El Titular no se hace responsable de posibles errores, omisiones o desactualizaciones en los menús publicados por los restaurantes.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">6. Propiedad Intelectual e Industrial</h2>
        <p>
            Todo el contenido, diseño, código fuente, logotipos, textos, gráficos e interfaces de usuario de la Plataforma son propiedad exclusiva de Andrés Ortega Montoya o de terceros licenciantes, y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial.
        </p>
        <p>
            Queda prohibida cualquier reproducción, distribución, comunicación pública, transformación o utilización sin la autorización expresa y por escrito del Titular.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">7. Uso Aceptable de la Plataforma</h2>
        <p>
            El Usuario se compromete a utilizar la Plataforma de conformidad con la ley, la moral, el orden público y los presentes Términos. En particular, se prohíbe:
        </p>
        <ul>
            <li>Introducir o difundir virus o cualquier otro sistema que pueda dañar los sistemas informáticos.</li>
            <li>Utilizar la Plataforma con fines fraudulentos o ilícitos.</li>
            <li>Acceder sin autorización a datos de otros usuarios o a áreas restringidas del sistema.</li>
        </ul>
        <p>
            El incumplimiento de estas condiciones podrá dar lugar a la suspensión o cancelación inmediata de la cuenta del Usuario infractor.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">8. Servicios de Terceros</h2>
        <p>
            La aplicación utiliza servicios de terceros para su funcionamiento, entre ellos:
        </p>
        <ul>
            <li><strong>Firebase (Google Cloud Platform):</strong> para autenticación, base de datos y alojamiento.</li>
            <li><strong>Servicios de traducción automática:</strong> empleados para traducir textos del menú a distintos idiomas.</li>
        </ul>
        <p>
            El uso de estos servicios se rige por sus propias políticas de privacidad y términos de servicio.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">9. Modificaciones del Servicio y de las Condiciones</h2>
        <p>
            El Titular se reserva el derecho a:
        </p>
        <ul>
            <li>Modificar en cualquier momento las características y funcionalidades de la Plataforma.</li>
            <li>Actualizar, revisar o cambiar los presentes Términos y Condiciones, notificándolo en el sitio web o mediante correo electrónico en caso de usuarios registrados.</li>
        </ul>
        <p>
            El uso continuado de la Plataforma tras la publicación de las modificaciones implicará su aceptación.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">10. Limitación de Responsabilidad</h2>
        <p>
            El Titular no garantiza la disponibilidad continua ni la ausencia de errores en el funcionamiento de la Plataforma.
        </p>
        <p>
            En ningún caso será responsable por:
        </p>
        <ul>
            <li>Daños derivados del uso indebido de la aplicación o de los datos proporcionados por terceros (restaurantes).</li>
            <li>Pérdidas de beneficios, interrupciones de negocio o daños indirectos.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4">11. Suspensión del Servicio</h2>
        <p>
            El Titular podrá suspender temporal o definitivamente el acceso a la Plataforma por motivos técnicos, de mantenimiento o de fuerza mayor, sin que ello genere derecho a indemnización alguna.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">12. Legislación Aplicable y Jurisdicción</h2>
        <p>
            Estas condiciones se rigen por la legislación española.
        </p>
        <p>
            Para cualquier controversia derivada del uso del servicio, las partes se someten expresamente a los Juzgados y Tribunales de Valencia (España), salvo que la normativa aplicable disponga otra cosa.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">13. Contacto</h2>
        <p>
            Para cualquier duda, queja o reclamación relacionada con estos Términos y Condiciones, puede dirigirse al Titular mediante correo electrónico a hola@soyandres.es.
        </p>
    </div>
  );
}
