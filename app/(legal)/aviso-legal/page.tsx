import LegalPage, { Section } from '@/components/legal/LegalPage'
import { LEGAL } from '@/lib/legal'

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal">
      <Section title="1. Titular del sitio web">
        <p>Titular: {LEGAL.owner}</p>
        <p>Correo de contacto: {LEGAL.email}</p>
        <p>Sitio web: {LEGAL.site}</p>
      </Section>

      <Section title="2. Objeto y aceptación">
        <p>Este sitio web ofrece {LEGAL.brand}, una plataforma para aprender, crear y organizar contenido. Al usarlo aceptas este aviso legal y las condiciones de uso.</p>
      </Section>

      <Section title="3. Uso del sitio">
        <p>Te comprometes a usar {LEGAL.brand} de forma lícita y respetuosa, sin intentar acceder a datos o funciones que no te correspondan ni dañar el servicio.</p>
      </Section>

      <Section title="4. Propiedad intelectual">
        <p>Los vídeos, textos, diseños, marca y demás contenidos de {LEGAL.brand} pertenecen a {LEGAL.owner} o se usan con licencia. No está permitido reproducirlos, distribuirlos ni compartirlos sin autorización, en especial los contenidos de pago.</p>
      </Section>

      <Section title="5. Responsabilidad">
        <p>Los contenidos tienen fines formativos e informativos y no garantizan resultados concretos. No respondemos de interrupciones del servicio ni de fallos de terceros ajenos a nuestro control, en la medida que lo permita la ley.</p>
      </Section>

      <Section title="6. Enlaces a terceros">
        <p>El sitio puede enlazar a servicios externos, como Discord. No somos responsables de sus contenidos ni de sus políticas.</p>
      </Section>

      <Section title="7. Legislación aplicable">
        <p>Este aviso se rige por la legislación española. Si eres consumidor, se aplicarán los derechos y fueros que la ley te reconozca.</p>
      </Section>
    </LegalPage>
  )
}