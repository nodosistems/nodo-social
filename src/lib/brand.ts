// Perfil de marca del negocio (localStorage, por navegador).
// PROVISIONAL hasta conectar Supabase: entonces se mueve a `brand_profiles` del workspace.
// Lo usan "Mi marca" (lo guarda), el Asistente (saludo + contexto para el cerebro) y la API.
// Toda lectura/escritura va envuelta en try/catch para que la app funcione sin almacenamiento.

export type BrandProfile = {
  business_name: string
  sector: string
  audience: string
  tone: string
  talk_about: string
  avoid: string
  primary_color: string
  accent_color: string
  typography: string
  link_web: string
  link_calculator: string
  link_form: string
}

export const emptyBrand: BrandProfile = {
  business_name: '',
  sector: '',
  audience: '',
  tone: '',
  talk_about: '',
  avoid: '',
  primary_color: '#12264A',
  accent_color: '#E2603F',
  typography: '',
  link_web: '',
  link_calculator: '',
  link_form: '',
}

const KEY = 'nodo.brand'

export function getBrand(): BrandProfile {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyBrand
    return { ...emptyBrand, ...(JSON.parse(raw) as Partial<BrandProfile>) }
  } catch {
    return emptyBrand
  }
}

export function saveBrand(brand: BrandProfile): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(brand))
  } catch {
    /* almacenamiento no disponible */
  }
}

// Nombre para el saludo; cae en un genérico amable si aún no hay marca guardada.
export function brandDisplayName(brand: BrandProfile): string {
  return brand.business_name.trim() || 'por aquí'
}
