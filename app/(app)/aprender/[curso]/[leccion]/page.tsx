import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getUserAndSub } from '@/lib/learn'
import { canAccess } from '@/lib/access'
import { one } from '@/lib/relations'
import CompleteButton from '@/components/learn/CompleteButton'

export default async function LessonPage({ params }: { params: Promise<{ curso: string; leccion: string }> }) {
  const { curso, leccion } = await params
  const { supabase, user, sub } = await getUserAndSub()
  const { data: lesson } = await supabase.from('lessons')
    .select('id,title,summary,objective,duration_sec,access_tier,levels(name)')
    .eq('id', leccion).maybeSingle()
  if (!lesson) notFound()

  if (!canAccess(lesson.access_tier, sub)) {
    return (
      <div className="card mx-auto mt-10 max-w-md p-8 text-center">
        <p className="text-3xl">🔒</p>
        <h1 className="mt-2 text-2xl font-semibold">Contenido Premium</h1>
        <p className="mt-2 text-[var(--muted)]">Esta lección forma parte de Mentora Premium.</p>
        <Link href={`/aprender/${curso}`} className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[var(--accent)] px-5 font-medium text-[var(--accent-ink)]">
          Volver a la ruta
        </Link>
      </div>
    )
  }

  await supabase.from('user_progress').upsert({ user_id: user.id, lesson_id: lesson.id, last_seen_at: new Date().toISOString() })
  const { data: prog } = await supabase.from('user_progress').select('completed_at').eq('lesson_id', lesson.id).maybeSingle()
  const { data: vid } = await supabase.from('lesson_videos').select('video_url').eq('lesson_id', lesson.id).maybeSingle()
  const completed = !!prog?.completed_at

  return (
    <div className="max-w-3xl">
      <Link href={`/aprender/${curso}`} className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">← Volver a la ruta</Link>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Nivel {one(lesson.levels)?.name}</p>
      <h1 className="text-3xl font-semibold">{lesson.title}</h1>
      <div className="mt-4 overflow-hidden rounded-xl bg-black">
        {vid?.video_url ? (
          <iframe src={vid.video_url} title={lesson.title} className="aspect-video w-full border-0" allow="fullscreen; picture-in-picture" allowFullScreen />
        ) : (
          <div className="grid aspect-video place-items-center text-sm text-white/60">Vídeo próximamente</div>
        )}
      </div>
      <p className="mt-4 text-[var(--muted)]">{lesson.summary}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{Math.round((lesson.duration_sec ?? 0) / 60)} min</p>
      <div className="mt-6">
        <CompleteButton lessonId={lesson.id} completed={completed} />
      </div>
    </div>
  )
}