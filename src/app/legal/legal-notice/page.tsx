import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso Legal | Alergenu',
  description: 'Consulta el aviso legal de Alergenu. Información sobre la titularidad del sitio web y nuestras responsabilidades.',
};

export default function LegalNoticePage() {
  return (
    <article className="prose prose-lg max-w-none prose-p:my-4 prose-headings:my-8 prose-headings:font-bold prose-h2:text-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Aviso Legal
          </h1>
          <p className="mt-4 text-xl text-gray-500">Última actualización: 22 de octubre de 2025</p>
        </div>

        <p>
          El presente Aviso Legal regula el acceso y uso del sitio web accesible a través de la URL www.alergenu.com (en adelante, “Alergenu” o el “Sitio Web”).
        </p>

        <h2>1. Titularidad del Sitio Web</h2>
        <p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico, te informamos de los datos del titular del sitio web Alergenu:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Titular:</strong> Andrés Ortega Montoya</li>
          <li><strong>NIF:</strong> 49570884L</li>
          <li><strong>Domicilio:</strong> Plaza Rafael Atard 20A, piso 2, puerta 3, 46940, Manises, Valencia, España.</li>
          <li><strong>Correo electrónico:</strong> hola@soyandres.es</li>
          <li><strong>Teléfono:</strong> 675392216</li>
        </ul>

        <h2>2. Objeto del Sitio Web</h2>
        <p>Alergenu es una plataforma de software como servicio (SaaS) que permite a los restaurantes y negocios de hostelería crear y gestionar cartas digitales, con especial atención a la declaración de alérgenos, para cumplir con la normativa vigente y ofrecer información clara a sus clientes.</p>

        <h2>3. Propiedad Intelectual e Industrial</h2>
        <p>El código fuente, los diseños gráficos, el software, los textos, así como la información y los contenidos que se recogen en el Sitio Web están protegidos por la legislación española sobre los derechos de propiedad intelectual e industrial a favor de Andrés Ortega Montoya. No se permite la reproducción y/o publicación, total o parcial, del Sitio Web, ni su tratamiento informático, su distribución, su difusión, ni su modificación, sin el permiso previo y por escrito del titular.</p>
        <p>El usuario, única y exclusivamente, puede utilizar el material que aparezca en este Sitio Web para su uso personal y privado, quedando prohibido su uso con fines comerciales o para incurrir en actividades ilícitas.</p>

        <h2 className="text-red-700">4. Exclusión de Garantías y Responsabilidad</h2>
        <p>Alergenu actúa como un intermediario tecnológico, proporcionando la herramienta para que los restaurantes publiquen la información sobre sus platos. La responsabilidad sobre la veracidad, exactitud y actualización de la información sobre alérgenos, ingredientes, precios o cualquier otro dato mostrado en la carta digital recae única y exclusivamente en el restaurante que contrata el servicio.</p>
        <p><strong>Alergenu NO es responsable, bajo ninguna circunstancia, de la información sobre alérgenos introducida por los restaurantes.</strong> El restaurante es el único responsable legal de garantizar que la información proporcionada a través de la plataforma es correcta y cumple con la normativa aplicable (Reglamento (UE) Nº 1169/2011).</p>
        <p>Alergenu no se hace responsable de los daños y perjuicios de toda naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos de las cartas, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.</p>

        <h2>5. Vínculos a Terceros</h2>
        <p>Este sitio web puede contener enlaces a otros sitios. El titular no ejerce ningún control sobre dichos sitios y no asumirá responsabilidad alguna por sus contenidos.</p>

        <h2>6. Legislación Aplicable y Jurisdicción</h2>
        <p>La relación entre el titular y el usuario se regirá por la normativa española vigente. Para cualquier controversia que pudiera derivarse del acceso o uso de este Sitio Web, las partes se someten a los Juzgados y Tribunales de la ciudad de Valencia, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>
    </article>
  );
}
