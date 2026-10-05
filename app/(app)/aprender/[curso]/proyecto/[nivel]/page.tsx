import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getUserAndSub } from '@/lib/learn'

export default async function ProjectPage({ params }: { params: Promise<{ curso: string; nivel: string }> }) {
  const { curso, nivel } = await params
  const { supabase } = await getUserAndSub()
  const { data: course } = await supabase.from('courses')
    .select('title,levels(id,slug,name)').eq('slug', curso).eq('published', true).maybeSingle()
  const level = course?.levels.find(l => l.slug === nivel)
  if (!course || !level) notFound()
  const { data: project } = await supabase.from('projects')
    .select('title,instructions,requirements').eq('level_id', level.id).maybeSingle()
  if (!project) notFound()
  const reqs = Array.isArray(project.requirements) ? (project.requirements as string[]) : []

  return (
    <div className="max-w-3xl">
      <Link href={`/aprender/${curso}?nivel=${nivel}`} className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">← Volver a la ruta</Link>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">{course.title} · {level.name} · Proyecto final</p>
      <h1 className="text-3xl font-semibold">{project.title}</h1>
      {project.instructions && <p className="card mt-5 whitespace-pre-line p-5 text-[var(--muted)]">{project.instructions}</p>}
      {reqs.length > 0 && (
        <div className="card mt-4 p-5">
          <h2 className="font-semibold">Requisitos</h2>
          <ul className="mt-2 list-disc pl-5 text-[var(--muted)]">
            {reqs.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}