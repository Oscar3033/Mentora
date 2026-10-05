import Link from 'next/link'
import { getUserAndSub } from '@/lib/learn'
import { one } from '@/lib/relations'

export default async function AprenderPage() {
  const { supabase } = await getUserAndSub()
  const { data: courses } = await supabase
    .from('courses')
    .select('slug,title,description,categories(name),levels(lessons(id))')
    .eq('published', true)
  const { data: done } = await supabase
    .from('user_progress').select('lesson_id').not('completed_at', 'is', null)
  const doneIds = new Set((done ?? []).map(d => d.lesson_id))

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-semibold">Aprender</h1>
      <p className="mt-1 text-[var(--muted)]">Elige una ruta y avanza paso a paso.</p>
      {!courses?.length ? (
        <div className="card mt-6 p-6 text-[var(--muted)]">Aún no hay rutas publicadas.</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(c => {
            const ids = c.levels.flatMap(l => l.lessons.map(x => x.id))
            const n = ids.filter(id => doneIds.has(id)).length
            const pct = ids.length ? Math.round((n / ids.length) * 100) : 0
            return (
              <Link key={c.slug} href={`/aprender/${c.slug}`}
                className="card p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">{one(c.categories)?.name}</p>
                <h2 className="mt-1 text-xl font-semibold">{c.title}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{c.description}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--line)]">
                  <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">{pct}% · {ids.length} lecciones</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}