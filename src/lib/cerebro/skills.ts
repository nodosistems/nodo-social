// SKILLS DEL CEREBRO
// =================
// Cada "skill" es un bloque de conocimiento/procedimiento que el cerebro (Claude) aplica cuando
// toca. Son el oficio del asistente: cómo hacer bien cada tipo de contenido de Instagram.
//
// Este catálogo está destilado del paquete profesional "instagram-agent" (13 skills) y ADAPTADO a
// Nodo: negocios pequeños y clínicas (publicidad sanitaria). Por eso, sobre el oficio, mandan
// SIEMPRE las normas de marca (gestión y hábitos, nunca tratamientos; nada de cifras sin validar;
// enlace de auditoría/bio; música libre). La "voz humana" (anti-IA) y las fórmulas de gancho van
// aparte, en voz-humana.ts y ganchos.ts, y aplican a todo.
//
// CÓMO AÑADIR UNA SKILL (así alimenta Nacho el cerebro): copia un objeto, cambia id/nombre/cuando/
// instrucciones y listo; el cerebro ya la tiene en cuenta. Más adelante vivirán en un repo de
// GitHub con validación, y por cliente en Supabase.

export type Skill = {
  id: string
  nombre: string
  cuando: string // ayuda al cerebro a elegir la skill
  instrucciones: string // el conocimiento: cómo hacerlo bien
}

export const skills: Skill[] = [
  {
    id: 'plan-semana',
    nombre: 'Planificar la semana',
    cuando: 'Piden un plan, qué publicar esta semana/mes, un calendario o "no sé qué publicar".',
    instrucciones: `La sala de control: decide qué se crea. Propón 4-5 publicaciones a la semana, al menos 3 reels (es lo único que llega a quien aún no te sigue; el carrusel profundiza con los que ya están). Mezcla pilares y no repitas formato dos veces seguidas:
- PRUEBA (1/sem): algo que pasó en la clínica, con un dato concreto. Reel.
- ENSEÑAR (1-2/sem): una cosa que el paciente puede aplicar hoy. Reel o carrusel.
- OPINIÓN (1/sem): una postura del negocio sobre hábitos/organización. Reel.
- HISTORIA (1/quincena): una escena del día a día. Reel.
- OFERTA (1/quincena): el servicio, dicho claro. Carrusel o stories.
Para cada hueco: día, franja, formato, y el ÁNGULO concreto (no un tema: "AI" no es plan; "cómo organizamos las primeras visitas" sí). Di que el gancho importa más que la hora. Termina ofreciendo crear la primera pieza.`,
  },
  {
    id: 'crear-reel',
    nombre: 'Crear un reel',
    cuando: 'Piden un reel, un vídeo corto, un guion o un gancho.',
    instrucciones: `Un reel se decide en los 2 primeros segundos y se sostiene en los 5 siguientes. Estructura: GANCHO (0-2s, elige una fórmula de gancho; escribe la frase hablada y el texto en pantalla por separado) · POR QUÉ IMPORTA (1 línea) · CUERPO (una idea por plano, cambia de plano en cada idea) · REMATE (cumple lo que prometió el gancho + una sola llamada a la acción) · BUCLE (repite una palabra del gancho para que el replay cuadre). Duración 15-45s. Reglas: una sola idea (si hay dos, son dos reels); corta la intro (nada de saludo, logo ni "en este vídeo"); texto en pantalla ≤6 palabras por tarjeta y el gancho en el primer fotograma; una sola llamada a la acción. Música libre o de la librería (NUNCA una canción famosa: Instagram la silencia). Entrega: guion + lista de textos en pantalla con tiempos + caption. Nada de inventar cifras: si falta un dato, [dato por validar].`,
  },
  {
    id: 'crear-carrusel',
    nombre: 'Crear un carrusel',
    cuando: 'Piden un carrusel, slides, un "swipe post" o una idea con pasos/lista que no cabe en una imagen.',
    instrucciones: `El formato de más permanencia: una idea partida en pasos. 6-10 slides. Slide 1 PORTADA = el gancho, ≤6 palabras grandes y legibles en miniatura + una línea de promesa (la portada es el 80% del resultado). Slide 2 = por qué importa, en una frase (funciona como segunda portada). Slides 3-N = una idea por slide, titular de 3-7 palabras y ≤25 palabras debajo (si necesita un párrafo, son dos slides). Penúltima = RESUMEN de todo en lista (es la slide que la gente hace captura y envía). Última = una sola llamada a la acción. El @ del cliente pequeño en cada slide. Diseña para 1080x1350, texto bien dentro (margen de 120 px). Entrega primero el texto slide a slide numerado para revisar, luego el caption (aquí el caption es "contenido", trabaja). Aplica la marca; nada de tratamientos ni cifras sin validar.`,
  },
  {
    id: 'crear-caption',
    nombre: 'Escribir el caption',
    cuando: 'Siempre que se crea una pieza, o piden el texto/descripción o hashtags.',
    instrucciones: `Primero decide el TRABAJO del caption: (A) el reel ya engancha con su gancho → el caption NO compite, hace el contexto + la llamada + las palabras que la gente busca; (B) el caption ES el contenido (foto, carrusel) → la línea 1 es el gancho. Forma: LÍNEA 1 = 125 caracteres visibles antes del "... más" (nunca saludo, hashtag ni emoji al principio); CUERPO = párrafos cortos con una línea en blanco entre ellos, aquí van las palabras de búsqueda como frase natural ("primera visita de nutrición", no "#primeravisita"); UNA llamada a la acción (comenta una palabra, guarda, o "enlace en la bio"); hasta 5 hashtags específicos al final o ninguno. Reglas: NADA de enlace en el caption (no es clicable → bio o DM); una sola llamada; búsqueda > hashtags (Instagram limitó a 5 hashtags en dic-2025, y sirven de etiqueta, no de alcance; fuera #viral #fyp). Enlace de auditoría/web del cliente en la bio.`,
  },
  {
    id: 'crear-story',
    nombre: 'Crear stories del día',
    cuando: 'Piden stories, "qué pongo en la historia", una secuencia, una idea de encuesta, o vender sin hacer un post.',
    instrucciones: `Las stories no son un feed pequeño: no las ve nadie de fuera, así que el trabajo es PROFUNDIDAD, no alcance. Son donde quien ya te sigue decide si le compras. 3-7 frames: 1 ABRE (algo de hoy, con cara o manos) · 2-3 MEDIO (el contenido: el proceso, el resultado, el fallo) · 4 LA PETICIÓN (un sticker) · 5 CIERRA (la respuesta o el gancho de mañana). Pon la petición en el frame 4, no en el 7 (la gente se va tocando). Stickers y para qué: Encuesta (el toque más barato), Caja de preguntas (recoges las palabras exactas del paciente → oro para ideas), Cuestionario (enseñar dejando fallar), Enlace (si hay a dónde ir), Cuenta atrás (una fecha). Habla de tú, a una persona. No repitas tu propio post en stories sin añadir algo. Para vender: 3 frames de contexto, 1 de oferta, 1 de prueba. El embudo honesto a DM: ellos actúan primero (votan/responden), y entonces respondes tú.`,
  },
  {
    id: 'analizar-virales',
    nombre: 'Analizar competencia y virales',
    cuando: 'Mencionan un competidor, pegan un @, o piden ver qué está funcionando/qué publicar, o "replicar" una cuenta.',
    instrucciones: `La idea clave: las visitas en bruto NO son prueba. Una cuenta de 4.000 seguidores con 400.000 visitas encontró algo copiable; una de 2 millones con 400.000 tuvo un martes flojo. Mide por MÚLTIPLO ATÍPICO = visitas ÷ la mediana de esa misma cuenta. Por encima de 3x es señal; por debajo de 1,5x es su día normal y no enseña nada. Compara cuentas de tamaño parecido (±10x). Como todavía no navegamos solos por Instagram, pide al cliente que te pegue ejemplos (o su colección de Guardados): por cada reel, el @, seguidores, mediana aproximada, visitas, el gancho literal, el formato y la llamada. Saca: qué fórmulas de gancho se repiten arriba, qué tienen en común los de arriba (largo del gancho, si el remate es visual, dónde va la petición). Copia la FÓRMULA, nunca el vídeo. Devuelve "la versión del cliente": su historia, su dato, con la forma que funciona, lista para convertir en pieza. Di el tamaño de la muestra y la confianza con honestidad.`,
  },
  {
    id: 'auditar-contenido',
    nombre: 'Auditar lo ya publicado',
    cuando: 'El cliente pega sus insights/analíticas o posts pasados y pregunta qué funciona, por qué algo fracasó o qué dejar de hacer.',
    instrucciones: `La única fuente honesta de qué funciona para una cuenta es esa cuenta. Pide insights (o capturas): visitas, alcance, % de alcance de no-seguidores, retención a 3s, guardados, compartidos, seguimientos. No midas por visitas en bruto; calcula y enseña: MÚLTIPLO ATÍPICO (visitas/mediana), ALCANCE DE NO-SEGUIDORES (si viajó), RETENCIÓN A 3s (la nota del gancho), ENVÍOS POR ALCANCE (la señal más fuerte: un envío es alguien poniendo su nombre). Ordena por múltiplo atípico y envíos, no por visitas. Con top 5 y bottom 5 al lado, busca el patrón: la retención a 3s suele ser toda la historia; qué fórmula de gancho, formato, duración, tema. La distinción que ahorra meses: un reel con visitas y sin seguidores nuevos no es un fallo del reel, es un problema de PERFIL; un reel sin visitas es problema de GANCHO. Di la conclusión con la evidencia y la confianza (con 30 posts ves patrón, con 6 no). Termina con STOP (qué dejar) y HAZ MÁS (qué repetir).`,
  },
  {
    id: 'optimizar-perfil',
    nombre: 'Optimizar el perfil',
    cuando: 'Piden mejorar la bio/el perfil, "puntúa mi Instagram" o "por qué no me siguen".',
    instrucciones: `El perfil no es un escaparate que se pasea: es una PANTALLA DE DECISIÓN a la que se llega desde un reel, y tiene 3 segundos para responder "¿hay más de esto y es para mí?". Puntúa y arregla en este orden (de más a menos puntos): 1) CAMPO NOMBRE (la línea en negrita bajo la foto, 30 caracteres: es lo que busca Instagram → "{Nombre} | {lo que haces en palabras que se buscan}"). 2) PRIMERA LÍNEA DE LA BIO (para quién es y qué cambia; no un cargo ni adjetivos). 3) LOS 3 FIJADOS (la mejor prueba, la explicación del servicio, la mejor presentación de la persona: el arreglo de más impacto y son 4 toques). 4) DESTACADAS (4-6, con nombre de las preguntas que hace un paciente: Precios, Cómo funciona, Resultados [gestión, no médicos], Sobre mí). 5) EL ENLACE (uno que cumpla lo que promete la bio). 6) PORTADAS DE LA CUADRÍCULA (las 9 primeras, legibles en miniatura). Entrega la puntuación y las reescrituras listas para copiar, en orden de arreglo.`,
  },
  {
    id: 'reutilizar-contenido',
    nombre: 'Reutilizar un contenido largo',
    cuando: 'El cliente pasa algo largo (vídeo, charla, newsletter, artículo, acta de una llamada) y quiere sacarle contenido.',
    instrucciones: `Un buen contenido largo tiene dentro 4-6 publicaciones; casi todos sacan una y tiran el resto. Léelo entero y EXTRAE (no resumas; un resumen no es un reel): afirmaciones (frases que abrirían debate), números, historias (momento con persona, escena y coste), mecanismos ("esto funciona así"), errores (algo que salió mal), frases ya citables. Lista lo que encuentres con cuentas antes de escribir nada; si salen menos de 4, es flojo, dilo. Formato por extracto: afirmación/error/historia → reel; mecanismo/lista → carrusel; frase citable → frame de story. Cada pieza va sola (el que la ve no vio el original: nunca "como dije en mi vídeo"). Asigna una fórmula de gancho distinta a cada una (cinco piezas con el mismo gancho cantan a fábrica de contenido). Ordena la semana: la afirmación más fuerte primero. Redacta de una en una cuando lo pida, no sueltes cuatro guiones iguales de golpe.`,
  },
  {
    id: 'comentarios-comunidad',
    nombre: 'Comentar y responder comentarios',
    cuando: 'Piden comentar en posts de otros, "engagement", o responder a los comentarios de sus propios posts.',
    instrucciones: `Comentar es los 20 minutos de más impacto del día: un comentario arriba en un reel de 40.000 visitas lo ve más gente que un post propio. Un comentario genérico es peor que ninguno (te marca como cuenta de "pod" justo ante el creador). Elige el tipo según el post, nunca el genérico: 1) aporta un dato; 2) añade el caso que falta; 3) discrepa con respeto (nombra el acuerdo, luego el matiz); 4) amplía una línea buena; 5) haz la pregunta difícil que se saltó; 6) el recibo ("nosotros lo hicimos y pasó X"); 7) la corrección (correcto, breve, amable, seguro); 8) el reencuadre; 9) la frase de una línea (<10 palabras, graciosa o verdadera). Reglas: 1-3 frases; NUNCA "qué gran post", "me encanta", "qué cierto", ni el nombre con exclamación; nada de emoji solo; no repitas el reel; una idea; nunca te vendas ni pongas enlace en un comentario (es lo que te bloquea). Para tus propios comentarios: responde a los que valen, ordenados por cuáles; trata al crítico con calma y al posible cliente con una pregunta, no con una oferta.`,
  },
  {
    id: 'mensajes-dm',
    nombre: 'Mensajes directos (DM)',
    cuando: 'Piden escribir un DM, un mensaje de bienvenida a quien interactuó, una colaboración o un seguimiento.',
    instrucciones: `La regla honesta y la que no te bloquea: ELLOS ACTÚAN PRIMERO (comentan una palabra clave, responden una story, escriben), y entonces respondes tú. Nada de DM masivos a quien no interactuó. Tipos: entrega de palabra clave (alguien comentó la palabra → mándale lo prometido + una pregunta abierta), primer mensaje a quien interactuó (reconoce lo que hizo, sin vender), propuesta de colaboración (qué ganan ellos, concreto), y dos seguimientos como mucho (con valor, no "¿has visto mi mensaje?"). Tono cercano y de persona, breve. En clínica: nada de consejos médicos por DM; lleva a reservar/auditoría o a la web. Las respuestas automáticas por palabra clave son una función legítima de cuentas profesionales; úsalas solo cuando la persona escribe primero.`,
  },
  {
    id: 'crear-campana',
    nombre: 'Montar una campaña',
    cuando: 'El cliente quiere una campaña, un lanzamiento o una serie de piezas con un objetivo.',
    instrucciones: `Una campaña agrupa varias piezas con un mismo objetivo. Define: nombre, público, objeción a derribar, mensaje central, formatos, duración, cadencia y la llamada a la acción. Reparte las piezas con los pilares del plan (prueba, enseñar, opinión, historia, oferta) y varía fórmulas de gancho. Luego propón las primeras piezas. Una campaña puede llevar una automatización (palabra clave en comentarios → DM con el recurso + enlace en bio), pero eso se configura aparte.`,
  },
]

// Devuelve el bloque de skills para meter en el prompt del sistema.
export function skillsBlock(): string {
  return skills
    .map((s) => `### ${s.nombre} (id: ${s.id})\nCuándo: ${s.cuando}\nCómo: ${s.instrucciones}`)
    .join('\n\n')
}
