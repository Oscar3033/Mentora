import { notFound } from 'next/navigation'
import { NAV } from '@/lib/nav'

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const item = NAV.find(n => n.href === `/${section}`)
  if (!item) notFound()

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">{item.label}</h1>
      <div className="card mt-6 p-6">
        <p className="text-[var(--muted)]">
          Esta sección se construirá en las próximas fases.
        </p>
      </div>
    </div>
  )
}