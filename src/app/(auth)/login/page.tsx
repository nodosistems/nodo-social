'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/client'

type Mode = 'entrar' | 'crear'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('entrar')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (!supabaseConfigured) {
      setError('El servidor aún no está conectado. En cuanto configuremos Supabase, esto funcionará.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      if (mode === 'entrar') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/asistente')
        router.refresh()
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.session) {
          router.push('/asistente')
          router.refresh()
        } else {
          setInfo('Te hemos enviado un correo para confirmar la cuenta. Revísalo y vuelve a entrar.')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo no ha ido bien. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Panel de marca (escritorio) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-navy p-12 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-coral/90">
            <span className="h-3 w-3 rounded-full bg-white" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">
            Nodo <span className="text-white/60">Social</span>
          </span>
        </div>
        <div className="max-w-md">
          <h1 className="font-display text-4xl font-semibold leading-tight">
            Tu Instagram en piloto automático.
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Pídeselo a tu asistente. Él planifica, lo crea con tu marca y lo publica solo.
          </p>
        </div>
        <p className="text-sm text-white/40">Un producto de Nodo.</p>
      </div>

      {/* Formulario */}
      <div className="flex w-full flex-col items-center justify-center bg-cloud px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Marca en móvil */}
          <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-coral/90">
              <span className="h-3 w-3 rounded-full bg-white" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              Nodo <span className="text-muted">Social</span>
            </span>
          </div>

          <h2 className="font-display text-2xl font-semibold text-ink">
            {mode === 'entrar' ? 'Entra en tu cuenta' : 'Crea tu cuenta'}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {mode === 'entrar'
              ? 'Gestiona el Instagram de tu negocio desde un solo sitio.'
              : 'Empieza a gestionar tu Instagram en minutos.'}
          </p>

          {/* Conmutador */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-line bg-white p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode('entrar')}
              className={`rounded-lg py-2 font-medium transition-colors ${
                mode === 'entrar' ? 'bg-navy text-white' : 'text-muted hover:text-ink'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode('crear')}
              className={`rounded-lg py-2 font-medium transition-colors ${
                mode === 'crear' ? 'bg-navy text-white' : 'text-muted hover:text-ink'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
                Correo
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@clinica.com"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-shadow placeholder:text-muted/60 focus:border-navy/30 focus:ring-2 focus:ring-navy/10"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'entrar' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-shadow placeholder:text-muted/60 focus:border-navy/30 focus:ring-2 focus:ring-navy/10"
              />
            </div>

            {error ? (
              <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>
            ) : null}
            {info ? (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-coral py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Un momento…' : mode === 'entrar' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>

          {!supabaseConfigured ? (
            <p className="mt-5 rounded-lg border border-line bg-white px-3 py-2 text-center text-xs text-muted">
              Vista previa del diseño. El acceso real se activa al conectar Supabase.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
