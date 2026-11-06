// Publicación en Instagram con la API oficial de Meta (Graph API), desde el servidor.
// Mismo patrón que el publicador probado de `contenidonodo`: se crea un "contenedor" de media con
// la URL pública de la imagen, se espera a que Instagram la procese y se publica.
//
// REGLA: la imagen tiene que estar en una URL PÚBLICA (por eso el bucket `brand-photos` es público).
// El token y el id de cuenta NUNCA se escriben en logs ni se devuelven al cliente.

const API = 'https://graph.facebook.com/v22.0'

class GraphError extends Error {}

async function graphPost(path: string, params: Record<string, string>): Promise<Record<string, unknown>> {
  const res = await fetch(`${API}/${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  })
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    const msg = (json?.error as { message?: string })?.message || `Graph API ${res.status}`
    throw new GraphError(msg)
  }
  return json
}

async function graphGet(path: string, params: Record<string, string>): Promise<Record<string, unknown>> {
  const q = new URLSearchParams(params).toString()
  const res = await fetch(`${API}/${path}?${q}`)
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    const msg = (json?.error as { message?: string })?.message || `Graph API ${res.status}`
    throw new GraphError(msg)
  }
  return json
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export type IgCreds = { igUserId: string; token: string }

// Comprueba que el token es válido y devuelve el @usuario de la cuenta.
export async function checkAccount(creds: IgCreds): Promise<string> {
  const info = await graphGet(creds.igUserId, { fields: 'username', access_token: creds.token })
  return String(info.username ?? '')
}

// Publica una foto (post simple de una imagen) con su caption. Devuelve id y enlace del post.
export async function publishPhoto(
  creds: IgCreds,
  imageUrl: string,
  caption: string,
): Promise<{ mediaId: string; permalink: string }> {
  const container = await graphPost(`${creds.igUserId}/media`, {
    image_url: imageUrl,
    caption,
    access_token: creds.token,
  })
  const creationId = String(container.id ?? '')
  if (!creationId) throw new GraphError('Instagram no devolvió contenedor de media.')

  // Instagram necesita un momento para procesar la imagen antes de publicar.
  await sleep(8000)

  const published = await graphPost(`${creds.igUserId}/media_publish`, {
    creation_id: creationId,
    access_token: creds.token,
  })
  const mediaId = String(published.id ?? '')
  if (!mediaId) throw new GraphError('Instagram no devolvió id de publicación.')

  let permalink = ''
  try {
    const link = await graphGet(mediaId, { fields: 'permalink', access_token: creds.token })
    permalink = String(link.permalink ?? '')
  } catch {
    /* el post ya está publicado; el permalink es secundario */
  }
  return { mediaId, permalink }
}
