// Config de Supabase. Lee las variables públicas (inlined por Next en cliente y servidor).
// `supabaseConfigured` permite que la app arranque aunque todavía no haya proyecto Supabase.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
