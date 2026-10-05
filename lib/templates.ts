export const TEMPLATES = {
  blank: { label: 'En blanco', title: 'Sin título', content: '' },
  guion: {
    label: 'Guion de vídeo',
    title: 'Guion',
    content: 'HOOK (primeros 3 segundos)\n\n\nINTRODUCCIÓN\n\n\nDESARROLLO\n\n\nCIERRE Y LLAMADA A LA ACCIÓN\n',
  },
  checklist: {
    label: 'Checklist de publicación',
    title: 'Checklist',
    content: '- [ ] Idea\n- [ ] Guion\n- [ ] Grabación\n- [ ] Edición\n- [ ] Miniatura\n- [ ] Título y descripción\n- [ ] Publicación\n- [ ] Revisar estadísticas\n',
  },
  ideas: {
    label: 'Lista de ideas',
    title: 'Ideas',
    content: 'IDEAS DE VÍDEOS\n- \n- \n- \n\nIDEAS DE SHORTS\n- \n- \n- \n',
  },
  notas: { label: 'Notas', title: 'Notas', content: 'Fecha:\n\nNotas:\n' },
} as const

export type TemplateKey = keyof typeof TEMPLATES
export const TEMPLATE_KEYS = Object.keys(TEMPLATES) as [TemplateKey, ...TemplateKey[]]