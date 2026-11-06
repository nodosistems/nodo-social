// Ruta de API del Asistente — el cerebro (Claude) vive aquí, en el servidor.
// Recibe el historial del chat y la marca del cliente; devuelve la respuesta en streaming.
// La clave ANTHROPIC_API_KEY la lee el SDK del entorno (Vercel); nunca llega al navegador.
//
// SEGURIDAD:
// 1) Login obligatorio: sin sesión iniciada no se puede usar (evita que nadie gaste el
//    crédito de Claude "desde fuera").
// 2) Límite de uso por cliente (workspace) al día (tabla ai_usage). Las comprobaciones de
//    uso son "fail-open": si algo falla en la base de datos, se deja pasar para no romper el
//    chat (nunca bloquean por un error técnico). El login SÍ es obligatorio.

import Anthropic from '@anthropic-ai/sdk'
import { CEREBRO_MODEL, cerebroConfigured, AI_DAILY_LIMIT } from '@/lib/cerebro/config'
import { buildSystemPrompt } from '@/lib/cerebro/prompt'
import { supabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import type { BrandProfile } from '@/lib/brand'

export const runtime = 'nodejs'
export const maxDuration = 60

type ChatMessage = { role: 'user' | 'assistant'; content: string }
type Body = { messages?: ChatMessage[]; brand?: BrandProfile }

const encoder = new TextEncoder()

function textResponse(text: string, status = 200): Response {
  return new Response(encoder.encode(text), {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  })
}

export async function POST(req: Request): Promise<Response> {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return new Response('Petición no válida', { status: 400 })
  }

  const messages = (body.messages ?? []).filter(
    (m): m is ChatMessage =>
      !!m &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      m.content.trim().length > 0,
  )
  if (messages.length === 0) return new Response('Sin mensajes', { status: 400 })

  // El cerebro aún no tiene clave: respondemos con elegancia en vez de romper.
  if (!cerebroConfigured) {
    return textResponse(
      'Todavía no estoy conectado a mi cerebro. En cuanto se añada la clave de Claude ' +
        '(ANTHROPIC_API_KEY) en Vercel y se vuelva a desplegar, te respondo de verdad y ' +
        'empiezo a crear tus publicaciones. 🙂',
    )
  }

  // ─── Seguridad: login obligatorio + límite de uso por workspace ───
  type SupabaseServer = Awaited<ReturnType<typeof createClient>>
  let supabase: SupabaseServer | null = null
  let userId: string | null = null
  let workspaceId: string | null = null

  if (supabaseConfigured) {
    try {
      supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      userId = data.user?.id ?? null
    } catch {
      userId = null
    }

    // Sin sesión → fuera (esto es lo que protege el crédito de Claude).
    if (!userId || !supabase) {
      return textResponse(
        'Para usar el asistente tienes que iniciar sesión. Recarga la página e inténtalo de nuevo.',
        401,
      )
    }

    // Workspace del usuario (si tiene). El límite solo aplica si pertenece a uno.
    try {
      const { data: member } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle()
      workspaceId = (member?.workspace_id as string | undefined) ?? null
    } catch {
      workspaceId = null // fail-open
    }

    // Límite diario por workspace (fail-open: si el conteo falla, dejamos pasar).
    if (workspaceId) {
      try {
        const start = new Date()
        start.setUTCHours(0, 0, 0, 0)
        const { count } = await supabase
          .from('ai_usage')
          .select('id', { count: 'exact', head: true })
          .eq('workspace_id', workspaceId)
          .gte('created_at', start.toISOString())
        if (typeof count === 'number' && count >= AI_DAILY_LIMIT) {
          return textResponse(
            `Has llegado al límite de ${AI_DAILY_LIMIT} mensajes del asistente por hoy. ` +
              'Mañana se reinicia, o ampliamos tu plan si necesitas más. 🙂',
            429,
          )
        }
      } catch {
        /* fail-open */
      }
    }
  }

  const client = new Anthropic()
  const system = buildSystemPrompt(body.brand)
  const sb = supabase
  const ws = workspaceId
  const uid = userId

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const run = client.messages.stream({
          model: CEREBRO_MODEL,
          max_tokens: 8000,
          // Esfuerzo bajo = respuestas rápidas y baratas para el día a día.
          output_config: { effort: 'low' },
          system,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        })
        run.on('text', (t) => controller.enqueue(encoder.encode(t)))
        const final = await run.finalMessage()

        // Registrar el uso (fail-open: si falla, no pasa nada, el chat ya respondió).
        if (sb && ws) {
          try {
            await sb.from('ai_usage').insert({
              workspace_id: ws,
              user_id: uid,
              input_tokens: final.usage?.input_tokens ?? 0,
              output_tokens: final.usage?.output_tokens ?? 0,
            })
          } catch {
            /* no bloquea */
          }
        }
      } catch (err) {
        const aviso =
          err instanceof Anthropic.AuthenticationError
            ? '\n\n⚠️ La clave de Claude no es válida. Revisa ANTHROPIC_API_KEY en Vercel.'
            : '\n\n⚠️ Ha habido un problema al pensar. Inténtalo otra vez en un momento.'
        controller.enqueue(encoder.encode(aviso))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  })
}
