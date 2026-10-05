import Link from 'next/link'
import { LEGAL, legalPending } from '@/lib/legal'

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">← Volver a {LEGAL.brand}</Link>
      {legalPending && (
        <p role="alert" className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600">
          BORRADOR: faltan datos por completar en lib/legal.ts. No publiques esta página así.
        </p>
      )}
      <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">Última actualización: {LEGAL.updated}</p>
      <div className="mt-6 flex flex-col gap-6 leading-relaxed">{children}</div>
    </main>
  )
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-2 flex flex-col gap-2 text-[var(--muted)]">{children}</div>
    </section>
  )
}