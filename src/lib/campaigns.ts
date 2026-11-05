// Almacén temporal de campañas (localStorage, por navegador).
// PROVISIONAL hasta conectar Supabase: entonces se mueve a la tabla `campaigns`
// del workspace. Toda lectura/escritura va envuelta en try/catch.

export type Campaign = {
  id: string
  name: string
  sector: string
  tone: string
  audience: string
  objection: string
  urgency: string
  formats: string[] // reel, story, carrusel, vídeo
  media: string[] // "Lo generamos nosotros", "Mis fotos", "Mi música"
  cta: string
  color: string
  status: 'borrador' | 'programada' | 'activa'
  createdAt: number
}

const KEY = 'nodo.campaigns'

export const campaignColors = ['#E2603F', '#12264A', '#2E7D6B', '#B5852A', '#6D5BD0', '#2F7DB5']

export function pickColor(i: number): string {
  return campaignColors[i % campaignColors.length]
}

export function getCampaigns(): Campaign[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as Campaign[]
  } catch {
    return []
  }
}

export function saveCampaigns(list: Campaign[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* almacenamiento no disponible */
  }
}

export function addCampaign(c: Campaign): void {
  saveCampaigns([c, ...getCampaigns()])
}
