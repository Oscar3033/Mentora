'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin'

const slug = z.string().regex(/^[a-z0-9-]+$/).min(2).max(60)
const tier = z.enum(['free', 'premium'])

export async function createCourse(fd: FormData) {
  const supabase = await requireAdmin()
  const d = z.object({
    title: z.string().min(2).max(100), slug,
    description: z.string().max(300).optional(),
    category_id: z.string().uuid(), access_tier: tier,
  }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  await supabase.from('courses').insert({ ...d.data, published: false })
  revalidatePath('/admin')
}

export async function createLevel(fd: FormData) {
  const supabase = await requireAdmin()
  const d = z.object({
    course_id: z.string().uuid(), name: z.string().min(2).max(40), slug,
    position: z.coerce.number().int().min(1), access_tier: tier,
  }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  await supabase.from('levels').insert(d.data)
  revalidatePath('/admin')
}

export async function createLesson(fd: FormData) {
  const supabase = await requireAdmin()
  const d = z.object({
    level_id: z.string().uuid(), title: z.string().min(2).max(120),
    summary: z.string().max(300).optional(),
    minutes: z.coerce.number().min(0).max(600),
    position: z.coerce.number().int().min(1),
    video_url: z.string().url().or(z.literal('')).optional(),
    access_tier: tier,
  }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  const { video_url, minutes, ...rest } = d.data
  const { data: lesson } = await supabase.from('lessons')
    .insert({ ...rest, duration_sec: Math.round(minutes * 60) }).select('id').single()
  if (lesson && video_url) await supabase.from('lesson_videos').insert({ lesson_id: lesson.id, video_url })
  revalidatePath('/admin')
}

export async function togglePublish(fd: FormData) {
  const supabase = await requireAdmin()
  const d = z.object({ id: z.string().uuid(), published: z.enum(['true', 'false']) }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  await supabase.from('courses').update({ published: d.data.published === 'true' }).eq('id', d.data.id)
  revalidatePath('/admin')
}

export async function deleteLesson(fd: FormData) {
  const supabase = await requireAdmin()
  const d = z.object({ id: z.string().uuid() }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  await supabase.from('lessons').delete().eq('id', d.data.id)
  revalidatePath('/admin')
}