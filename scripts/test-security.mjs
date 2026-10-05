import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const { TEST_EMAIL, TEST_PASSWORD } = process.env
if (!url || !key || !TEST_EMAIL || !TEST_PASSWORD) {
  console.log('Faltan variables de entorno.')
  process.exit(1)
}

let fails = 0
const check = (name, ok) => { console.log(`${ok ? '✅' : '❌'} ${name}`); if (!ok) fails++ }

const anon = createClient(url, key)
const p0 = await anon.from('profiles').select('id')
check('Sin sesión no se leen perfiles', !p0.data || p0.data.length === 0)
const d0 = await anon.from('documents').select('id')
check('Sin sesión no se leen documentos', !d0.data || d0.data.length === 0)

const sb = createClient(url, key)
const { data: login, error: loginError } = await sb.auth.signInWithPassword({ email: TEST_EMAIL, password: TEST_PASSWORD })
if (loginError) { console.log('No se pudo iniciar sesión:', loginError.message); process.exit(1) }
const uid = login.user.id

await sb.from('profiles').update({ role: 'admin' }).eq('id', uid)
const { data: me } = await sb.from('profiles').select('role').eq('id', uid).single()
check('No puede hacerse administrador', me?.role !== 'admin')

const s = await sb.from('subscriptions').insert({ user_id: uid, status: 'active', plan: 'trampa' })
check('No puede darse Premium', !!s.error)

const { data: level } = await sb.from('levels').select('id').limit(1).single()
const c = await sb.from('certificates').insert({ user_id: uid, level_id: level?.id })
check('No puede crearse certificados', !!c.error)

const k = await sb.from('courses').insert({ title: 'x', slug: 'x-prueba' })
check('No puede crear cursos', !!k.error)

const a = await sb.rpc('admin_set_premium', { target_email: TEST_EMAIL, days: 30 })
check('No puede usar funciones de administrador', !!a.error)

const { data: prem } = await sb.from('lessons').select('id').eq('access_tier', 'premium').limit(1)
if (prem?.length) {
  const v = await sb.from('lesson_videos').select('video_url').eq('lesson_id', prem[0].id)
  check('No ve el vídeo de una lección Premium', !v.data || v.data.length === 0)
  const p = await sb.from('user_progress').upsert({ user_id: uid, lesson_id: prem[0].id, completed_at: new Date().toISOString() })
  check('No puede completar una lección Premium', !!p.error)
} else {
  console.log('⚠️ No hay lecciones Premium para probar')
}

await sb.auth.signOut()
console.log(fails === 0 ? '\nTodo correcto.' : `\n${fails} fallo(s). No publiques hasta arreglarlos.`)