export const LEGAL = {
  brand: 'Mentora',
  owner: '[Mentora S.L.]',
  taxId: '[No se]',
  address: '[Mentora]',
  email: '[mentoraweb@gmail.com]',
  site: '[https://tu-dominio.com]',
  updated: '[10/10/2026]',
  hosting: '[VERCEL]',
  mailProvider: '[RESEND]',
  dataRegion: '[españa]',
  cookieDuration: '[1 mes]',
  videoHost: '[VIMEO]',
  refundPolicy: '[POLÍTICA DE REEMBOLSOS Y DESISTIMIENTO,]',
}

export const legalPending = Object.values(LEGAL).some(v => v.startsWith('['))