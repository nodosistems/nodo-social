// Biblioteca de fotos del cliente ("Mis fotos").
// El cliente sube sus fotos (de la clínica, del equipo, del local…) y el asistente puede elegir
// la que mejor encaje en cada pieza. Las FOTOS (archivos) van a Supabase Storage (bucket público
// `brand-photos`), porque son pesadas y además necesitamos una URL pública para que Instagram
// pueda descargarlas al publicar. El ÍNDICE (id, url, etiqueta) se guarda de momento en
// localStorage, igual que la marca y las publicaciones programadas; se moverá a Supabase cuando
// cableemos el guardado por cuenta.
//
// A PRUEBA DE FALLOS: toda lectura/escritura de localStorage va en try/catch; si Supabase no
// está configurado, subir queda desactivado con un aviso amable (la app no se rompe).

import { createClient } from '@/lib/supabase/client'
import { supabaseConfigured } from '@/lib/supabase/config'

export const PHOTO_BUCKET = 'brand-photos'
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024 // 10 MB por foto

// Una foto subida por el cliente.
export type BrandPhoto = {
  id: string // = nombre del archivo en el bucket (sin carpeta)
  path: string // ruta completa en el bucket: `${userId}/${id}.${ext}`
  url: string // URL pública (la usa la tarjeta y, más adelante, Instagram)
  label: string // descripción corta para que el asistente sepa qué muestra
  createdAt: number
}

const KEY = 'nodo.photos'

export function getPhotos(): BrandPhoto[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]') as BrandPhoto[]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function savePhotos(list: BrandPhoto[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* almacenamiento no disponible */
  }
}

export function photoById(id: string | undefined): BrandPhoto | undefined {
  if (!id) return undefined
  return getPhotos().find((p) => p.id === id)
}

export function photoUrlById(id: string | undefined): string | undefined {
  return photoById(id)?.url
}

function uid(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return 'f_' + Math.random().toString(36).slice(2)
  }
}

function extOf(file: File): string {
  const fromName = file.name.includes('.') ? file.name.split('.').pop()! : ''
  const clean = fromName.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (clean) return clean
  // Deducir por el tipo si el nombre no tiene extensión.
  const t = file.type.split('/')[1] || 'jpg'
  return t === 'jpeg' ? 'jpg' : t
}

export class PhotoError extends Error {}

// Sube una foto al bucket y la añade al índice. Devuelve la foto creada.
export async function uploadPhoto(file: File, label = ''): Promise<BrandPhoto> {
  if (!supabaseConfigured) {
    throw new PhotoError(
      'Las fotos aún no están disponibles: falta terminar de conectar el almacenamiento. Avísanos y lo activamos.',
    )
  }
  if (!file.type.startsWith('image/')) {
    throw new PhotoError('Solo se pueden subir imágenes (JPG, PNG, WEBP…).')
  }
  if (file.size > MAX_PHOTO_BYTES) {
    throw new PhotoError('La foto es demasiado grande (máximo 10 MB).')
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new PhotoError('Tienes que iniciar sesión para subir fotos. Recarga la página.')
  }

  const id = uid()
  const path = `${user.id}/${id}.${extOf(file)}`

  const { error: upErr } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (upErr) {
    throw new PhotoError('No he podido subir la foto. Inténtalo de nuevo en un momento.')
  }

  const { data: pub } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path)
  const photo: BrandPhoto = {
    id,
    path,
    url: pub.publicUrl,
    label: label.trim(),
    createdAt: Date.now(),
  }
  savePhotos([photo, ...getPhotos()])
  return photo
}

// Cambia la etiqueta de una foto (solo en el índice).
export function setPhotoLabel(id: string, label: string): void {
  savePhotos(getPhotos().map((p) => (p.id === id ? { ...p, label: label.trim() } : p)))
}

// Borra una foto del bucket y del índice. "Fail-open": si el borrado remoto falla, igualmente la
// quitamos del índice para que el cliente no la siga viendo.
export async function removePhoto(id: string): Promise<void> {
  const photo = photoById(id)
  if (photo && supabaseConfigured) {
    try {
      await createClient().storage.from(PHOTO_BUCKET).remove([photo.path])
    } catch {
      /* la quitamos del índice igualmente */
    }
  }
  savePhotos(getPhotos().filter((p) => p.id !== id))
}

// Resumen compacto de las fotos para que el cerebro (Claude) pueda elegir una por su id.
export function photosForPrompt(photos: BrandPhoto[]): string {
  if (!photos.length) return ''
  return photos
    .map((p) => `${p.id} (${p.label || 'sin descripción'})`)
    .join('; ')
}
