'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function NuevaContrasenaPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setError('')
    if (password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.')
    if (password !== confirm) return setError('Las contraseñas no coinciden.')
    setLoading(true)
    const { error } = await createClient().auth.updateUser({ password })
    setLoading(false)
    if (error) return setError('El enlace ha caducado o no es válido. Pide uno nuevo.')
    router.push('/inicio')
    router.refresh()
  }

  const input = 'w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 outline-none focus:border-[var(--accent)]'

  return (
    <main className="min-h-dvh grid place-items-center p-4">
      <div className="card page-enter w-full max-w-sm p-6">
        <h1 className="text-2xl font-semibold">Nueva contraseña</h1>
        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label htmlFor="p1" className="text-sm">Contraseña nueva</label>
            <input id="p1" type="password" className={input} value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label htmlFor="p2" className="text-sm">Repítela</label>
            <input id="p2" type="password" className={input} value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button onClick={submit} disabled={loading}
            className="min-h-11 rounded-lg bg-[var(--accent)] font-medium text-[var(--accent-ink)] disabled:opacity-60">
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </div>
        <Link href="/recuperar" className="mt-4 inline-block text-sm text-[var(--accent)]">Pedir un enlace nuevo</Link>
      </div>
    </main>
  )
}