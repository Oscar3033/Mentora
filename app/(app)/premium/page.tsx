import Link from 'next/link'
import { getUserAndSub } from '@/lib/learn'

const FEATURES = [
  ['Niveles Medio, Difícil y Profesional', 'Todos los programas, sin límites.'],
  ['IA avanzada', 'Generadores y análisis de tus textos.'],
  ['Plan personalizado', 'Una ruta creada según tus objetivos.'],
  ['Futuras herramientas', 'Acceso a todo lo nuevo que llegue.'],
]

export default async function PremiumPage() {
  const { supabase, sub } = await getUserAndSub()
  const { data: plan } = await supabase.from('plans')
    .select('name,price_cents,currency,interval').eq('slug', 'premium').maybeSingle()
  const price = plan?.price_cents != null
    ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: plan.currency ?? 'EUR' }).format(plan.price_cents / 100)
    : null
  const every = plan?.interval === 'year' ? 'año' : 'mes'

  return (
    <div className="max-w-4xl">
      <div className="rounded-3xl border border-[var(--premium)]/30 bg-[var(--premium)]/10 px-6 py-10 text-center">
        <span className="rounded-full bg-[var(--premium)]/15 px-3 py-1 text-xs font-semibold text-[var(--premium)]">Mentora Premium</span>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Desbloquea todo tu potencial</h1>
        <p className="mx-auto mt-2 max-w-md text-[var(--muted)]">Niveles avanzados, IA sin límites y un plan hecho a tu medida.</p>
        {price ? (
          <p className="mt-6 text-4xl font-semibold">{price}<span className="text-base font-normal text-[var(--muted)]"> / {every}</span></p>
        ) : (
          <p className="mt-6 text-lg text-[var(--muted)]">Precio próximamente</p>
        )}
        {sub ? (
          <p className="mt-6 font-medium text-[var(--ok)]">✓ Ya eres Premium</p>
        ) : (
          <>
            <button disabled className="mt-6 min-h-11 cursor-not-allowed rounded-xl bg-[var(--premium)] px-6 font-semibold text-black opacity-60">
              Suscribirme
            </button>
            <p className="mt-2 text-xs text-[var(--muted)]">Los pagos se activarán muy pronto.</p>
          </>
        )}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {FEATURES.map(([t, d]) => (
          <div key={t} className="card p-5">
            <p className="font-semibold">{t}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{d}</p>
          </div>
        ))}
      </div>
      <Link href="/aprender" className="mt-6 inline-block text-sm text-[var(--muted)] hover:text-[var(--ink)]">← Volver a Aprender</Link>
    </div>
  )
}