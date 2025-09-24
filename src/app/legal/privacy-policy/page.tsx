// src/app/legal/privacy-policy/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="prose prose-lg mx-auto">
        <h1>Política de Privacidad de Alergenu</h1>
        <p className="lead">Última actualización: [Fecha]</p>

        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Aviso Importante</p>
          <p>Esta es una plantilla y no constituye asesoramiento legal. Debes adaptarla a tu tratamiento de datos específico y consultar con un profesional para cumplir con el RGPD y otras leyes de protección de datos.</p>
        </div>

        <h2>1. ¿Quién es el Responsable del Tratamiento de tus Datos?</h2>
        <p><strong>Identidad:</strong> [Tu Nombre o Nombre de tu Empresa]<br />
        <strong>NIF/CIF:</strong> [Tu NIF/CIF]<br />
        <strong>Dirección:</strong> [Tu Dirección Postal]<br />
        <strong>Correo electrónico:</strong> [Tu Email de Contacto]</p>

        <h2>2. ¿Qué Datos Recopilamos?</h2>
        <p>Recopilamos diferentes tipos de información para proporcionar y mejorar nuestro Servicio:</p>
        <ul>
          <li><strong>Datos de la Cuenta del Restaurante:</strong> Nombre del restaurante, datos de contacto (email, teléfono), dirección y datos de facturación.</li>
          <li><strong>Datos de los Usuarios del Restaurante:</strong> Nombre, apellido y dirección de correo electrónico del administrador o de los usuarios que gestionan la cuenta.</li>
          <li><strong>Datos del Menú:</strong> Toda la información que los restaurantes suben a la plataforma, incluyendo nombres de platos, descripciones, precios e información sobre alérgenos.</li>
          <li><strong>Datos de Uso:</strong> Información sobre cómo utilizas nuestro Servicio, como las páginas que visitas, las funciones que utilizas y la hora y fecha de tus visitas.</li>
        </ul>

        <h2>3. ¿Con qué Finalidad Tratamos tus Datos?</h2>
        <p>Tratamos tus datos para las siguientes finalidades:</p>
        <ul>
          <li>Prestar, mantener y mejorar nuestro Servicio.</li>
          <li>Gestionar tu cuenta y enviarte comunicaciones relativas al servicio (facturas, notificaciones técnicas, etc.).</li>
          <li>Procesar los pagos de las suscripciones a través de nuestro proveedor de pagos.</li>
          <li>Cumplir con nuestras obligaciones legales.</li>
          <li>Analizar el uso del Servicio para mejorar la experiencia del usuario y desarrollar nuevas funcionalidades.</li>
        </ul>

        <h2>4. ¿Cuál es la Legitimación para el Tratamiento de tus Datos?</h2>
        <p>La base legal para el tratamiento de tus datos es la <strong>ejecución del contrato de servicio</strong> que aceptas al registrarte, el <strong>cumplimiento de obligaciones legales</strong> (fiscales, por ejemplo) y nuestro <strong>interés legítimo</strong> en mejorar el servicio y la comunicación contigo.</p>

        <h2>5. ¿A qué Destinatarios se Comunicarán tus Datos?</h2>
        <p>No compartiremos tus datos personales con terceros, excepto en los siguientes casos:</p>
        <ul>
          <li><strong>Proveedores de Servicios:</strong> Empresas que nos ayudan a prestar el servicio, como proveedores de hosting (Google Cloud), plataformas de pago (Stripe) y herramientas de análisis. Estos proveedores solo tienen acceso a los datos necesarios para realizar sus funciones y están obligados contractualmente a protegerlos.</li>
          <li><strong>Obligación Legal:</strong> Si la ley o una autoridad competente nos lo exige.</li>
        </ul>

        <h2>6. ¿Por Cuánto Tiempo Conservaremos tus Datos?</h2>
        <p>Conservaremos tus datos personales mientras mantengas una cuenta activa con nosotros y, posteriormente, durante el tiempo necesario para cumplir con nuestras obligaciones legales (generalmente, durante los plazos de prescripción fiscal y contable).</p>

        <h2>7. ¿Cuáles son tus Derechos?</h2>
        <p>Tienes derecho a acceder, rectificar, suprimir y oponerte al tratamiento de tus datos, así como el derecho a la limitación del tratamiento y a la portabilidad de los mismos. Puedes ejercer estos derechos enviando un correo electrónico a [Tu Email de Contacto]. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) si consideras que el tratamiento no se ajusta a la normativa.</p>

        <h2>8. Seguridad de los Datos</h2>
        <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Utilizamos encriptación, reglas de acceso estrictas y otras mejores prácticas de la industria.</p>
      </div>
    </main>
  );
}
