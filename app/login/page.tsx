'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { display_name: name } } })
    setLoading(false)
    if (error) return setError(error.message)
    router.push('/inicio')
    router.refresh()
  }

  const input = 'w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 outline-none focus:border-[var(--accent)]'

  return (
    <main className="min-h-dvh grid place-items-center p-4">
      <div className="card page-enter w-full max-w-sm p-6">
        <h1 className="text-2xl font-semibold">Mentora</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {mode === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta gratis'}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="text-sm">Nombre</label>
              <input id="name" className={input} value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm">Correo</label>
            <input id="email" type="email" className={input} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="text-sm">Contraseña</label>
            <input id="password" type="password" className={input} value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {mode === 'login' && (
            <Link href="/recuperar" className="text-sm text-[var(--accent)]">¿Has olvidado tu contraseña?</Link>
          )}
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button onClick={submit} disabled={loading}
            className="mt-2 min-h-11 rounded-lg bg-[var(--accent)] font-medium text-[var(--accent-ink)] transition-opacity disabled:opacity-60">
            {loading ? 'Un momento...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </div>
        <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
          className="mt-4 text-sm text-[var(--accent)]">
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </main>
  )
}