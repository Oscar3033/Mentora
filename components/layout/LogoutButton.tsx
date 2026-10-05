'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  async function logout() {
    await createClient().auth.signOut()
    router.push('/login')
    router.refresh()
  }
  return (
    <button onClick={logout}
      className="mt-auto px-3 py-2 rounded-lg text-left text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface)]">
      Cerrar sesión
    </button>
  )
}