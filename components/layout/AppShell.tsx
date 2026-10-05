'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV, MOBILE_PRIMARY } from '@/lib/nav'
import LogoutButton from './LogoutButton'
import LegalLinks from '@/components/legal/LegalLinks'

export default function AppShell({ children, isAdmin = false }: { children: React.ReactNode; isAdmin?: boolean }) {
  const path = usePathname()
  const active = (h: string) => path === h || path.startsWith(h + '/')
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="hidden lg:flex flex-col gap-1 p-4 border-r border-[var(--line)] sticky top-0 h-dvh">
        <div className="px-3 py-4 text-xl font-semibold">Mentora</div>
        <nav aria-label="Principal" className="flex flex-col gap-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} aria-current={active(n.href) ? 'page' : undefined}
              className={`px-3 py-2 rounded-lg transition-colors ${active(n.href) ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'hover:bg-[var(--surface)]'}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/premium" className="mt-4 rounded-lg border border-[var(--premium)]/40 bg-[var(--premium)]/10 px-3 py-2 text-sm font-medium text-[var(--premium)]">
          ✦ Mentora Premium
        </Link>
        {isAdmin && (
          <Link href="/admin" className="mt-2 rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-medium">
            Administración
          </Link>
        )}
        <LogoutButton />
        <LegalLinks className="mt-3 px-3" />
      </aside>
      <main className="page-enter p-4 sm:p-6 pb-24 lg:pb-6 min-w-0">{children}</main>
      <nav aria-label="Móvil" className="lg:hidden fixed bottom-0 inset-x-0 card rounded-none border-x-0 border-b-0 flex justify-around py-2 pb-[env(safe-area-inset-bottom)]">
        {NAV.filter(n => MOBILE_PRIMARY.includes(n.href)).map(n => (
          <Link key={n.href} href={n.href} aria-current={active(n.href) ? 'page' : undefined}
            className={`min-h-11 min-w-11 px-2 flex items-center text-sm ${active(n.href) ? 'text-[var(--accent)] font-semibold' : 'text-[var(--muted)]'}`}>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}