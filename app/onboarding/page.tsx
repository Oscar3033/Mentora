import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: p } = await supabase.from('profiles').select('onboarding').eq('id', user.id).maybeSingle()
  if (p?.onboarding) redirect('/inicio')

  const { data: courses } = await supabase.from('courses').select('slug,title').eq('published', true).order('title')
  return <OnboardingFlow courses={courses ?? []} />
}