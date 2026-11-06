// Ruta de API del Asistente — el cerebro (Claude) vive aquí, en el servidor.
// Recibe el historial del chat y la marca del cliente; devuelve la respuesta en streaming.
// La clave ANTHROPIC_API_KEY la lee el SDK del entorno (Vercel); nunca llega al navegador.

import Anthropic from '@anthropic-ai/sdk'
import { CEREBRO_MODEL, cerebroConfigured } from '@/lib/cerebro/config'
import { buildSystemPrompt } from '@/lib/cerebro/prompt'
import type { BrandProfile } from '@/lib/brand'

export const runtime = 'nodejs'
export const maxDuration = 60

type ChatMessage = { role: 'user' | 'assistant'; content: string }
type Body = { messages?: ChatMessage[]; brand?: BrandProfile }

const encoder = new TextEncoder()

function textResponse(text: string): Response {
  return new Response(encoder.encode(text), {
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

  const client = new Anthropic()
  const system = buildSystemPrompt(body.brand)

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
        await run.finalMessage()
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
