// Guarda en la nube (Supabase) las publicaciones que el cliente programa, para que el servidor
// pueda PUBLICARLAS SOLAS a su hora. Es ADICIONAL al guardado en localStorage (que mueve la UI):
// A PRUEBA DE FALLOS — si Supabase no está configurado o la escritura falla, no pasa nada, el
// "Programado ✓" de la tarjeta sigue funcionando con localStorage.

import { createClient } from '@/lib/supabase/client'
import { supabaseConfigured } from '@/lib/supabase/config'
import type { ScheduledPost } from '@/lib/content'

// Inserta una publicación programada en Supabase. Devuelve el id creado, o null si no se pudo
// (sin romper nada). `imageUrl` = URL pública de la foto elegida (si la pieza usa foto).
export async function scheduleToCloud(
  post: ScheduledPost,
  imageUrl?: string,
): Promise<string | null> {
  if (!supabaseConfigured) return null
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null // sin sesión: se queda solo en local

    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert({
        created_by: user.id,
        piece: post,
        format: post.format,
        caption: post.caption,
        image_url: imageUrl ?? null,
        music_id: post.musicId ?? null,
        scheduled_at: new Date(post.scheduledAt).toISOString(),
        status: 'programada',
      })
      .select('id')
      .single()

    if (error) return null
    return (data?.id as string | undefined) ?? null
  } catch {
    return null // fail-open
  }
}
