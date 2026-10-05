'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin'

export async function saveProject(fd: FormData) {
  const supabase = await requireAdmin()
  const d = z.object({
    level_id: z.string().uuid(),
    title: z.string().trim().min(2).max(120),
    instructions: z.string().max(3000).optional(),
    requirements: z.string().max(2000).optional(),
  }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  const reqs = (d.data.requirements ?? '').split('\n').map(s => s.trim()).filter(Boolean)
  await supabase.from('projects').upsert(
    { level_id: d.data.level_id, title: d.data.title, instructions: d.data.instructions ?? '', requirements: reqs },
    { onConflict: 'level_id' }
  )
  revalidatePath('/aprender', 'layout')
  revalidatePath('/admin/proyectos')
}