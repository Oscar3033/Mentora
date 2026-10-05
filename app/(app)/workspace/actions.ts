'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TEMPLATES, TEMPLATE_KEYS } from '@/lib/templates'
import { descendants, type Folder } from '@/lib/workspace'

async function ctx() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

const uuid = z.string().uuid()
const name = z.string().trim().min(1).max(80)
const optId = z.string().uuid().or(z.literal('')).optional()

export async function createFolder(fd: FormData) {
  const { supabase, user } = await ctx()
  const d = z.object({ name, parent_id: optId }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  await supabase.from('folders').insert({ user_id: user.id, name: d.data.name, parent_id: d.data.parent_id || null })
  revalidatePath('/workspace')
}

export async function renameFolder(fd: FormData) {
  const { supabase } = await ctx()
  const d = z.object({ id: uuid, name }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  await supabase.from('folders').update({ name: d.data.name }).eq('id', d.data.id)
  revalidatePath('/workspace')
}

export async function moveFolder(fd: FormData) {
  const { supabase } = await ctx()
  const d = z.object({ id: uuid, parent_id: optId }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  const { data } = await supabase.from('folders').select('id,name,parent_id')
  const list = (data ?? []) as Folder[]
  const parent = d.data.parent_id || null
  if (parent) {
    if (!list.some(f => f.id === parent)) return
    if (descendants(d.data.id, list).has(parent)) return
  }
  await supabase.from('folders').update({ parent_id: parent }).eq('id', d.data.id)
  revalidatePath('/workspace')
  redirect(`/workspace?carpeta=${d.data.id}`)
}

export async function deleteFolder(fd: FormData) {
  const { supabase } = await ctx()
  const d = z.object({ id: uuid, parent_id: optId }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  await supabase.from('folders').delete().eq('id', d.data.id)
  revalidatePath('/workspace')
  redirect(d.data.parent_id ? `/workspace?carpeta=${d.data.parent_id}` : '/workspace')
}

export async function createDocument(fd: FormData) {
  const { supabase, user } = await ctx()
  const d = z.object({ folder_id: optId, template: z.enum(TEMPLATE_KEYS).default('blank') }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  const t = TEMPLATES[d.data.template]
  const { data } = await supabase.from('documents')
    .insert({ user_id: user.id, folder_id: d.data.folder_id || null, title: t.title, content: t.content })
    .select('id').single()
  if (data) redirect(`/workspace/doc/${data.id}`)
}

export async function saveDocument(fd: FormData) {
  const { supabase } = await ctx()
  const d = z.object({
    id: uuid,
    title: z.string().trim().min(1).max(120),
    content: z.string().max(50000),
    folder_id: optId,
  }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  await supabase.from('documents').update({
    title: d.data.title,
    content: d.data.content,
    folder_id: d.data.folder_id || null,
    updated_at: new Date().toISOString(),
  }).eq('id', d.data.id)
  revalidatePath('/workspace')
  redirect(`/workspace/doc/${d.data.id}?guardado=${Date.now()}`)
}

export async function duplicateDocument(fd: FormData) {
  const { supabase, user } = await ctx()
  const d = z.object({ id: uuid }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  const { data: src } = await supabase.from('documents').select('title,content,folder_id').eq('id', d.data.id).maybeSingle()
  if (!src) return
  const { data } = await supabase.from('documents')
    .insert({ user_id: user.id, folder_id: src.folder_id, title: `Copia de ${src.title}`.slice(0, 120), content: src.content })
    .select('id').single()
  revalidatePath('/workspace')
  if (data) redirect(`/workspace/doc/${data.id}`)
}

export async function deleteDocument(fd: FormData) {
  const { supabase } = await ctx()
  const d = z.object({ id: uuid, folder_id: optId }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  await supabase.from('documents').delete().eq('id', d.data.id)
  revalidatePath('/workspace')
  redirect(d.data.folder_id ? `/workspace?carpeta=${d.data.folder_id}` : '/workspace')
}