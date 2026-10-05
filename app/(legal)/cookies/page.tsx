import LegalPage, { Section } from '@/components/legal/LegalPage'
import { LEGAL } from '@/lib/legal'

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies">
      <Section title="1. Qué son las cookies">
        <p>Las cookies son pequeños archivos que un sitio web guarda en tu dispositivo. Sirven, por ejemplo, para recordar que has iniciado sesión.</p>
      </Section>

      <Section title="2. Qué cookies usa Mentora">
        <p>{LEGAL.brand} solo utiliza cookies técnicas, necesarias para que el servicio funcione. Por ese motivo no te pedimos consentimiento para instalarlas.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--ink)]">
                <th className="py-2 pr-3">Cookie</th>
                <th className="py-2 pr-3">Origen</th>
                <th className="py-2 pr-3">Finalidad</th>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2">Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--line)] align-top">
                <td className="py-2 pr-3">sb-…-auth-token</td>
                <td className="py-2 pr-3">Propia</td>
                <td className="py-2 pr-3">Mantener tu sesión iniciada y proteger tu cuenta</td>
                <td className="py-2 pr-3">Técnica, necesaria</td>
                <td className="py-2">{LEGAL.cookieDuration}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="3. Cookies de terceros">
        <p>Los vídeos de las lecciones se reproducen desde {LEGAL.videoHost}, que puede instalar sus propias cookies al cargar el reproductor. Puedes consultar su política de cookies en su sitio web.</p>
      </Section>

      <Section title="4. Cómo desactivarlas">
        <p>Puedes bloquear o eliminar las cookies desde la configuración de tu navegador. Si bloqueas las técnicas, no podrás iniciar sesión ni usar {LEGAL.brand}.</p>
      </Section>

      <Section title="5. Cambios">
        <p>Si en el futuro añadimos otras cookies, por ejemplo de analítica, actualizaremos esta política y te pediremos tu consentimiento antes de instalarlas.</p>
        <p>Para cualquier duda, escribe a {LEGAL.email}.</p>
      </Section>
    </LegalPage>
  )
}