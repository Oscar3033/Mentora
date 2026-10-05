import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { one } from '@/lib/relations'

export default async function LogrosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', user!.id).maybeSingle()
  const { data: certs } = await supabase.from('certificates')
    .select('id,issued_at,levels(name,courses(title))').order('issued_at', { ascending: false })
  const { data: badges } = await supabase.from('user_badges')
    .select('badge_id,badges(name,icon)')
  const name = profile?.display_name || 'Creador'

  return (
    <div className="max-w-3xl">
      <Link href="/perfil" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">← Perfil</Link>
      <h1 className="mt-2 text-3xl font-semibold">Mis logros</h1>

      <h2 className="mt-6 text-xl font-semibold">Insignias</h2>
      {!badges?.length ? (
        <div className="card mt-3 p-5 text-[var(--muted)]">Aún no tienes insignias. Completa tu primera lección para conseguir la primera.</div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-3">
          {badges.map(b => (
            <div key={b.badge_id} className="card flex items-center gap-3 px-4 py-3">
              <span className="text-2xl">{one(b.badges)?.icon}</span>
              <span className="font-medium">{one(b.badges)?.name}</span>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-8 text-xl font-semibold">Certificados</h2>
      {!certs?.length ? (
        <div className="card mt-3 p-5 text-[var(--muted)]">Completa todas las lecciones de un nivel para conseguir tu primer certificado.</div>
      ) : (
        <div className="mt-3 grid gap-4">
          {certs.map(c => (
            <div key={c.id} className="rounded-2xl border border-[var(--accent)]/40 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--surface)] p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">Mentora · Certificado</p>
              <p className="mt-4 text-sm text-[var(--muted)]">Se otorga a</p>
              <p className="text-3xl font-semibold">{name}</p>
              <p className="mt-3 text-[var(--muted)]">por completar el nivel</p>
              <p className="text-xl font-semibold">{one(one(c.levels)?.courses)?.title} — {one(c.levels)?.name}</p>
              <p className="mt-4 text-sm text-[var(--muted)]">
                {new Date(c.issued_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}