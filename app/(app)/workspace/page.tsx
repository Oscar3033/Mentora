import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ConfirmButton from '@/components/ui/ConfirmButton'
import { TEMPLATES } from '@/lib/templates'
import { descendants, folderLabel, type Folder } from '@/lib/workspace'
import { createFolder, renameFolder, deleteFolder, moveFolder, createDocument } from './actions'

type Doc = { id: string; title: string; updated_at: string; folder_id: string | null }

const input = 'min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]'
const btn = 'min-h-10 rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-[var(--accent-ink)]'
const fmt = (d: string) => new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })

function DocRow({ d, sub }: { d: Doc; sub?: string }) {
  return (
    <Link href={`/workspace/doc/${d.id}`}
      className="card flex items-center justify-between gap-3 p-4 transition-all hover:border-[var(--accent)]">
      <span className="flex min-w-0 items-center gap-3">
        <span aria-hidden>📄</span>
        <span className="min-w-0">
          <span className="block truncate font-medium">{d.title}</span>
          {sub && <span className="block truncate text-xs text-[var(--muted)]">{sub}</span>}
        </span>
      </span>
      <span className="flex-none text-xs text-[var(--muted)]">{fmt(d.updated_at)}</span>
    </Link>
  )
}

export default async function WorkspacePage({ searchParams }: { searchParams: Promise<{ carpeta?: string; q?: string }> }) {
  const { carpeta, q: rawQ } = await searchParams
  const q = (rawQ ?? '').replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ ]/g, '').trim().slice(0, 60)
  const supabase = await createClient()

  const { data: f } = await supabase.from('folders').select('id,name,parent_id').order('name')
  const folders = (f ?? []) as Folder[]
  const { data: d } = await supabase.from('documents')
    .select('id,title,updated_at,folder_id').order('updated_at', { ascending: false })
  const docs = (d ?? []) as Doc[]

  let results: Doc[] = []
  if (q) {
    const { data: s } = await supabase.from('documents')
      .select('id,title,updated_at,folder_id')
      .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
      .order('updated_at', { ascending: false }).limit(50)
    results = (s ?? []) as Doc[]
  }

  const current = folders.find(x => x.id === carpeta) ?? null
  const currentId = current?.id ?? ''
  const children = folders.filter(x => (x.parent_id ?? '') === currentId)
  const here = docs.filter(x => (x.folder_id ?? '') === currentId)
  const countIn = (id: string) => docs.filter(x => x.folder_id === id).length
  const byId = new Map(folders.map(x => [x.id, x]))
  const trail: Folder[] = []
  let c: Folder | null = current
  while (c) {
    trail.unshift(c)
    c = c.parent_id ? byId.get(c.parent_id) ?? null : null
  }
  const blocked = current ? descendants(current.id, folders) : new Set<string>()
  const moveOptions = folders.filter(x => !blocked.has(x.id))
  const empty = children.length === 0 && here.length === 0

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">Workspace</h1>
      <p className="mt-1 text-[var(--muted)]">Organiza tus proyectos, guiones e ideas.</p>

      <form action="/workspace" className="mt-5 flex gap-2">
        <input name="q" defaultValue={q} maxLength={60} placeholder="Buscar en tus documentos..." aria-label="Buscar documentos" className={input} />
        <button className="min-h-10 rounded-lg border border-[var(--line)] px-4 text-sm">Buscar</button>
      </form>

      {q ? (
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm text-[var(--muted)]">
            <span>{results.length} resultado(s) para «{q}»</span>
            <Link href="/workspace" className="text-[var(--accent)]">Limpiar búsqueda</Link>
          </div>
          {results.length === 0 ? (
            <div className="card mt-3 p-6 text-center text-[var(--muted)]">No hay documentos con ese texto.</div>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              {results.map(r => {
                const fo = r.folder_id ? byId.get(r.folder_id) : undefined
                return <DocRow key={r.id} d={r} sub={fo ? folderLabel(fo, folders) : 'Inicio'} />
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          <nav aria-label="Ruta de carpetas" className="mt-5 flex flex-wrap items-center gap-1 text-sm">
            <Link href="/workspace" className={current ? 'text-[var(--accent)]' : 'font-semibold'}>Inicio</Link>
            {trail.map((t, i) => (
              <span key={t.id} className="flex items-center gap-1">
                <span className="text-[var(--muted)]">/</span>
                <Link href={`/workspace?carpeta=${t.id}`} className={i === trail.length - 1 ? 'font-semibold' : 'text-[var(--accent)]'}>{t.name}</Link>
              </span>
            ))}
          </nav>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <form action={createFolder} className="card flex gap-2 p-3">
              <input type="hidden" name="parent_id" value={currentId} />
              <input name="name" required maxLength={80} placeholder="Nueva carpeta" aria-label="Nombre de la carpeta" className={input} />
              <button className={btn}>Crear</button>
            </form>
            <form action={createDocument} className="card flex gap-2 p-3">
              <input type="hidden" name="folder_id" value={currentId} />
              <select name="template" aria-label="Plantilla" className={input} defaultValue="blank">
                {Object.entries(TEMPLATES).map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}
              </select>
              <button className={btn}>+ Documento</button>
            </form>
          </div>

          {empty && (
            <div className="card mt-5 p-6 text-center text-[var(--muted)]">
              {current ? 'Esta carpeta está vacía.' : 'Aún no tienes nada. Crea una carpeta (por ejemplo, el nombre de tu canal) o un documento.'}
            </div>
          )}

          {children.length > 0 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {children.map(x => (
                <Link key={x.id} href={`/workspace?carpeta=${x.id}`}
                  className="card flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]">
                  <span className="text-xl" aria-hidden>📁</span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{x.name}</span>
                    <span className="block text-xs text-[var(--muted)]">{countIn(x.id)} documento(s)</span>
                  </span>
                </Link>
              ))}
            </div>
          )}

          {here.length > 0 && (
            <div className="mt-5 flex flex-col gap-2">
              {here.map(x => <DocRow key={x.id} d={x} />)}
            </div>
          )}

          {current && (
            <div className="card mt-8 flex flex-col gap-3 p-4">
              <p className="text-sm font-semibold">Ajustes de «{current.name}»</p>
              <form action={renameFolder} className="flex gap-2">
                <input type="hidden" name="id" value={current.id} />
                <input name="name" required maxLength={80} defaultValue={current.name} aria-label="Renombrar carpeta" className={input} />
                <button className="min-h-10 rounded-lg border border-[var(--line)] px-4 text-sm">Renombrar</button>
              </form>
              <form action={moveFolder} className="flex gap-2">
                <input type="hidden" name="id" value={current.id} />
                <select name="parent_id" defaultValue={current.parent_id ?? ''} aria-label="Mover carpeta a" className={input}>
                  <option value="">Inicio</option>
                  {moveOptions.map(o => <option key={o.id} value={o.id}>{folderLabel(o, folders)}</option>)}
                </select>
                <button className="min-h-10 rounded-lg border border-[var(--line)] px-4 text-sm">Mover</button>
              </form>
              <form action={deleteFolder}>
                <input type="hidden" name="id" value={current.id} />
                <input type="hidden" name="parent_id" value={current.parent_id ?? ''} />
                <ConfirmButton message="¿Eliminar esta carpeta y sus subcarpetas? Los documentos que contenga pasarán a Inicio, no se borran." className="text-sm text-red-600 hover:underline">
                  Eliminar carpeta
                </ConfirmButton>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  )
}