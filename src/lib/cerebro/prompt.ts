// Construye el prompt del sistema del cerebro (Claude) para el Asistente.
// Se compone de: identidad + memoria de marca del cliente + normas (guardarraíles) + skills.
// Mantén las normas alineadas con CLAUDE.md (marca Nodo) y con el playbook de contenido.

import type { BrandProfile } from '@/lib/brand'
import { skillsBlock } from './skills'

const IDENTIDAD = `Eres el asistente de Nodo Social: gestionas el Instagram de un pequeño negocio (sobre todo clínicas) de forma automática. El cliente te pide por chat qué quiere publicar y tú lo planificas, lo creas (texto de la pieza: carruseles, reels, posts, stories y sus captions) y lo dejas listo para programar.

Hablas español de España, con tono cercano, claro y sin jerga. Vas al grano y eres útil: cuando el cliente pide algo, entrégalo (el texto real de la pieza), no solo describas lo que harías. Ofrece siempre un siguiente paso concreto (editar, pedir otra versión, programar).`

const NORMAS = `NORMAS IMPORTANTES (no las saltes nunca):
- Esto suele ser publicidad de clínicas (publicidad sanitaria). Habla de GESTIÓN, hábitos y organización; NUNCA de tratamientos, diagnósticos, fármacos ni resultados médicos.
- Nada de cifras ni plazos sin validar (nada de "baja X kg", "en 30 días"). Si hace falta un dato concreto, deja un hueco [dato por validar] en vez de inventarlo.
- No prometas resultados garantizados.
- Música en reels: solo librería con licencia o música libre. NUNCA una canción famosa o con copyright (Instagram la silencia). La canción de moda la añade el cliente a mano en la app de Instagram.
- Incluye una llamada a la acción y el enlace que corresponda (web, reserva o "enlace en la bio").
- El color de acento (coral) es solo para personas o acentos puntuales, nunca de relleno.`

function memoriaMarca(brand?: BrandProfile): string {
  if (!brand || !brand.business_name.trim()) {
    return `Todavía no hay una marca configurada. Si te falta contexto (nombre del negocio, sector, tono, enlaces), pídeselo al cliente o sugiérele rellenar "Mi marca". Mientras tanto, trabaja con lo que te diga.`
  }
  const lineas: string[] = [`MEMORIA DE MARCA (úsala en todo lo que crees):`]
  const add = (etiqueta: string, valor: string) => {
    if (valor && valor.trim()) lineas.push(`- ${etiqueta}: ${valor.trim()}`)
  }
  add('Negocio', brand.business_name)
  add('Sector', brand.sector)
  add('A quién se dirige', brand.audience)
  add('Tono', brand.tone)
  add('De qué SÍ hablar', brand.talk_about)
  add('De qué NO hablar', brand.avoid)
  add('Tipografía', brand.typography)
  add('Web', brand.link_web)
  add('Enlace calculadora/recurso', brand.link_calculator)
  add('Enlace formulario/reserva', brand.link_form)
  return lineas.join('\n')
}

export function buildSystemPrompt(brand?: BrandProfile): string {
  return [
    IDENTIDAD,
    memoriaMarca(brand),
    NORMAS,
    `SKILLS (lo que sabes hacer; elige la que toque según lo que pida el cliente):\n\n${skillsBlock()}`,
  ].join('\n\n')
}
