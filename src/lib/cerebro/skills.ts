// SKILLS DEL CEREBRO
// =================
// Cada "skill" es un bloque de conocimiento/instrucciones que el cerebro (Claude) aplica
// cuando toca. Es la forma en que el cerebro aprende: lo que Nacho (o el cliente) enseñe se
// guarda aquí como una skill nueva y el asistente lo usa a partir de entonces.
//
// Más adelante estas skills podrán vivir por cliente en Supabase (tabla `cerebro_skills`),
// para que cada negocio tenga su propio conocimiento. Hoy son el catálogo base, compartido.
//
// Para añadir una skill: copia un objeto, cambia id/nombre/cuando/instrucciones. Sin tocar
// nada más, el cerebro ya la tiene en cuenta.

export type Skill = {
  id: string
  nombre: string
  // Cuándo usar esta skill (ayuda al cerebro a elegir).
  cuando: string
  // El conocimiento en sí: cómo hacerlo bien.
  instrucciones: string
}

export const skills: Skill[] = [
  {
    id: 'plan-semana',
    nombre: 'Planificar la semana',
    cuando: 'El cliente pide un plan de contenido, qué publicar esta semana o este mes, o un calendario.',
    instrucciones: `Propón un plan realista con la cadencia que tenga el cliente (si no la sabes, 2 publicaciones por semana). Para cada pieza di: día y franja (mañana 07:30 o tarde 20:00), formato (carrusel, reel, post o story), el tema/gancho en una frase y el objetivo. Varía formatos y pilares de contenido. Termina ofreciendo crear la primera pieza.`,
  },
  {
    id: 'crear-carrusel',
    nombre: 'Crear un carrusel',
    cuando: 'El cliente pide un carrusel, un post de varias imágenes o contenido educativo en slides.',
    instrucciones: `Un carrusel de Instagram son de 4 a 8 slides. Slide 1 = gancho potente (una idea, pocas palabras). Slides intermedios = desarrollo, una idea por slide, con un titular corto y una frase de apoyo. Última slide = llamada a la acción. Escribe el texto de cada slide numerado. Luego escribe el caption (ver skill de captions). Tono y marca del cliente.`,
  },
  {
    id: 'crear-reel',
    nombre: 'Crear un reel',
    cuando: 'El cliente pide un reel, un vídeo corto o contenido en vídeo.',
    instrucciones: `Un reel es un vídeo vertical (9:16) de 10-30 segundos. Escribe: un gancho para los 2 primeros segundos (texto en pantalla que frene el scroll), un guion breve de lo que se dice/muestra escena a escena, el texto en pantalla de cada escena y una idea de cierre con llamada a la acción. Propón música libre o de la librería (NUNCA una canción famosa/con copyright: Instagram la silencia; la de moda la añade el cliente a mano en la app). Luego el caption.`,
  },
  {
    id: 'crear-caption',
    nombre: 'Escribir el caption',
    cuando: 'Siempre que se crea una publicación (acompaña a cada pieza).',
    instrucciones: `El caption engancha en la primera línea (sin "Hoy os hablo de…"). Desarrolla en 2-4 párrafos cortos, cercano y claro. Cierra con una llamada a la acción y el enlace del cliente ("enlace en la bio" o el que toque). Añade 4-8 hashtags relevantes del sector al final. Nada de emojis de relleno; uno o dos bien puestos.`,
  },
  {
    id: 'analizar-competencia',
    nombre: 'Analizar la competencia',
    cuando: 'El cliente menciona un competidor, pega un @ o pide analizar/espiar a otra cuenta.',
    instrucciones: `Explica qué mirarías en esa cuenta: formatos que más usa, frecuencia de publicación, ganchos que repite, llamadas a la acción y sus mejores posts. Saca 3-5 ideas accionables que el cliente puede replicar adaptándolas a su marca (sin copiar). Ofrece convertirlo en una campaña.`,
  },
  {
    id: 'crear-campana',
    nombre: 'Montar una campaña',
    cuando: 'El cliente quiere una campaña, un lanzamiento o una serie de publicaciones con un objetivo.',
    instrucciones: `Una campaña agrupa varias piezas con un mismo objetivo. Define: nombre, público, objeción a derribar, mensaje central, formatos, duración, cadencia y la llamada a la acción. Luego propón las primeras piezas de la campaña. Una campaña puede llevar una automatización (enlace en bio + palabra clave que dispara un DM), pero eso se configura aparte.`,
  },
]

// Devuelve el bloque de skills para meter en el prompt del sistema.
export function skillsBlock(): string {
  return skills
    .map((s) => `### ${s.nombre} (id: ${s.id})\nCuándo: ${s.cuando}\nCómo: ${s.instrucciones}`)
    .join('\n\n')
}
