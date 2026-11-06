// Publicador automático. Lo llama el cron de Vercel en las franjas (o se puede llamar a mano con
// el secreto). Busca en Supabase las publicaciones que YA TOCAN (status 'programada', fecha pasada,
// con imagen pública) y las publica en Instagram. Marca cada una como 'publicada' o 'error'.
//
// SEGURIDAD:
// - Requiere cabecera Authorization: Bearer <CRON_SECRET> (Vercel la añade sola en el cron).
// - Usa la clave service_role (solo servidor) para leer/escribir saltando RLS.
// - Si faltan la clave de servicio o las credenciales de Instagram, NO hace nada (no rompe nada).
// - `?dry=1` enseña lo que publicaría SIN publicar (para probar sin riesgo).
//
// MVP: publica FOTOS (post de una imagen) de la cuenta de Nodo (IG_USER_ID / IG_TOKEN del entorno).
// Más adelante: carruseles/reels y una cuenta de Instagram por cliente (workspace).

import { createAdminClient } from '@/lib/supabase/admin'
import { publishPhoto, type IgCreds } from '@/lib/instagram/publish'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_PER_RUN = 5 // cada publicación espera ~8s; límite prudente por ejecución

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.get('authorization') === `Bearer ${secret}`
}

type DuePost = {
  id: string
  caption: string | null
  image_url: string | null
  piece: { caption?: string } | null
}

async function run(req: Request): Promise<Response> {
  if (!authorized(req)) return json({ ok: false, reason: 'no autorizado' }, 401)

  const dry = new URL(req.url).searchParams.get('dry') === '1'

  const supabase = createAdminClient()
  if (!supabase) return json({ ok: false, reason: 'falta SUPABASE_SERVICE_ROLE_KEY' }, 200)

  const igUserId = process.env.IG_USER_ID?.trim()
  const token = process.env.IG_TOKEN?.trim()
  const creds: IgCreds | null = igUserId && token ? { igUserId, token } : null

  // Lo que ya toca: programada, con fecha pasada y con imagen pública (fotos, por ahora).
  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('scheduled_posts')
    .select('id, caption, image_url, piece')
    .eq('status', 'programada')
    .lte('scheduled_at', nowIso)
    .not('image_url', 'is', null)
    .order('scheduled_at', { ascending: true })
    .limit(MAX_PER_RUN)

  if (error) return json({ ok: false, reason: 'error leyendo la cola', detail: error.message }, 200)
  const posts = (data ?? []) as DuePost[]

  if (dry) {
    return json({ ok: true, dry: true, hasCreds: Boolean(creds), due: posts.length, ids: posts.map((p) => p.id) })
  }
  if (!creds) return json({ ok: false, reason: 'faltan IG_USER_ID / IG_TOKEN', due: posts.length }, 200)
  if (posts.length === 0) return json({ ok: true, published: 0, due: 0 })

  const results: { id: string; status: string; permalink?: string; error?: string }[] = []
  for (const p of posts) {
    if (!p.image_url) continue
    // Marca "publicando" para que una segunda ejecución no la repita.
    await supabase.from('scheduled_posts').update({ status: 'publicando', updated_at: nowIso }).eq('id', p.id)
    try {
      const caption = (p.caption || p.piece?.caption || '').toString()
      const { mediaId, permalink } = await publishPhoto(creds, p.image_url, caption)
      await supabase
        .from('scheduled_posts')
        .update({ status: 'publicada', media_id: mediaId, permalink, error: null, updated_at: new Date().toISOString() })
        .eq('id', p.id)
      results.push({ id: p.id, status: 'publicada', permalink })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'error al publicar'
      await supabase
        .from('scheduled_posts')
        .update({ status: 'error', error: msg, updated_at: new Date().toISOString() })
        .eq('id', p.id)
      results.push({ id: p.id, status: 'error', error: msg })
    }
  }

  return json({ ok: true, published: results.filter((r) => r.status === 'publicada').length, results })
}

export async function GET(req: Request): Promise<Response> {
  return run(req)
}

export async function POST(req: Request): Promise<Response> {
  return run(req)
}
