import { redirect } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: p } = await supabase.from('profiles').select('role,onboarding').eq('id', user.id).maybeSingle()
  if (p && !p.onboarding) redirect('/onboarding')
  return <AppShell isAdmin={p?.role === 'admin'}>{children}</AppShell>
}