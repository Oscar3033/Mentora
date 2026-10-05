'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { canAccess } from '@/lib/access'

type Result = { levels: string[]; badges: string[] }

export async function setCompleted(formData: FormData): Promise<Result> {
  const empty: Result = { levels: [], badges: [] }
  const id = z.string().uuid().safeParse(formData.get('lessonId'))
  if (!id.success) return empty
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return empty
  const { data: lesson } = await supabase.from('lessons').select('access_tier').eq('id', id.data).maybeSingle()
  const { data: sub } = await supabase.from('subscriptions').select('status,current_period_end')
    .eq('user_id', user.id).eq('status', 'active').limit(1).maybeSingle()
  if (!lesson || !canAccess(lesson.access_tier, sub)) return empty

  const complete = formData.get('complete') === '1'
  await supabase.from('user_progress').upsert({
    user_id: user.id,
    lesson_id: id.data,
    completed_at: complete ? new Date().toISOString() : null,
  })

  let result = empty
  if (complete) {
    const { data } = await supabase.rpc('check_progress')
    if (data) result = data as Result
  }
  revalidatePath('/', 'layout')
  return result
}