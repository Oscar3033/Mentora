'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RecuperarPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setError('')
    setLoading(true)
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/nueva-contrasena`,
    })
    setLoading(false)
    if (error) return setError('No se pudo enviar el correo. Inténtalo de nuevo en unos minutos.')
    setSent(true)
  }

  return (
    <main className="min-h-dvh grid place-items-center p-4">
      <div className="card page-enter w-full max-w-sm p-6">
        <h1 className="text-2xl font-semibold">Recuperar contraseña</h1>
        {sent ? (
          <p role="status" className="mt-4 text-[var(--muted)]">
            Si ese correo tiene una cuenta, te hemos enviado un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <label htmlFor="email" className="text-sm">Correo de tu cuenta</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 outline-none focus:border-[var(--accent)]" />
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <button onClick={submit} disabled={loading || !email}
              className="min-h-11 rounded-lg bg-[var(--accent)] font-medium text-[var(--accent-ink)] disabled:opacity-60">
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </div>
        )}
        <Link href="/login" className="mt-4 inline-block text-sm text-[var(--accent)]">← Volver a iniciar sesión</Link>
      </div>
    </main>
  )
}