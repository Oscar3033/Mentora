import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getUserAndSub } from '@/lib/learn'
import { canAccess } from '@/lib/access'

export default async function CoursePage({ params, searchParams }: {
  params: Promise<{ curso: string }>, searchParams: Promise<{ nivel?: string }>
}) {
  const { curso } = await params
  const { nivel } = await searchParams
  const { supabase, sub } = await getUserAndSub()
  const { data: course } = await supabase.from('courses')
    .select('title,levels(id,slug,name,position,access_tier,lessons(id,title,duration_sec,position,access_tier))')
    .eq('slug', curso).eq('published', true).maybeSingle()
  if (!course) notFound()

  const levels = [...course.levels].sort((a, b) => a.position - b.position)
  const level = levels.find(l => l.slug === nivel) ?? levels[0]
  if (!level) notFound()
  const lessons = [...level.lessons].sort((a, b) => a.position - b.position)

  const { data: project } = await supabase.from('projects').select('title').eq('level_id', level.id).maybeSingle()
  const { data: done } = await supabase.from('user_progress').select('lesson_id')
    .not('completed_at', 'is', null).in('lesson_id', lessons.map(l => l.id))
  const doneIds = new Set((done ?? []).map(d => d.lesson_id))
  const pct = lessons.length ? Math.round((lessons.filter(l => doneIds.has(l.id)).length / lessons.length) * 100) : 0
  const allDone = lessons.length > 0 && pct === 100
  const currentId = lessons.find(l => !doneIds.has(l.id))?.id
  const locked = (tier: 'free' | 'premium') => !canAccess(tier, sub)
  const badge = <span className="ml-2 rounded-full bg-[var(--premium)]/15 px-2 py-0.5 text-xs font-semibold text-[var(--premium)]">Premium</span>

  return (
    <div className="max-w-3xl">
      <Link href="/aprender" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">← Aprender</Link>
      <h1 className="mt-2 text-3xl font-semibold">{course.title}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {levels.map(l => (
          <Link key={l.id} href={`/aprender/${curso}?nivel=${l.slug}`}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${l.id === level.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--line)] bg-[var(--surface)]'}`}>
            {l.name}{l.access_tier === 'premium' && locked('premium') && badge}
          </Link>
        ))}
      </div>

      <div className="card mt-4 p-5 sm:p-6">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold">Nivel {level.name}</p>
          <p className="text-2xl font-semibold">{pct}%</p>
        </div>
        <div className="mb-6 mt-2 h-2 overflow-hidden rounded-full bg-[var(--line)]">
          <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        {lessons.length === 0 && <p className="text-[var(--muted)]">Este nivel aún no tiene lecciones.</p>}
        {lessons.map((l, i) => {
          const isDone = doneIds.has(l.id), isNow = l.id === currentId
          return (
            <Link key={l.id} href={`/aprender/${curso}/${l.id}`}
              className="relative flex gap-4 pb-5 before:absolute before:bottom-0 before:left-[15px] before:top-8 before:w-0.5 before:bg-[var(--line)]">
              <span className={`z-10 grid h-8 w-8 flex-none place-items-center rounded-full border-2 text-sm font-bold ${isDone ? 'border-[var(--ok)] bg-[var(--ok)] text-white' : isNow ? 'border-[var(--accent)] text-[var(--accent)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_15%,transparent)]' : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]'}`}>
                {isDone ? '✓' : i + 1}
              </span>
              <span className={`flex-1 rounded-xl px-3 py-1 ${isNow ? 'bg-[var(--accent)]/10' : ''}`}>
                <span className="block font-medium">{l.title}{locked(l.access_tier) && badge}</span>
                <span className="text-sm text-[var(--muted)]">{Math.round((l.duration_sec ?? 0) / 60)} min</span>
              </span>
            </Link>
          )
        })}

        {lessons.length > 0 && (
          project ? (
            <Link href={`/aprender/${curso}/proyecto/${level.slug}`} className="relative flex gap-4">
              <span className={`z-10 grid h-8 w-8 flex-none place-items-center rounded-full border-2 text-sm font-bold ${allDone ? 'border-[var(--accent)] text-[var(--accent)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_15%,transparent)]' : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]'}`}>★</span>
              <span className="flex-1 px-3 py-1">
                <span className="block font-medium">Proyecto final</span>
                <span className="text-sm text-[var(--muted)]">{project.title}</span>
              </span>
            </Link>
          ) : (
            <div className="relative flex gap-4 opacity-60">
              <span className="z-10 grid h-8 w-8 flex-none place-items-center rounded-full border-2 border-[var(--line)] bg-[var(--surface)] text-sm font-bold text-[var(--muted)]">★</span>
              <span className="flex-1 px-3 py-1">
                <span className="block font-medium">Proyecto final</span>
                <span className="text-sm text-[var(--muted)]">Próximamente</span>
              </span>
            </div>
          )
        )}
      </div>
    </div>
  )
}