export type Folder = { id: string; name: string; parent_id: string | null }

export function descendants(id: string, list: Folder[]): Set<string> {
  const out = new Set<string>([id])
  let grew = true
  while (grew) {
    grew = false
    for (const f of list) {
      if (f.parent_id && out.has(f.parent_id) && !out.has(f.id)) {
        out.add(f.id)
        grew = true
      }
    }
  }
  return out
}

export function folderLabel(f: Folder, list: Folder[]): string {
  const byId = new Map(list.map(x => [x.id, x]))
  const parts = [f.name]
  let p = f.parent_id ? byId.get(f.parent_id) : undefined
  while (p) {
    parts.unshift(p.name)
    p = p.parent_id ? byId.get(p.parent_id) : undefined
  }
  return parts.join(' / ')
}