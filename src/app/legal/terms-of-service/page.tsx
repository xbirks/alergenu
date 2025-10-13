
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones del Servicio - Alergenu',
  description: 'Consulta los términos y condiciones que rigen el uso de la plataforma Alergenu.'
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-white text-gray-800">
      <PublicHeader />
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <article className="prose prose-lg mx-auto max-w-4xl">
          <h1>Términos y Condiciones del Servicio de Alergenu</h1>
          <p className="lead text-muted-foreground">Última actualización: 24 de Mayo de 2024</p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mt-8 rounded-r-lg" role="alert">
            <p className="font-bold">Documento de Ejemplo</p>
            <p>Este es un documento de ejemplo y no constituye asesoramiento legal. Te recomendamos que consultes con un profesional para adaptar estos términos a tu situación y asegurar el cumplimiento de la ley.</p>
          </div>

          <h2>1. Introducción</h2>
          <p>Bienvenido a Alergenu. Estos Términos y Condiciones rigen el uso del software como servicio ("Servicio") de Alergenu, ofrecido a restaurantes y negocios de hostelería para la gestión y publicación de información sobre alérgenos en sus menús.</p>

          <h2>2. Aceptación de los Términos</h2>
          <p>Al registrarte y utilizar nuestro Servicio, confirmas que has leído, entendido y aceptado estar vinculado por estos Términos. Si no estás de acuerdo con ellos, no debes utilizar el Servicio.</p>

          <h2>3. Descripción del Servicio</h2>
          <p>Alergenu proporciona una plataforma online que permite a los restaurantes ("Clientes") crear, gestionar y mostrar digitalmente los menús de sus establecimientos, con especial énfasis en la declaración de alérgenos conforme a la normativa aplicable.</p>
          
          <h2>4. Cuentas de Usuario</h2>
          <p>Para utilizar el Servicio, deberás crear una cuenta de administrador para tu restaurante. Eres responsable de mantener la confidencialidad de tu contraseña y de toda la actividad que ocurra en tu cuenta. Te comprometes a notificar inmediatamente a Alergenu de cualquier uso no autorizado.</p>

          <h2>5. Pagos y Facturación</h2>
          <p>El acceso a ciertas funcionalidades del Servicio requerirá el pago de una suscripción. Los planes y precios se detallan en nuestra web. Utilizamos Stripe para procesar los pagos, por lo que al contratar un plan, aceptas también sus términos y condiciones.</p>

          <h2>6. Obligaciones del Cliente</h2>
          <p>Como Cliente, eres el único responsable de la exactitud, calidad e integridad de la información que introduces en la plataforma (nombres de platos, precios y, especialmente, la información sobre alérgenos). Alergenu es una herramienta para facilitar la comunicación, pero no verifica la veracidad de los datos. Es tu responsabilidad asegurar que la información mostrada a tus clientes finales cumple con la legislación vigente.</p>

          <h2>7. Limitación de Responsabilidad</h2>
          <p>Alergenu se proporciona "tal cual". En la máxima medida permitida por la ley, no seremos responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo. Nuestra responsabilidad total no excederá la cantidad que nos hayas pagado en los últimos seis meses.</p>

          <h2>8. Modificación de los Términos</h2>
          <p>Nos reservamos el derecho de modificar estos Términos en cualquier momento. Te notificaremos de los cambios importantes. El uso continuado del Servicio después de la notificación constituirá tu aceptación de los nuevos Términos.</p>
          
          <h2>9. Ley Aplicable y Jurisdicción</h2>
          <p>Estos Términos se regirán por las leyes de España. Cualquier disputa se someterá a la jurisdicción exclusiva de los tribunales de Valencia, España.</p>
        </article>
      </main>
    </div>
  );
}
