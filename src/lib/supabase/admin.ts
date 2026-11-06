// Cliente de Supabase con clave de servicio (service_role). SOLO en el servidor y SOLO para tareas
// de confianza (el publicador automático). Salta RLS, así que NUNCA debe usarse desde el navegador
// ni exponerse. La clave vive en SUPABASE_SERVICE_ROLE_KEY (variable de entorno de Vercel).

import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
