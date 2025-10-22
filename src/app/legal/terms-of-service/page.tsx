import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones del Servicio | Alergenu',
  description: 'Lee nuestros términos y condiciones de servicio. Al usar Alergenu, aceptas estas reglas, incluyendo tu responsabilidad como restaurante.',
};

export default function TermsOfServicePage() {
  return (
    <article className="prose prose-lg max-w-none prose-p:my-4 prose-headings:my-8 prose-headings:font-bold prose-h2:text-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Términos y Condiciones del Servicio
          </h1>
          <p className="mt-4 text-xl text-gray-500">Última actualización: 1 de Agosto de 2024</p>
        </div>

        <p>
          Bienvenido a Alergenu. Estos Términos y Condiciones ("Términos") rigen tu acceso y uso de la plataforma de software como servicio (SaaS) ofrecida por Andrés Ortega Montoya ("nosotros", "nuestro" o "Alergenu"). Al registrarte y utilizar nuestros servicios, aceptas estar vinculado por estos Términos.
        </p>

        <h2>1. Aceptación de los Términos</h2>
        <p>
          Al crear una cuenta en Alergenu, confirmas que has leído, entendido y aceptado estos Términos en su totalidad. Si no estás de acuerdo con alguna parte de los términos, no puedes utilizar nuestros servicios. Declaras ser mayor de edad y tener capacidad legal para suscribir este contrato en nombre del restaurante o negocio que representas.
        </p>

        <h2>2. Descripción del Servicio</h2>
        <p>Alergenu proporciona una plataforma online que permite a los restaurantes ("Cliente" o "tú") crear, gestionar y publicar menús y cartas digitales, con un sistema específico para la declaración de alérgenos conforme a la normativa vigente.</p>

        <h2>3. Cuentas y Registro</h2>
        <p>Para utilizar el servicio, debes registrarte y crear una cuenta, proporcionando información veraz y completa. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos inmediatamente cualquier uso no autorizado de tu cuenta.</p>

        <h2>4. Suscripciones y Pagos</h2>
        <p>Ofrecemos diferentes planes de suscripción, incluyendo un plan gratuito y planes de pago con funcionalidades avanzadas. Los precios y características de cada plan se detallan en nuestro Sitio Web. Los pagos se procesan a través de nuestra pasarela de pago segura (Stripe). Las suscripciones son recurrentes y se renovarán automáticamente a menos que se cancelen antes del final del período de facturación actual. No se realizarán reembolsos por períodos de suscripción parciales.</p>

        <h2 className="text-red-700">5. Responsabilidad del Cliente sobre el Contenido</h2>
        <p>
          Esta es una de las cláusulas más importantes de nuestro acuerdo. Alergenu es una herramienta tecnológica que facilita la visualización de información. Sin embargo, el Cliente es el <strong>único y exclusivo responsable</strong> de la totalidad del contenido que introduce, gestiona y publica a través de la plataforma. Esto incluye, pero no se limita a:
        </p>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>La exactitud y veracidad de la lista de alérgenos</strong> de cada plato, conforme al Reglamento (UE) Nº 1169/2011.</li>
            <li>La correcta asignación de precios.</li>
            <li>La descripción de los platos y cualquier otra información proporcionada.</li>
        </ul>
        <p>
          <strong>Alergenu no verifica, valida ni certifica la información sobre alérgenos introducida por el restaurante.</strong> El Cliente entiende y acepta que es su obligación legal y moral garantizar que la información mostrada a los consumidores finales es precisa, completa y no induce a error. Cualquier reclamación, sanción administrativa, o daño derivado de una información incorrecta sobre alérgenos será responsabilidad exclusiva del Cliente, exonerando completamente a Alergenu y a su titular de cualquier responsabilidad.
        </p>

        <h2>6. Uso Aceptable de la Plataforma</h2>
        <p>Te comprometes a no utilizar el servicio para ningún propósito ilegal o no autorizado. No debes, en el uso del Servicio, violar ninguna ley en tu jurisdicción. Te comprometes a no publicar contenido que sea difamatorio, obsceno, pornográfico, o que infrinja los derechos de propiedad intelectual de terceros.</p>

        <h2>7. Modificaciones del Servicio y Precios</h2>
        <p>Nos reservamos el derecho de modificar o discontinuar, temporal o permanentemente, el Servicio (o cualquier parte de él) con o sin previo aviso. Los precios de todos los Servicios, incluidos, entre otros, las tarifas del plan de suscripción mensual, están sujetos a cambios con un aviso de 30 días de nuestra parte. Dicho aviso puede proporcionarse en cualquier momento publicando los cambios en el Sitio Web de Alergenu.</p>

        <h2>8. Cancelación y Terminación</h2>
        <p>Eres el único responsable de cancelar adecuadamente tu cuenta. Puedes cancelar tu suscripción en cualquier momento desde el panel de control de tu cuenta. Si cancelas el Servicio antes del final de tu ciclo de facturación actual, tu cancelación entrará en vigencia inmediatamente y no se te cobrará de nuevo. Nos reservamos el derecho de suspender o cancelar tu cuenta si violas gravemente estos Términos.</p>

        <h2>9. Limitación de Responsabilidad</h2>
        <p>En la máxima medida permitida por la ley, Alergenu y su titular no serán responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo, incluyendo, sin limitación, la pérdida de beneficios, datos, uso, fondo de comercio u otras pérdidas intangibles, resultantes de (i) tu acceso o uso o incapacidad para acceder o usar el servicio; (ii) cualquier conducta o contenido de un tercero en el servicio; (iii) cualquier contenido obtenido del servicio; y (iv) el acceso no autorizado, uso o alteración de tus transmisiones o contenido.</p>

        <h2>10. Legislación y Jurisdicción Aplicable</h2>
        <p>Estos Términos se regirán e interpretarán de acuerdo con las leyes de España. Cualquier disputa que surja de o en conexión con estos Términos será sometida a la jurisdicción exclusiva de los tribunales de la ciudad de Valencia.</p>
    </article>
  );
}
