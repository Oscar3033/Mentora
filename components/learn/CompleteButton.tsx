'use client'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { setCompleted } from '@/app/(app)/aprender/actions'

export default function CompleteButton({ lessonId, completed }: { lessonId: string; completed: boolean }) {
  const [pending, start] = useTransition()
  const [lessonPop, setLessonPop] = useState(false)
  const [levelName, setLevelName] = useState<string | null>(null)

  function click() {
    const fd = new FormData()
    fd.set('lessonId', lessonId)
    fd.set('complete', completed ? '0' : '1')
    start(async () => {
      const res = await setCompleted(fd)
      if (completed) return
      if (res.levels.length > 0) {
        setLevelName(res.levels[0])
      } else {
        setLessonPop(true)
        setTimeout(() => setLessonPop(false), 1800)
      }
    })
  }

  return (
    <>
      <button onClick={click} disabled={pending}
        className={`min-h-11 rounded-lg px-5 font-medium transition-colors disabled:opacity-60 ${completed ? 'border border-[var(--line)] bg-[var(--surface)]' : 'bg-[var(--accent)] text-[var(--accent-ink)]'}`}>
        {pending ? 'Guardando...' : completed ? '✓ Completada (deshacer)' : 'Marcar como completada'}
      </button>

      {lessonPop && (
        <div role="status" className="fade fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="pop card p-8 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--ok)] text-3xl text-white">✓</div>
            <p className="mt-4 text-xl font-semibold">¡Lección completada!</p>
            <p className="text-sm text-[var(--muted)]">Sigue así.</p>
          </div>
        </div>
      )}

      {levelName && (
        <div role="dialog" aria-modal="true" className="fade fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="pop card w-full max-w-sm p-8 text-center">
            <p className="text-5xl">🏆</p>
            <p className="mt-3 text-2xl font-semibold">¡Nivel completado!</p>
            <p className="mt-1 text-[var(--muted)]">{levelName}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Has conseguido un certificado y una insignia.</p>
            <Link href="/perfil/logros" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[var(--accent)] px-5 font-medium text-[var(--accent-ink)]">
              Ver mis logros
            </Link>
            <button onClick={() => setLevelName(null)} className="mt-2 block w-full text-sm text-[var(--muted)]">Seguir</button>
          </div>
        </div>
      )}
    </>
  )
}