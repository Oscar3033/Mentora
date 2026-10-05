'use server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.record(z.string().max(30), z.array(z.string().max(60)).max(15))

export async function saveOnboarding(answers: Record<string, string[]>, skipped = false) {
  const parsed = schema.safeParse(answers)
  if (!parsed.success) return { ok: false }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }
  const { error } = await supabase.from('profiles')
    .update({ onboarding: { ...parsed.data, skipped, completed_at: new Date().toISOString() } })
    .eq('id', user.id)
  return { ok: !error }
}