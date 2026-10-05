'use client'
import { useEffect, useRef, useState } from 'react'
import { saveDocument } from '@/app/(app)/workspace/actions'

const input = 'w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 outline-none focus:border-[var(--accent)]'
const countWords = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0)

export default function DocEditor({ id, title, content, folderId, folders }: {
  id: string
  title: string
  content: string
  folderId: string
  folders: { id: string; label: string }[]
}) {
  const ref = useRef<HTMLFormElement>(null)
  const [dirty, setDirty] = useState(false)
  const [words, setWords] = useState(countWords(content))

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  return (
    <form ref={ref} action={saveDocument} className="mt-4 flex flex-col gap-3"
      onChange={() => setDirty(true)}
      onKeyDown={e => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
          e.preventDefault()
          ref.current?.requestSubmit()
        }
      }}>
      <input type="hidden" name="id" value={id} />
      <label htmlFor="title" className="sr-only">Título</label>
      <input id="title" name="title" required maxLength={120} defaultValue={title} className={`${input} text-xl font-semibold`} />

      <label htmlFor="folder_id" className="text-sm text-[var(--muted)]">Carpeta</label>
      <select id="folder_id" name="folder_id" defaultValue={folderId} className={input}>
        <option value="">Inicio (sin carpeta)</option>
        {folders.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
      </select>

      <label htmlFor="content" className="sr-only">Contenido</label>
      <textarea id="content" name="content" rows={18} maxLength={50000} defaultValue={content}
        onChange={e => setWords(countWords(e.target.value))}
        placeholder="Escribe aquí tu guion, ideas, checklist..."
        className={`${input} leading-relaxed`} />

      <div className="flex flex-wrap items-center gap-3">
        <button className="min-h-11 rounded-lg bg-[var(--accent)] px-5 font-medium text-[var(--accent-ink)]">Guardar</button>
        <span className={`text-sm ${dirty ? 'text-[var(--premium)]' : 'text-[var(--muted)]'}`} role="status">
          {dirty ? '● Cambios sin guardar' : 'Todo guardado'}
        </span>
        <span className="ml-auto text-sm text-[var(--muted)]">{words} palabras · Ctrl + S para guardar</span>
      </div>
    </form>
  )
}