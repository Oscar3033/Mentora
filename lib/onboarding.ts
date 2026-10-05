export const PROGRAM_KEYWORDS: Record<string, string> = {
  'CapCut': 'capcut',
  'DaVinci Resolve': 'davinci',
  'Premiere Pro': 'premiere',
  'After Effects': 'after effects',
  'Canva': 'canva',
  'Photopea': 'photopea',
  'Photoshop': 'photoshop',
}

export type Step = { key: string; title: string; multi: boolean; options: string[] }

export const STEPS: Step[] = [
  { key: 'goals', title: '¿Qué quieres conseguir con Mentora?', multi: true,
    options: ['Aprender a editar vídeo', 'Crear mejor contenido', 'Mejorar mis miniaturas y diseño', 'Organizar mi canal', 'Empezar desde cero'] },
  { key: 'creator', title: '¿Qué tipo de creador eres?', multi: false,
    options: ['Todavía no creo contenido', 'YouTuber', 'TikToker / Shorts', 'Streamer', 'Editor o diseñador'] },
  { key: 'platforms', title: '¿Qué plataformas utilizas?', multi: true,
    options: ['YouTube', 'TikTok', 'Instagram', 'Twitch', 'Ninguna todavía'] },
  { key: 'programs', title: '¿Qué programas usas o quieres aprender?', multi: true,
    options: [...Object.keys(PROGRAM_KEYWORDS), 'Ninguno todavía'] },
  { key: 'level', title: '¿Cuál es tu nivel?', multi: false,
    options: ['Principiante', 'Intermedio', 'Avanzado'] },
  { key: 'improve', title: '¿Qué quieres mejorar?', multi: true,
    options: ['Ideas y guiones', 'Hooks y retención', 'Edición', 'Miniaturas y títulos', 'Constancia y organización'] },
  { key: 'time', title: '¿Cuánto tiempo puedes dedicar al día?', multi: false,
    options: ['15 minutos', '30 minutos', '1 hora', 'Más de 1 hora'] },
]