import LegalPage, { Section } from '@/components/legal/LegalPage'
import { LEGAL } from '@/lib/legal'

export default function TerminosPage() {
  return (
    <LegalPage title="Términos de uso">
      <Section title="1. El servicio">
        <p>{LEGAL.brand} es una plataforma con rutas de aprendizaje, herramientas y un espacio de trabajo para creadores de contenido. Parte del contenido es gratuito y otra parte es de pago (Premium).</p>
      </Section>

      <Section title="2. Tu cuenta">
        <p>Debes tener al menos 14 años para registrarte, y facilitar datos veraces. Eres responsable de mantener segura tu contraseña. Si eres menor de edad, necesitas la autorización de tu madre, padre o tutor para contratar Premium.</p>
      </Section>

      <Section title="3. Contenido gratuito y Premium">
        <p>El contenido marcado como Premium solo está disponible mientras tengas una suscripción activa. Qué contenido es gratuito y cuál es Premium puede cambiar con el tiempo.</p>
      </Section>

      <Section title="4. Cómo se contrata Premium">
        <p>Premium se contrata abriendo un ticket en nuestro Discord. Una vez confirmado el pago, activamos Premium en la cuenta que nos indiques. El precio y el método de pago se te informan en el ticket antes de pagar.</p>
      </Section>

      <Section title="5. Duración">
        <p>Premium tiene la duración que se indique en el momento de la contratación. No se renueva automáticamente: al finalizar el periodo, el acceso Premium caduca salvo que lo renueves.</p>
      </Section>

      <Section title="6. Desistimiento y reembolsos">
        <p>{LEGAL.refundPolicy}</p>
      </Section>

      <Section title="7. Uso aceptable">
        <ul className="list-disc pl-5">
          <li>No compartas tus credenciales ni los contenidos Premium con terceros.</li>
          <li>No copies, descargues ni redistribuyas los vídeos y recursos.</li>
          <li>No intentes acceder a cuentas, datos o funciones que no te correspondan.</li>
          <li>No uses el servicio para actividades ilegales o que perjudiquen a otras personas.</li>
        </ul>
      </Section>

      <Section title="8. Certificados e insignias">
        <p>Los certificados e insignias son un reconocimiento motivacional por completar niveles. No tienen valor oficial ni académico.</p>
      </Section>

      <Section title="9. Tu contenido">
        <p>Los documentos y datos que creas en el Workspace son tuyos. Los guardamos para prestarte el servicio y no los usamos para otros fines. Eres responsable de que no vulneren derechos de terceros.</p>
      </Section>

      <Section title="10. Suspensión">
        <p>Podemos suspender o eliminar cuentas que incumplan estos términos, y retirar el acceso Premium en caso de uso indebido, como compartir la cuenta o el contenido.</p>
      </Section>

      <Section title="11. Cambios">
        <p>Podemos modificar estos términos. Si el cambio es relevante, te lo comunicaremos con antelación razonable.</p>
      </Section>

      <Section title="12. Contacto">
        <p>Para cualquier consulta, escribe a {LEGAL.email}.</p>
      </Section>
    </LegalPage>
  )
}