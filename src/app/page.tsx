import type { ReactNode } from 'react'

type NavItem = { id: string; label: string; icon: ReactNode }

const Icon = {
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 10v10h14V10" /></svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.6 2.6M15.8 15.8l2.6 2.6M18.4 5.6l-2.6 2.6M8.2 15.8l-2.6 2.6" /></svg>
  ),
}

const nav: NavItem[] = [
  { id: 'asistente', label: 'Asistente', icon: Icon.chat },
  { id: 'calendario', label: 'Calendario', icon: Icon.calendar },
  { id: 'publicaciones', label: 'Publicaciones', icon: Icon.grid },
  { id: 'inicio', label: 'Inicio', icon: Icon.home },
]

const chips = ['Plan de esta semana', 'Un reel con avatar', 'Carrusel sobre un tema', 'Súbelo el jueves']

function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-coral/90">
        <span className="h-2.5 w-2.5 rounded-full bg-white" />
      </div>
      <span className="font-display text-lg font-semibold tracking-tight text-white">
        Nodo <span className="text-white/60">Social</span>
      </span>
    </div>
  )
}

export default function Page() {
  const active = 'asistente'
  return (
    <div className="flex h-full">
      {/* Sidebar (escritorio) */}
      <aside className="hidden w-64 shrink-0 flex-col bg-navy p-5 text-white/80 md:flex">
        <Wordmark />
        <nav className="mt-9 flex flex-col gap-1">
          {nav.map((n) => (
            <div
              key={n.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] ${
                n.id === active ? 'bg-white/10 font-medium text-white' : 'hover:bg-white/5'
              }`}
            >
              <span className={`h-5 w-5 ${n.id === active ? 'text-coral' : ''}`}>{n.icon}</span>
              {n.label}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-coral/80 font-semibold text-white">CN</div>
          <div className="leading-tight">
            <div className="text-sm font-medium text-white">Clínica Nutrir</div>
            <div className="text-[12px] text-white/55">Instagram conectado ✓</div>
          </div>
        </div>
      </aside>

      {/* Principal */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-white/70 px-6 py-4">
          <div>
            <h1 className="font-display text-xl font-semibold text-ink">Asistente</h1>
            <p className="text-sm text-muted">Pídeme lo que quieras publicar. Yo lo creo y lo programo.</p>
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> En línea
          </div>
        </header>

        <div className="flex-1 overflow-auto px-6 py-8 pb-24 md:pb-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="text-muted">Hola, Clínica Nutrir 👋</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink">¿Qué publicamos hoy?</h2>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-line bg-white p-2 shadow-sm">
              <input
                disabled
                placeholder="Dime qué quieres publicar y yo lo creo y lo programo"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-muted/70"
              />
              <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-coral text-white">
                <span className="h-5 w-5">{Icon.send}</span>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {chips.map((c) => (
                <span key={c} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink/80">
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-navy px-4 py-3 text-[15px] text-white">
                  Un reel con un avatar explicando por qué cuidarse en enero, para el jueves por la tarde 🎬
                </div>
              </div>

              <div className="flex">
                <div className="max-w-[90%] rounded-2xl rounded-tl-md border border-line bg-white px-4 py-3 text-[15px] text-ink">
                  ¡Hecho! Te propongo esto 👇 Lo dejo listo para el <b>jueves 17:30</b>.
                  <div className="mt-3 overflow-hidden rounded-xl border border-line">
                    <div className="flex gap-3 p-3">
                      <div className="grid h-28 w-[88px] shrink-0 place-items-center rounded-lg bg-gradient-to-b from-navy to-navy-600 px-1 text-center text-[11px] text-white/80">
                        Reel 9:16
                        <br />vista previa
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="rounded-full border border-navy/10 bg-navy/5 px-2 py-0.5 text-[12px] text-navy">Avatar · HeyGen</span>
                          <span className="rounded-full border border-navy/10 bg-navy/5 px-2 py-0.5 text-[12px] text-navy">🎵 Bright Morning</span>
                        </div>
                        <p className="mt-2 text-sm text-ink/80">
                          "En enero cuesta retomar hábitos. Te enseño cómo tu nutricionista lo pone fácil, paso a paso."
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-t border-line p-2.5">
                      <button className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-cloud">✏️ Editar</button>
                      <button className="rounded-lg bg-coral px-3 py-2 text-sm font-medium text-white">Programar</button>
                      <span className="ml-auto inline-flex items-center gap-1 text-[12px] text-muted">
                        <span className="h-4 w-4">{Icon.sparkles}</span> o pídeme otra versión
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Navegación inferior (móvil) */}
      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-white/10 bg-navy py-2.5 text-white/70 md:hidden">
        {nav.map((n) => (
          <div key={n.id} className={`flex flex-col items-center gap-0.5 text-[11px] ${n.id === active ? 'text-coral' : ''}`}>
            <span className="h-5 w-5">{n.icon}</span>
            {n.label}
          </div>
        ))}
      </nav>
    </div>
  )
}
