'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { STEPS, PROGRAM_KEYWORDS } from '@/lib/onboarding'
import { saveOnboarding } from '@/app/onboarding/actions'

type Course = { slug: string; title: string }
const MESSAGES = ['Analizando tus respuestas...', 'Buscando las mejores rutas para ti...', 'Ordenando tu plan paso a paso...']

export default function OnboardingFlow({ courses }: { courses: Course[] }) {
  const router = useRouter()
  const [phase, setPhase] = useState<'quiz' | 'loading' | 'plan'>('quiz')
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(false)
  const [modal, setModal] = useState(false)

  const step = STEPS[i]
  const picked = answers[step.key] ?? []

  function toggle(opt: string) {
    setAnswers(a => {
      const cur = a[step.key] ?? []
      if (!step.multi) return { ...a, [step.key]: [opt] }
      return { ...a, [step.key]: cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt] }
    })
  }

  async function finish(skipped = false) {
    setError(false)
    setPhase('loading')
    setProgress(0)
    const timer = setInterval(() => setProgress(p => Math.min(p + 3, 96)), 100)
    const [res] = await Promise.all([
      saveOnboarding(skipped ? {} : answers, skipped),
      new Promise(r => setTimeout(r, 3600)),
    ])
    clearInterval(timer)
    if (!res.ok) { setError(true); setPhase('quiz'); return }
    setProgress(100)
    setPhase('plan')
    setTimeout(() => setModal(true), 900)
  }

  function next() { i < STEPS.length - 1 ? setI(i + 1) : finish() }

  useEffect(() => {
    if (!modal) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setModal(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal])

  const wrap = 'mx-auto grid min-h-dvh w-full max-w-xl content-center px-4 py-8'

  if (phase === 'loading') {
    return (
      <main className={wrap}>
        <div className="card fade p-8 text-center" role="status">
          <h1 className="text-2xl font-semibold">Estamos creando tu plan personalizado...</h1>
          <p className="mt-2 text-[var(--muted)]">{MESSAGES[Math.min(2, Math.floor(progress / 34))]}</p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-[var(--line)]">
            <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </main>
    )
  }

  if (phase === 'plan') {
    const kws = (answers.programs ?? []).map(p => PROGRAM_KEYWORDS[p]).filter(Boolean)
    const matched = courses.filter(c => kws.some(k => c.title.toLowerCase().includes(k)))
    const plan = [...matched, ...courses.filter(c => !matched.includes(c))].slice(0, 5)
    const time = answers.time?.[0]
    return (
      <main className={wrap}>
        <div className="fade">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Tu plan personalizado</p>
          <h1 className="mt-1 text-3xl font-semibold">Tu ruta para empezar</h1>
          {time && <p className="mt-1 text-[var(--muted)]">Pensada para {time} al día.</p>}
          {plan.length === 0 ? (
            <div className="card mt-6 p-5 text-[var(--muted)]">Aún no hay rutas publicadas. En cuanto las haya, tu plan aparecerá aquí.</div>
          ) : (
            <ol className="mt-6 flex flex-col gap-3">
              {plan.map((c, n) => {
                const locked = n >= 2
                return (
                  <li key={c.slug} className={`card flex items-center gap-4 p-4 ${locked ? 'select-none' : ''}`}>
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[var(--accent)]/10 font-semibold text-[var(--accent)]">{n + 1}</span>
                    <div className={`min-w-0 flex-1 ${locked ? 'blur-[3px]' : ''}`} aria-hidden={locked}>
                      <p className="truncate font-medium">{c.title}</p>
                      <p className="text-sm text-[var(--muted)]">Semana {n + 1}</p>
                    </div>
                    {locked && <span className="rounded-full bg-[var(--premium)]/15 px-2 py-0.5 text-xs font-semibold text-[var(--premium)]">Premium</span>}
                  </li>
                )
              })}
            </ol>
          )}
          <button onClick={() => { router.push('/inicio'); router.refresh() }}
            className="mt-6 min-h-11 w-full rounded-lg bg-[var(--accent)] font-medium text-[var(--accent-ink)]">
            Ir a mi panel
          </button>
        </div>

        {modal && (
          <div role="dialog" aria-modal="true" aria-labelledby="plan-title" className="fade fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
            <div className="pop card w-full max-w-sm p-8 text-center">
              <p className="text-4xl">✨</p>
              <h2 id="plan-title" className="mt-3 text-2xl font-semibold">Tu plan personalizado está listo</h2>
              <p className="mt-2 text-[var(--muted)]">
                Puedes ver el comienzo. El plan completo forma parte de Mentora Premium, que estará disponible muy pronto.
              </p>
              <button autoFocus onClick={() => setModal(false)}
                className="mt-6 min-h-11 w-full rounded-lg bg-[var(--accent)] font-medium text-[var(--accent-ink)]">
                Continuar con la versión gratuita
              </button>
            </div>
          </div>
        )}
      </main>
    )
  }

  return (
    <main className={wrap}>
      <div className="fade" key={i}>
        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
          <span>Pregunta {i + 1} de {STEPS.length}</span>
          <button onClick={() => finish(true)} className="hover:text-[var(--ink)]">Omitir por ahora</button>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
          <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${((i + 1) / STEPS.length) * 100}%` }} />
        </div>
        <h1 className="mt-8 text-2xl font-semibold sm:text-3xl">{step.title}</h1>
        {step.multi && <p className="mt-1 text-sm text-[var(--muted)]">Puedes elegir varias.</p>}
        <div className="mt-5 flex flex-col gap-2">
          {step.options.map(o => {
            const on = picked.includes(o)
            return (
              <button key={o} onClick={() => toggle(o)} aria-pressed={on}
                className={`min-h-12 rounded-xl border px-4 text-left font-medium transition-colors ${on ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)]'}`}>
                {o}
              </button>
            )
          })}
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-600">No se pudo guardar. Inténtalo de nuevo.</p>}
        <div className="mt-6 flex gap-2">
          {i > 0 && (
            <button onClick={() => setI(i - 1)} className="min-h-11 rounded-lg border border-[var(--line)] px-5">Atrás</button>
          )}
          <button onClick={next} disabled={picked.length === 0}
            className="min-h-11 flex-1 rounded-lg bg-[var(--accent)] font-medium text-[var(--accent-ink)] disabled:opacity-50">
            {i === STEPS.length - 1 ? 'Crear mi plan' : 'Siguiente'}
          </button>
        </div>
      </div>
    </main>
  )
}