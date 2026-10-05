import 'server-only'
export type Tier = 'free' | 'premium'
export function canAccess(tier: Tier, sub: { status: string; current_period_end?: string | null } | null) {
  if (tier === 'free') return true
  return !!sub && sub.status === 'active' && (!sub.current_period_end || new Date(sub.current_period_end) > new Date())
}