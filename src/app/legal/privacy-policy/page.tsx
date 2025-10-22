import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="prose lg:prose-xl max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-5xl font-bold mb-8">Política de Privacidad</h1>

        <h2 className="text-3xl font-bold mt-12 mb-4">1. Identificación del Responsable del Tratamiento</h2>
        <p>
            En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016 (RGPD), y de la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD), se informa que los datos personales recogidos o tratados a través de la aplicación web Alergenu son responsabilidad de:
        </p>
        <ul>
            <li><strong>Titular:</strong> Andrés Ortega Montoya</li>
            <li><strong>NIF:</strong> 49570884L</li>
            <li><strong>Domicilio:</strong> Plaza Rafael Atard 20A, piso 2, puerta 3, 46940, Manises, Valencia (España)</li>
            <li><strong>Correo electrónico:</strong> hola@soyandres.es</li>
            <li><strong>Teléfono de contacto:</strong> 675 392 216</li>
        </ul>
        <p>En adelante, el Responsable o Alergenu.</p>

        <h2 className="text-3xl font-bold mt-12 mb-4">2. Ámbito de Aplicación</h2>
        <p>
            La presente Política de Privacidad regula el tratamiento de datos personales de los Usuarios Registrados (restaurantes) y de los Usuarios Finales (clientes) que acceden o utilizan la aplicación web Alergenu.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">3. Tipos de Usuarios y Datos Tratados</h2>
        <h3 className="text-xl font-bold mt-8 mb-2">3.1. Usuarios Registrados (Restaurantes)</h3>
        <p>Alergenu recopila y trata los siguientes datos:</p>
        <ul>
            <li><strong>Datos de autenticación:</strong> correo electrónico y contraseña (gestionada por Firebase Authentication; Alergenu no tiene acceso a la contraseña en texto plano).</li>
            <li><strong>Datos del negocio:</strong> nombre del restaurante, descripción, categorías, menús, platos, precios, ingredientes y alérgenos asignados.</li>
            <li><strong>Datos técnicos:</strong> información de conexión (dirección IP, tipo de navegador, dispositivo, idioma y fecha de acceso).</li>
        </ul>
        <p><strong>Finalidad del tratamiento:</strong></p>
        <ul>
            <li>Crear y gestionar la cuenta del restaurante.</li>
            <li>Permitir la gestión del menú digital y la generación de códigos QR.</li>
            <li>Prestar soporte técnico y comunicarse con el usuario.</li>
            <li>Mejorar la calidad y funcionalidad del servicio.</li>
        </ul>
        <p><strong>Base jurídica:</strong></p>
        <ul>
            <li>Ejecución de un contrato (art. 6.1.b RGPD).</li>
            <li>Interés legítimo del responsable en mantener la seguridad y el correcto funcionamiento del servicio (art. 6.1.f RGPD).</li>
        </ul>

        <h3 className="text-xl font-bold mt-8 mb-2">3.2. Usuarios Finales (Clientes de Restaurantes)</h3>
        <p>El acceso de los clientes es libre y no requiere registro ni identificación.</p>
        <p><strong>Datos tratados:</strong></p>
        <ul>
            <li><strong>Selección de alérgenos:</strong> información sensible sobre posibles alergias (gluten, lactosa, etc.).</li>
            <li><strong>Datos técnicos de navegación:</strong> dirección IP, tipo de navegador, idioma, sistema operativo y fecha/hora de acceso.</li>
        </ul>
        <p><strong>Tratamiento de los datos sensibles:</strong></p>
        <ul>
            <li>La selección de alérgenos se almacena únicamente en el dispositivo del usuario, mediante el sistema localStorage del navegador.</li>
            <li>Esta información no se transmite, no se guarda en servidores ni es accesible para Alergenu.</li>
            <li>El filtrado de platos se realiza localmente en el dispositivo del usuario (privacidad por diseño).</li>
        </ul>
        <p><strong>Base jurídica:</strong></p>
        <ul>
            <li>Consentimiento del usuario, otorgado de manera implícita al seleccionar sus alérgenos (art. 6.1.a y 9.2.a RGPD).</li>
            <li>Dado que el tratamiento se ejecuta en el propio dispositivo, el Responsable no accede ni conserva dichos datos.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4">4. Servicios de Terceros y Encargados del Tratamiento</h2>
        <p>
            Para el funcionamiento de la Plataforma, Alergenu utiliza servicios de terceros que actúan como encargados del tratamiento conforme al artículo 28 del RGPD.
        </p>
        <ul>
            <li><strong>Google Firebase (Google Ireland Ltd.):</strong> servicios de autenticación, base de datos (Firestore) y alojamiento web (Hosting).
            <br />Más información: <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">https://firebase.google.com/support/privacy</a></li>
            <li><strong>Servicio de traducción automática (API de traducción):</strong>
                <ul>
                    <li>Los textos de los menús (nombres y descripciones de platos) se envían temporalmente a un servicio externo de traducción para ofrecer la funcionalidad multilingüe.</li>
                    <li>Estos textos no incluyen datos personales ni información sensible.</li>
                </ul>
            </li>
        </ul>
        <p>Alergenu suscribe con estos proveedores los contratos de tratamiento de datos exigidos por la normativa, garantizando que cumplen las medidas de seguridad adecuadas.</p>

        <h2 className="text-3xl font-bold mt-12 mb-4">5. Conservación de los Datos</h2>
        <ul>
            <li>Los datos de los restaurantes se conservan mientras el usuario mantenga su cuenta activa o hasta que solicite su eliminación.</li>
            <li>Los datos de navegación podrán conservarse durante el tiempo necesario para el mantenimiento de la seguridad del sistema y la mejora del servicio.</li>
            <li>Los datos de alérgenos de los usuarios finales no se almacenan en servidores de Alergenu; permanecen únicamente en el dispositivo del usuario y pueden eliminarse en cualquier momento al borrar la caché o los datos del navegador.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4">6. Comunicación y Cesión de Datos</h2>
        <p>
            No se cederán datos personales a terceros, salvo obligación legal o necesidad técnica derivada del uso de servicios externos (como Firebase o el servicio de traducción), que actúan como encargados del tratamiento bajo las condiciones establecidas por el RGPD.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">7. Medidas de Seguridad</h2>
        <p>
            Alergenu adopta medidas técnicas y organizativas apropiadas para garantizar la integridad, confidencialidad y disponibilidad de los datos personales, entre ellas:
        </p>
        <ul>
            <li>Autenticación segura mediante Firebase Authentication.</li>
            <li>Control de acceso a la base de datos mediante Reglas de Seguridad de Firestore.</li>
            <li>Cifrado de las comunicaciones mediante protocolo HTTPS/TLS.</li>
            <li>Limitación del acceso a los datos únicamente al titular de la cuenta correspondiente.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4">8. Derechos de los Usuarios</h2>
        <p>Los usuarios pueden ejercer en cualquier momento sus derechos de:</p>
        <ul>
            <li><strong>Acceso:</strong> conocer qué datos personales se tratan.</li>
            <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos.</li>
            <li><strong>Supresión (“derecho al olvido”):</strong> solicitar la eliminación de sus datos.</li>
            <li><strong>Limitación y oposición:</strong> restringir o oponerse a determinados tratamientos.</li>
            <li><strong>Portabilidad:</strong> recibir sus datos en un formato estructurado.</li>
        </ul>
        <p><strong>Ejercicio de derechos:</strong></p>
        <p>
            Puede ejercer sus derechos mediante solicitud escrita al correo electrónico hola@soyandres.es, indicando en el asunto “Protección de Datos – Alergenu”, junto con una copia de su documento identificativo.
        </p>
        <p>
            Asimismo, puede presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) si considera que se han vulnerado sus derechos (www.aepd.es).
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">9. Transferencias Internacionales de Datos</h2>
        <p>
            Los servicios de Google Firebase pueden implicar transferencias internacionales de datos a países fuera del Espacio Económico Europeo (EEE).
        </p>
        <p>
            Google se encuentra adherida a los mecanismos de adecuación reconocidos por la Comisión Europea, garantizando un nivel de protección equivalente al europeo.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">10. Enlaces a Terceros</h2>
        <p>
            La Plataforma puede contener enlaces a sitios web o servicios de terceros.
        </p>
        <p>
            Alergenu no se responsabiliza de las políticas de privacidad o prácticas de dichos sitios. Se recomienda al usuario revisar sus respectivas políticas antes de proporcionar cualquier dato personal.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">11. Modificaciones de la Política de Privacidad</h2>
        <p>
            Alergenu podrá actualizar esta Política de Privacidad en cualquier momento para adaptarla a cambios legales o técnicos.
        </p>
        <p>
            La versión vigente estará siempre disponible en el sitio web, indicando la fecha de su última actualización.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">12. Contacto</h2>
        <p>
            Para cualquier consulta o solicitud relacionada con la protección de datos personales, puede contactar con el Responsable a través de:
        </p>
        <ul>
            <li><strong>Correo electrónico:</strong> hola@soyandres.es</li>
            <li><strong>Dirección postal:</strong> Plaza Rafael Atard 20A, piso 2, puerta 3, 46940, Manises, Valencia (España).</li>
        </ul>
    </div>
  );
}
