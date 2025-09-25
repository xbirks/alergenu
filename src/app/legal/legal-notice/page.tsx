// src/app/legal/legal-notice/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso Legal',
};

export default function LegalNoticePage() {
  return (
    <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="prose prose-lg mx-auto">
        <h1>Aviso Legal</h1>
        <p className="lead">Última actualización: [Fecha]</p>

        <h2>1. Información General</h2>
        <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico, te informamos de los datos identificativos del titular del sitio web Alergenu.</p>
        <p><strong>Titular:</strong> [Tu Nombre o Nombre de tu Empresa]<br />
        <strong>NIF/CIF:</strong> [Tu NIF/CIF]<br />
        <strong>Dirección:</strong> [Tu Dirección Postal]<br />
        <strong>Correo electrónico:</strong> [Tu Email de Contacto]</p>

        <h2>2. Propiedad Intelectual e Industrial</h2>
        <p>El código fuente, los diseños gráficos, las imágenes, el software, los textos, así como la información y los contenidos que se recogen en este sitio web están protegidos por la legislación española sobre los derechos de propiedad intelectual e industrial a favor del titular. No se permite la reproducción y/o publicación, total o parcial, del sitio web, ni su tratamiento informático, su distribución, su difusión, ni su modificación, transformación o descompilación, ni demás derechos reconocidos legalmente a su titular, sin el permiso previo y por escrito del mismo.</p>

        <h2>3. Objeto</h2>
        <p>El presente sitio web ha sido creado para dar a conocer y permitir el acceso general de todos los usuarios a la información, actividades, productos y servicios diversos, propios o de terceros, ofrecidos por Alergenu.</p>

        <h2>4. Exclusión de Garantías y Responsabilidad</h2>
        <p>El titular no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.</p>
        <p>En particular, el titular no se hace responsable de la exactitud de la información sobre alérgenos introducida por los restaurantes. La responsabilidad final sobre la veracidad de dicha información recae exclusivamente en el restaurante que la publica.</p>

        <h2>5. Vínculos a Terceros</h2>
        <p>En el caso de que en el sitio web se dispusiesen enlaces o hipervínculos hacía otros sitios de Internet, el titular no ejercerá ningún tipo de control sobre dichos sitios y contenidos. En ningún caso el titular asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un sitio web ajeno.</p>

        <h2>6. Ley Aplicable y Jurisdicción</h2>
        <p>La relación entre el titular y el usuario se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de Valencia, España.</p>

      </div>
    </main>
  );
}
