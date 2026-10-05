import Link from 'next/link'
import { requireAdmin } from '@/lib/admin'
import { saveProject } from './actions'

const input = 'w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]'

export default async function ProyectosAdmin() {
  const supabase = await requireAdmin()
  const { data: courses } = await supabase.from('courses').select('title,levels(id,name,projects(title))')
  const options = (courses ?? []).flatMap(c => c.levels.map(l => ({ id: l.id, label: `${c.title} — ${l.name}` })))

  return (
    <div className="max-w-2xl">
      <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">← Administración</Link>
      <h1 className="mt-2 text-3xl font-semibold">Proyecto final</h1>
      <p className="mt-1 text-[var(--muted)]">Un proyecto por nivel. Si ya existe, se actualiza.</p>
      {options.length === 0 ? (
        <div className="card mt-6 p-5 text-[var(--muted)]">Primero crea un curso y un nivel.</div>
      ) : (
        <form action={saveProject} className="card mt-6 flex flex-col gap-3 p-5">
          <select name="level_id" required className={input}>
            {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <input name="title" placeholder="Título (ej. Edita un vídeo de 30 segundos)" required className={input} />
          <textarea name="instructions" rows={5} placeholder="Instrucciones" className={input} />
          <textarea name="requirements" rows={4} placeholder="Requisitos (uno por línea)" className={input} />
          <button className="min-h-11 rounded-lg bg-[var(--accent)] font-medium text-[var(--accent-ink)]">Guardar proyecto</button>
        </form>
      )}
    </div>
  )
}