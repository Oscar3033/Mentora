import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/layout/LogoutButton'
import { updateName } from './actions'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from('profiles')
    .select('display_name,role').eq('id', user!.id).maybeSingle()
  const { data: sub } = await supabase.from('subscriptions')
    .select('status').eq('user_id', user!.id).eq('status', 'active').limit(1).maybeSingle()
  const { count: done } = await supabase.from('user_progress')
    .select('*', { count: 'exact', head: true }).not('completed_at', 'is', null)
  const { count: started } = await supabase.from('user_progress')
    .select('*', { count: 'exact', head: true })

  const name = profile?.display_name || 'Creador'

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">Perfil</h1>

      <div className="card mt-6 flex items-center gap-4 p-5">
        <div className="grid h-16 w-16 flex-none place-items-center rounded-full bg-[var(--accent)] text-2xl font-semibold text-[var(--accent-ink)]">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xl font-semibold">{name}</p>
          <p className="truncate text-sm text-[var(--muted)]">{user!.email}</p>
          <p className="mt-1 text-xs font-semibold text-[var(--accent)]">
            {profile?.role === 'admin' ? 'Administrador · ' : ''}{sub ? 'Plan Premium' : 'Plan gratuito'}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="text-sm text-[var(--muted)]">Lecciones completadas</p>
          <p className="mt-1 text-3xl font-semibold">{done ?? 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-[var(--muted)]">Lecciones empezadas</p>
          <p className="mt-1 text-3xl font-semibold">{started ?? 0}</p>
        </div>
      </div>

      <Link href="/perfil/logros" className="card mt-4 block p-5 transition-transform hover:-translate-y-0.5">
        <p className="font-semibold">Insignias y certificados</p>
        <p className="mt-1 text-sm text-[var(--muted)]">Mira lo que has conseguido.</p>
      </Link>

      <form action={updateName} className="card mt-4 p-5">
        <label htmlFor="display_name" className="font-semibold">Tu nombre</label>
        <div className="mt-2 flex gap-2">
          <input id="display_name" name="display_name" defaultValue={profile?.display_name ?? ''} required minLength={2} maxLength={50}
            className="min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 outline-none focus:border-[var(--accent)]" />
          <button className="min-h-11 rounded-lg bg-[var(--accent)] px-4 font-medium text-[var(--accent-ink)]">Guardar</button>
        </div>
      </form>

      <div className="card mt-4 p-3">
        <LogoutButton />
      </div>
    </div>
  )
}