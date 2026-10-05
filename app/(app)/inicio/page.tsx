import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { one } from '@/lib/relations'

export default async function InicioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles').select('display_name').eq('id', user!.id).single()

  const { count } = await supabase
    .from('user_progress').select('*', { count: 'exact', head: true })
    .not('completed_at', 'is', null)

  const name = profile?.display_name || 'creador'

  const { data: last } = await supabase.from('user_progress')
    .select('lesson_id,lessons(title,levels(name,courses(slug,title)))')
    .order('last_seen_at', { ascending: false }).limit(1).maybeSingle()

  const lesson = one(last?.lessons)
  const level = one(lesson?.levels)
  const course = one(level?.courses)

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-semibold">Hola, {name}</h1>
      <p className="mt-1 text-[var(--muted)]">Aprende, crea, organiza y mejora.</p>

      <section className="card mt-6 p-6">
        <h2 className="text-lg font-semibold">Continuar aprendiendo</h2>
        {lesson && level && course ? (
          <>
            <p className="mt-2 font-medium">{course.title} — {level.name}</p>
            <p className="text-sm text-[var(--muted)]">{lesson.title}</p>
            <Link href={`/aprender/${course.slug}/${last!.lesson_id}`}
              className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-[var(--accent)] px-4 font-medium text-[var(--accent-ink)]">
              Continuar
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-[var(--muted)]">Todavía no has empezado ninguna lección.</p>
            <Link href="/aprender"
              className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-[var(--accent)] px-4 font-medium text-[var(--accent-ink)]">
              Explorar rutas
            </Link>
          </>
        )}
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-[var(--muted)]">Lecciones completadas</p>
          <p className="mt-1 text-3xl font-semibold">{count ?? 0}</p>
        </div>
        <Link href="/ia" className="card p-5 transition-transform hover:-translate-y-0.5">
          <p className="font-semibold">Herramientas de IA</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Hooks, títulos y guiones.</p>
        </Link>
        <Link href="/workspace" className="card p-5 transition-transform hover:-translate-y-0.5">
          <p className="font-semibold">Workspace</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Organiza tus proyectos.</p>
        </Link>
      </div>
    </div>
  )
}