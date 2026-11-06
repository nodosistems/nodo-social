// Configuración del cerebro (Claude) — SOLO servidor.
// La clave vive en la variable de entorno ANTHROPIC_API_KEY (en Vercel), nunca en el código.
//
// Modelo: "modelo pequeño para el día a día" (CLAUDE.md). Por defecto Claude Sonnet 5.5,
// que da buena calidad de contenido a un coste razonable. Se puede cambiar sin tocar código
// con la variable ANTHROPIC_MODEL (p. ej. claude-haiku-5-5 para abaratar, o claude-opus-5-5
// para máxima calidad). El coste lo cubre la cuota del cliente (una sola clave central de Nodo).

export const CEREBRO_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5'

// true cuando hay clave puesta en el entorno. Permite que la app arranque y avise con elegancia
// si todavía no se ha configurado el cerebro.
export const cerebroConfigured = Boolean(process.env.ANTHROPIC_API_KEY)
