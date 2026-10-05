import { requireAdmin } from '@/lib/admin'
import { createCourse, createLevel, createLesson, togglePublish, deleteLesson } from './actions'

const input = 'w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]'
const btn = 'min-h-10 rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-[var(--accent-ink)]'

function Tier() {
  return (
    <select name="access_tier" className={input} defaultValue="free">
      <option value="free">Gratis</option>
      <option value="premium">Premium</option>
    </select>
  )
}

export default async function AdminPage() {
  const supabase = await requireAdmin()
  const { data: categories } = await supabase.from('categories').select('id,name').order('position')
  const { data: courses } = await supabase.from('courses')
    .select('id,title,slug,published,access_tier,levels(id,name,position,lessons(id,title,position,access_tier))')
    .order('title')

  const levelOptions = (courses ?? []).flatMap(c => c.levels.map(l => ({ id: l.id, label: `${c.title} — ${l.name}` })))

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-semibold">Administración</h1>
      <p className="mt-1 text-[var(--muted)]">Crea y organiza tu contenido. Orden: curso → nivel → lección.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <form action={createCourse} className="card flex flex-col gap-2 p-4">
          <h2 className="font-semibold">1. Nuevo curso</h2>
          <input name="title" placeholder="Título (ej. DaVinci Resolve)" required className={input} />
          <input name="slug" placeholder="url-sin-espacios (ej. davinci)" required pattern="[a-z0-9\-]+" className={input} />
          <input name="description" placeholder="Descripción corta" className={input} />
          <select name="category_id" required className={input}>
            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Tier />
          <button className={btn}>Crear curso</button>
        </form>

        <form action={createLevel} className="card flex flex-col gap-2 p-4">
          <h2 className="font-semibold">2. Nuevo nivel</h2>
          <select name="course_id" required className={input}>
            {courses?.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <input name="name" placeholder="Nombre (ej. Fácil)" required className={input} />
          <input name="slug" placeholder="url (ej. facil)" required pattern="[a-z0-9\-]+" className={input} />
          <input name="position" type="number" min="1" defaultValue="1" className={input} aria-label="Orden" />
          <Tier />
          <button className={btn}>Crear nivel</button>
        </form>

        <form action={createLesson} className="card flex flex-col gap-2 p-4">
          <h2 className="font-semibold">3. Nueva lección</h2>
          <select name="level_id" required className={input}>
            {levelOptions.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
          <input name="title" placeholder="Título de la lección" required className={input} />
          <input name="summary" placeholder="Descripción corta" className={input} />
          <input name="video_url" type="url" placeholder="Enlace del vídeo (embed)" className={input} />
          <div className="flex gap-2">
            <input name="minutes" type="number" min="0" defaultValue="5" className={input} aria-label="Minutos" />
            <input name="position" type="number" min="1" defaultValue="1" className={input} aria-label="Orden" />
          </div>
          <Tier />
          <button className={btn}>Crear lección</button>
        </form>
      </div>

      <h2 className="mt-8 text-xl font-semibold">Tu contenido</h2>
      {!courses?.length && <div className="card mt-3 p-5 text-[var(--muted)]">Aún no hay cursos. Crea el primero arriba.</div>}
      <div className="mt-3 flex flex-col gap-4">
        {courses?.map(c => (
          <div key={c.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{c.title} <span className="text-sm font-normal text-[var(--muted)]">/{c.slug}</span></p>
                <p className="text-xs text-[var(--muted)]">{c.published ? 'Publicado' : 'Borrador (los usuarios no lo ven)'}</p>
              </div>
              <form action={togglePublish}>
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="published" value={c.published ? 'false' : 'true'} />
                <button className="min-h-10 rounded-lg border border-[var(--line)] px-4 text-sm">
                  {c.published ? 'Despublicar' : 'Publicar'}
                </button>
              </form>
            </div>
            {[...c.levels].sort((a, b) => a.position - b.position).map(l => (
              <div key={l.id} className="mt-3 border-t border-[var(--line)] pt-3">
                <p className="text-sm font-semibold text-[var(--accent)]">{l.name}</p>
                {!l.lessons.length && <p className="text-sm text-[var(--muted)]">Sin lecciones todavía.</p>}
                {[...l.lessons].sort((a, b) => a.position - b.position).map(x => (
                  <div key={x.id} className="flex items-center justify-between gap-2 py-1 text-sm">
                    <span>{x.position}. {x.title} {x.access_tier === 'premium' && <span className="text-xs text-[var(--premium)]">Premium</span>}</span>
                    <form action={deleteLesson}>
                      <input type="hidden" name="id" value={x.id} />
                      <button className="text-xs text-red-600 hover:underline">Eliminar</button>
                    </form>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}