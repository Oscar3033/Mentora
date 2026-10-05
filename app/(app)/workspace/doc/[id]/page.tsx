import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ConfirmButton from '@/components/ui/ConfirmButton'
import DocEditor from '@/components/workspace/DocEditor'
import { folderLabel, type Folder } from '@/lib/workspace'
import { deleteDocument, duplicateDocument } from '../../actions'

export default async function DocPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ guardado?: string }>
}) {
  const { id } = await params
  const { guardado } = await searchParams
  const supabase = await createClient()

  const { data: doc } = await supabase.from('documents')
    .select('id,title,content,folder_id').eq('id', id).maybeSingle()
  if (!doc) notFound()

  const { data: all } = await supabase.from('folders').select('id,name,parent_id').order('name')
  const folders = (all ?? []) as Folder[]
  const options = folders.map(f => ({ id: f.id, label: folderLabel(f, folders) }))
  const back = doc.folder_id ? `/workspace?carpeta=${doc.folder_id}` : '/workspace'

  return (
    <div className="max-w-3xl">
      <Link href={back} className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">← Volver al Workspace</Link>

      {guardado && (
        <p role="status" className="fade mt-3 rounded-lg bg-[var(--ok)]/10 px-3 py-2 text-sm font-medium text-[var(--ok)]">
          ✓ Guardado
        </p>
      )}

      <DocEditor
        key={guardado ?? 'inicial'}
        id={doc.id}
        title={doc.title}
        content={doc.content ?? ''}
        folderId={doc.folder_id ?? ''}
        folders={options}
      />

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <form action={duplicateDocument}>
          <input type="hidden" name="id" value={doc.id} />
          <button className="text-sm text-[var(--accent)] hover:underline">Duplicar documento</button>
        </form>
        <form action={deleteDocument}>
          <input type="hidden" name="id" value={doc.id} />
          <input type="hidden" name="folder_id" value={doc.folder_id ?? ''} />
          <ConfirmButton message="¿Eliminar este documento? No se puede deshacer." className="text-sm text-red-600 hover:underline">
            Eliminar documento
          </ConfirmButton>
        </form>
      </div>
    </div>
  )
}