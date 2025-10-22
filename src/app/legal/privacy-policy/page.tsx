import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Alergenu',
  description: 'Conoce cómo Alergenu trata tus datos personales y los de tus clientes. Nuestro compromiso con la privacidad y el cumplimiento del RGPD.',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-lg max-w-none prose-p:my-4 prose-headings:my-8 prose-headings:font-bold prose-h2:text-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Política de Privacidad
          </h1>
          <p className="mt-4 text-xl text-gray-500">Última actualización: 22 de octubre de 2025</p>
        </div>

        <p>
          En Alergenu, respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política de privacidad te informará sobre cómo tratamos tus datos cuando te registras y utilizas nuestra plataforma, y te explicará tus derechos de privacidad y cómo la ley te protege.
        </p>

        <h2>1. Responsable del Tratamiento</h2>
        <p>El responsable del tratamiento de tus datos personales es:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Titular:</strong> Andrés Ortega Montoya</li>
            <li><strong>NIF:</strong> 49570884L</li>
            <li><strong>Domicilio:</strong> Plaza Rafael Atard 20A, piso 2, puerta 3, 46940, Manises, Valencia, España.</li>
            <li><strong>Correo electrónico:</strong> hola@soyandres.es</li>
        </ul>

        <h2>2. ¿Qué datos recopilamos?</h2>
        <p>Recopilamos y procesamos los siguientes tipos de datos personales:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Datos de Identificación y Contacto:</strong> Nombre, apellidos, NIF, dirección de correo electrónico, número de teléfono y contraseña de acceso a la plataforma.</li>
            <li><strong>Datos del Restaurante:</strong> Nombre del restaurante, dirección y datos de facturación.</li>
            <li><strong>Datos de Uso:</strong> Información sobre cómo utilizas nuestro Sitio Web y servicios, incluyendo los datos que introduces para crear tu menú (nombres de platos, descripciones, precios, alérgenos).</li>
            <li><strong>Datos Técnicos:</strong> Dirección IP, tipo y versión del navegador, configuración de zona horaria y ubicación, tipos y versiones de plug-in del navegador, sistema operativo y plataforma.</li>
        </ul>

        <h2>3. ¿Con qué finalidad tratamos tus datos?</h2>
        <p>Tratamos tus datos personales con las siguientes finalidades:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li>Gestionar tu alta como usuario y prestarte los servicios de la plataforma Alergenu.</li>
            <li>Gestionar la relación contractual, incluyendo la facturación y el cobro de los planes de suscripción.</li>
            <li>Comunicarnos contigo para resolver incidencias, enviar actualizaciones sobre el servicio o responder a tus consultas.</li>
            <li>Cumplir con nuestras obligaciones legales y fiscales.</li>
            <li>Analizar el uso del servicio para realizar mejoras y desarrollar nuevas funcionalidades.</li>
        </ul>

        <h2>4. Legitimación para el tratamiento</h2>
        <p>La base legal para el tratamiento de tus datos es la <strong>ejecución de un contrato</strong> (los Términos y Condiciones del servicio que aceptas al registrarte), el <strong>cumplimiento de obligaciones legales</strong> y nuestro <strong>interés legítimo</strong> en mejorar el servicio.</p>

        <h2>5. ¿Con quién compartimos tus datos?</h2>
        <p>No compartimos tus datos personales con terceros, a excepción de:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Proveedores de servicios</strong> que nos ayudan a operar el negocio, como proveedores de hosting (Firebase de Google) y pasarelas de pago (Stripe). Estos proveedores solo tienen acceso a los datos necesarios para realizar sus funciones y están obligados a protegerlos.</li>
            <li><strong>Autoridades competentes,</strong> cuando así lo exija la ley, para cumplir con requerimientos judiciales o administrativos.</li>
        </ul>
        <p>Alergenu no vende ni alquila tus datos personales a terceros.</p>

        <h2>6. Conservación de los datos</h2>
        <p>Conservaremos tus datos personales mientras mantengas una cuenta activa en Alergenu y, posteriormente, durante los plazos legalmente exigidos para la atención de posibles responsabilidades.</p>

        <h2>7. Tus derechos de protección de datos</h2>
        <p>En cualquier momento, puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de tus datos, enviando una solicitud por escrito a <strong>hola@soyandres.es</strong>, adjuntando una copia de tu DNI o documento equivalente.</p>
        <p>También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si consideras que el tratamiento de tus datos no se ajusta a la normativa.</p>

        <h2>8. Seguridad de los datos</h2>
        <p>Hemos implementado medidas de seguridad técnicas y organizativas apropiadas para evitar que tus datos personales se pierdan, se usen o se acceda a ellos de forma no autorizada. El acceso a tus datos se limita a aquellos empleados y terceros que tienen una necesidad comercial de conocerlos.</p>
    </article>
  );
}
