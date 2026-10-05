import LegalPage, { Section } from '@/components/legal/LegalPage'
import { LEGAL } from '@/lib/legal'

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad">
      <Section title="1. Responsable del tratamiento">
        <p>{LEGAL.owner}. Puedes contactar en {LEGAL.email}.</p>
      </Section>

      <Section title="2. Qué datos tratamos">
        <ul className="list-disc pl-5">
          <li>Datos de la cuenta: nombre, correo electrónico y contraseña (almacenada de forma cifrada).</li>
          <li>Datos de uso: lecciones vistas y completadas, certificados, insignias y respuestas del cuestionario de bienvenida.</li>
          <li>Contenido que creas: documentos, carpetas y eventos del Workspace.</li>
          <li>Datos de suscripción: si tienes Premium, su estado y su fecha de caducidad.</li>
          <li>Datos de soporte y pago: los que nos facilites al abrir un ticket en Discord. {LEGAL.brand} no solicita ni almacena datos de tarjeta en esta web.</li>
        </ul>
      </Section>

      <Section title="3. Para qué los usamos y con qué base legal">
        <ul className="list-disc pl-5">
          <li>Crear y gestionar tu cuenta y darte acceso al servicio: ejecución del contrato (art. 6.1.b RGPD).</li>
          <li>Personalizar tu experiencia y recomendarte rutas según tus respuestas: ejecución del contrato.</li>
          <li>Gestionar tu suscripción Premium y atender tus consultas: ejecución del contrato.</li>
          <li>Enviarte correos necesarios del servicio, como la confirmación de la cuenta y la recuperación de la contraseña: ejecución del contrato.</li>
          <li>Garantizar la seguridad y prevenir abusos: interés legítimo (art. 6.1.f RGPD).</li>
          <li>Cumplir obligaciones legales, fiscales y contables: obligación legal (art. 6.1.c RGPD).</li>
        </ul>
        <p>No vendemos tus datos ni los usamos para publicidad de terceros.</p>
      </Section>

      <Section title="4. Con quién compartimos tus datos">
        <p>Para prestar el servicio recurrimos a proveedores que tratan datos por nuestra cuenta:</p>
        <ul className="list-disc pl-5">
          <li>Supabase: base de datos y sistema de cuentas.</li>
          <li>{LEGAL.hosting}: alojamiento de la web.</li>
          <li>{LEGAL.mailProvider}: envío de correos de la cuenta.</li>
          <li>Discord: soporte mediante tickets y gestión de pagos, si decides contratar Premium por esa vía.</li>
        </ul>
        <p>No cedemos tus datos a otros terceros, salvo obligación legal.</p>
      </Section>

      <Section title="5. Transferencias internacionales">
        <p>Tus datos se alojan en la región {LEGAL.dataRegion}. Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo; en ese caso se apoyan en las garantías que prevé el RGPD, como las cláusulas contractuales tipo o las decisiones de adecuación.</p>
      </Section>

      <Section title="6. Cuánto tiempo los conservamos">
        <p>Conservamos tus datos mientras tengas la cuenta activa. Si la eliminas, borraremos tus datos, salvo los que debamos conservar durante los plazos que exige la normativa fiscal y mercantil.</p>
      </Section>

      <Section title="7. Tus derechos">
        <p>Puedes solicitar el acceso, la rectificación, la supresión, la oposición, la limitación del tratamiento y la portabilidad de tus datos escribiendo a {LEGAL.email}. Si consideras que no hemos atendido tus derechos, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).</p>
      </Section>

      <Section title="8. Menores de edad">
        <p>Para registrarte debes tener al menos 14 años. Si eres menor de edad, necesitas la autorización de tu madre, padre o tutor para contratar Premium. Si detectamos una cuenta que incumple este requisito, podremos eliminarla.</p>
      </Section>

      <Section title="9. Seguridad">
        <p>Aplicamos medidas técnicas y organizativas razonables: conexión cifrada, control de acceso y reglas de seguridad a nivel de base de datos para que cada usuario solo vea sus propios datos. Ningún sistema es infalible, pero trabajamos para proteger tu información.</p>
      </Section>

      <Section title="10. Cambios en esta política">
        <p>Podemos actualizar esta política. Si el cambio es importante, te lo comunicaremos. La fecha de la última actualización figura al principio del documento.</p>
      </Section>
    </LegalPage>
  )
}