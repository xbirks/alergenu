
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso Legal - Alergenu',
  description: 'Información legal y de titularidad sobre el sitio web y el servicio Alergenu.'
};

export default function LegalNoticePage() {
  return (
    <div className="bg-white text-gray-800">
      <PublicHeader />
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <article className="prose prose-lg mx-auto max-w-4xl">
          <h1>Aviso Legal</h1>
          <p className="lead text-muted-foreground">Última actualización: 24 de Mayo de 2024</p>

          <h2>1. Información General</h2>
          <p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico, te informamos de los datos del titular del sitio web Alergenu:</p>
          <ul>
            <li><strong>Titular:</strong> __TU_NOMBRE_O_EMPRESA__</li>
            <li><strong>NIF/CIF:</strong> __TU_NIF_O_CIF__</li>
            <li><strong>Dirección:</strong> __TU_DIRECCION_POSTAL__</li>
            <li><strong>Correo electrónico:</strong> __TU_EMAIL_DE_CONTACTO__</li>
          </ul>

          <h2>2. Propiedad Intelectual e Industrial</h2>
          <p>El código fuente, los diseños, el software, los textos y la información de este sitio web están protegidos por la legislación española sobre derechos de propiedad intelectual e industrial. No se permite la reproducción total o parcial del sitio sin el permiso previo y por escrito del titular.</p>

          <h2>3. Objeto del Sitio Web</h2>
          <p>Este sitio web ha sido creado para dar a conocer y permitir el acceso a la información, productos y servicios ofrecidos por Alergenu.</p>

          <h2>4. Exclusión de Garantías y Responsabilidad</h2>
          <p>El titular no se hace responsable de los daños que pudieran ocasionar errores en los contenidos, falta de disponibilidad del portal o virus. En particular, el titular no se responsabiliza de la exactitud de la información sobre alérgenos introducida por los restaurantes, siendo esta una responsabilidad exclusiva del restaurante que la publica.</p>

          <h2>5. Vínculos a Terceros</h2>
          <p>Este sitio web puede contener enlaces a otros sitios. El titular no ejerce ningún control sobre dichos sitios y no asumirá responsabilidad alguna por sus contenidos.</p>

          <h2>6. Ley Aplicable y Jurisdicción</h2>
          <p>La relación entre el titular y el usuario se regirá por la normativa española vigente. Cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de Valencia, España.</p>

        </article>
      </main>
    </div>
  );
}
