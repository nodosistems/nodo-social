// Librería de música para reels/vídeos.
// REGLA DE ORO (marca Nodo): NUNCA canciones famosas o con copyright por API — Instagram las
// silencia. Solo música libre o con licencia. La canción de moda la añade el cliente a mano en
// la app de Instagram; aquí trabajamos con audio propio/libre.
//
// Por ahora es un catálogo (metadatos) para que el usuario ELIJA en la vista previa. El archivo
// de audio real se asocia cuando montemos el motor de vídeo/publicación (se guardará la pista en
// almacenamiento y `src` apuntará a ella). Ampliable: añade entradas sin tocar nada más.

export type Track = {
  id: string
  name: string
  mood: string // para que el asistente/usuario elija por sensación
  description: string
  src?: string // url del audio (se rellena al integrar el motor de vídeo)
}

export const NO_MUSIC = 'none'

export const musicLibrary: Track[] = [
  { id: 'calma-suave', name: 'Calma', mood: 'Suave y cercano', description: 'Piano tranquilo, ideal para hábitos y bienestar.' },
  { id: 'luz-manana', name: 'Luz de mañana', mood: 'Fresco y optimista', description: 'Acústico alegre, buen rollo sin estridencias.' },
  { id: 'enfoque', name: 'Enfoque', mood: 'Corporativo y claro', description: 'Limpio y profesional, para consejos y divulgación.' },
  { id: 'impulso', name: 'Impulso', mood: 'Enérgico', description: 'Ritmo que engancha, para reels con gancho rápido.' },
  { id: 'calidez', name: 'Calidez', mood: 'Cálido e inspirador', description: 'Emotivo y humano, para historias y testimonios.' },
  { id: 'elegante', name: 'Elegante', mood: 'Sofisticado', description: 'Minimalista y cuidado, para marca premium.' },
]

export function trackById(id: string | undefined): Track | undefined {
  if (!id || id === NO_MUSIC) return undefined
  return musicLibrary.find((t) => t.id === id)
}

// Resumen de la librería para que el cerebro (Claude) sepa qué música puede proponer.
export function musicCatalogForPrompt(): string {
  return musicLibrary.map((t) => `${t.id} ("${t.name}", ${t.mood})`).join('; ')
}
