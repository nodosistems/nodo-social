import { Icon } from '@/components/icons'
import { PageHeader } from '@/components/page-header'

const chips = ['Plan de esta semana', 'Un reel con avatar', 'Carrusel sobre un tema', 'Súbelo el jueves']

export default function AsistentePage() {
  return (
    <>
      <PageHeader
        title="Asistente"
        subtitle="Pídeme lo que quieras publicar. Yo lo creo y lo programo."
        right={
          <div className="hidden items-center gap-2 text-sm text-muted sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> En línea
          </div>
        }
      />

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
    </>
  )
}
