'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateName(fd: FormData) {
  const d = z.object({ display_name: z.string().trim().min(2).max(50) }).safeParse(Object.fromEntries(fd))
  if (!d.success) return
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('profiles').update({ display_name: d.data.display_name }).eq('id', user.id)
  revalidatePath('/', 'layout')
}