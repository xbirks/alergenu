
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad - Alergenu',
  description: 'Entiende cómo recopilamos, usamos y protegemos tus datos en Alergenu.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white text-gray-800">
      <PublicHeader />
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <article className="prose prose-lg mx-auto max-w-4xl">
          <h1>Política de Privacidad de Alergenu</h1>
          <p className="lead text-muted-foreground">Última actualización: 24 de Mayo de 2024</p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mt-8 rounded-r-lg" role="alert">
            <p className="font-bold">Documento de Ejemplo</p>
            <p>Esta es una plantilla y no constituye asesoramiento legal. Debes adaptarla a tu tratamiento de datos y consultar con un profesional para cumplir con el RGPD.</p>
          </div>

          <h2>1. Responsable del Tratamiento</h2>
          <p>La persona o entidad responsable del tratamiento de tus datos es:</p>
          <ul>
            <li><strong>Identidad:</strong> __TU_NOMBRE_O_EMPRESA__</li>
            <li><strong>NIF/CIF:</strong> __TU_NIF_O_CIF__</li>
            <li><strong>Dirección:</strong> __TU_DIRECCION_POSTAL__</li>
            <li><strong>Correo electrónico:</strong> __TU_EMAIL_DE_CONTACTO__</li>
          </ul>
          
          <h2>2. ¿Qué Datos Recopilamos?</h2>
          <p>Recopilamos la información necesaria para proporcionar y mejorar nuestro Servicio:</p>
          <ul>
            <li><strong>Datos de la Cuenta del Restaurante:</strong> Nombre del restaurante, datos de contacto (email, teléfono), dirección y datos de facturación.</li>
            <li><strong>Datos de los Usuarios:</strong> Nombre, apellidos y dirección de correo electrónico de las personas que gestionan la cuenta.</li>
            <li><strong>Datos del Menú:</strong> Toda la información que subes a la plataforma (platos, precios, alérgenos).</li>
            <li><strong>Datos de Uso:</strong> Información anónima sobre cómo utilizas nuestro Servicio para poder mejorarlo.</li>
          </ul>

          <h2>3. Finalidad del Tratamiento</h2>
          <p>Tratamos tus datos para:</p>
          <ul>
            <li>Prestar, mantener y mejorar el Servicio.</li>
            <li>Gestionar tu cuenta y enviarte comunicaciones relativas al servicio (facturas, notificaciones técnicas, etc.).</li>
            <li>Procesar los pagos de las suscripciones.</li>
            <li>Cumplir con nuestras obligaciones legales (fiscales, mercantiles).</li>
            <li>Analizar el uso del Servicio para mejorar la experiencia y desarrollar nuevas funcionalidades.</li>
          </ul>

          <h2>4. Legitimación</h2>
          <p>La base legal para el tratamiento de tus datos es la <strong>ejecución de un contrato</strong> (los Términos del Servicio), el <strong>cumplimiento de obligaciones legales</strong> y nuestro <strong>interés legítimo</strong> en mejorar el producto.</p>

          <h2>5. Destinatarios de los Datos</h2>
          <p>No compartiremos tus datos con terceros, excepto con:</p>
          <ul>
            <li><strong>Proveedores de Servicios:</strong> Empresas que nos ayudan a prestar el servicio, como proveedores de hosting (Google Cloud) y plataformas de pago (Stripe).</li>
            <li><strong>Obligación Legal:</strong> Si la ley o una autoridad competente nos lo exige.</li>
          </ul>

          <h2>6. Tiempo de Conservación</h2>
          <p>Conservaremos tus datos mientras mantengas una cuenta activa y, posteriormente, durante el tiempo necesario para cumplir con las obligaciones legales.</p>

          <h2>7. Tus Derechos</h2>
          <p>Tienes derecho a acceder, rectificar, suprimir y oponerte al tratamiento de tus datos, así como el derecho a la limitación y a la portabilidad. Puedes ejercerlos enviando un correo a <strong>__TU_EMAIL_DE_CONTACTO__</strong>. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).</p>

          <h2>8. Seguridad de los Datos</h2>
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos, incluyendo encriptación y control de acceso estricto.</p>
        </article>
      </main>
    </div>
  );
}
