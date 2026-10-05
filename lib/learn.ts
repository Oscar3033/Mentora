import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getUserAndSub() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: sub } = await supabase
    .from('subscriptions').select('status,current_period_end')
    .eq('user_id', user!.id).eq('status', 'active').limit(1).maybeSingle()
  return { supabase, user: user!, sub }
}