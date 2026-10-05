import Link from 'next/link'

const links = [
  ['/privacidad', 'Privacidad'],
  ['/cookies', 'Cookies'],
  ['/aviso-legal', 'Aviso legal'],
  ['/terminos', 'Términos'],
] as const

export default function LegalLinks({ className = '' }: { className?: string }) {
  return (
    <nav aria-label="Información legal" className={`flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)] ${className}`}>
      {links.map(([href, label]) => (
        <Link key={href} href={href} className="hover:text-[var(--ink)] hover:underline">{label}</Link>
      ))}
    </nav>
  )
}