# Nodo Social — guía del proyecto (CLAUDE.md)

App que gestiona el Instagram de pequeñas empresas de forma automática a través de un **asistente conversacional**. El usuario pide por chat (un prompt) y la app planifica, crea, edita y programa el contenido (imágenes, reels y vídeos), y lo publica solo en su Instagram.

## Qué es (en una frase)
Tu Instagram en piloto automático, guiado por un asistente. Concepto completo: `/mnt/project-files/conocimiento/nodo-social-concepto-producto.md`.

## Stack
- **Frontend + backend:** Next.js (App Router) + React + TypeScript + Tailwind CSS (+ shadcn/ui). UI responsive (móvil y escritorio). El backend (callback OAuth de Meta, llamadas a la API de Claude, cola de publicación) vive en las acciones de servidor y rutas API de Next.js, nunca en el navegador. Dev: `npm run dev` → http://localhost:3000.
- **Backend/datos (más adelante):** Supabase (PostgreSQL, Auth, Row Level Security). Un token/credencial de Meta por cliente, cifrado.
- **Cerebro:** API de Claude (modelo pequeño para el día a día), llamado desde el servidor, nunca desde el navegador.
- **Publicación:** API oficial de Meta (Instagram Graph API), desde el servidor, con el token de cada cliente (modo cliente → sin App Review para arrancar).
- **Motores de contenido:** motor propio HTML→imagen/reel (gratis); Higgsfield (vídeo IA, API de pago); HeyGen (avatares, API de pago); edición/render por API (Shotstack/Creatomate); música con licencia (Epidemic/Artlist) o IA.
- **Deploy:** Vercel.

## Marca (NO TOCAR sin aprobación)
- Azul primario `#12264A`; coral de acento `#E2603F` → **el coral solo para personas/acentos puntuales**, nunca de relleno.
- Fuentes: **Sora** (titulares 600/700), **DM Sans** (texto/botones 400/500/700). Google Fonts.
- Idioma de la UI: **español de España**. Tono cercano, claro, sin jerga.

## Arquitectura de pantallas
- **Asistente** (pantalla principal): caja de prompt + chips de sugerencias + tarjetas de vista previa con Editar/Programar.
- **Calendario:** pasado y futuro; cada pieza con su idea; botones Cambiar / Generar con IA.
- **Publicaciones:** todo lo publicado, con métricas.
- **Inicio:** estado y explicación ("qué está pasando y por qué").
- **Onboarding:** conectar Instagram (modo cliente) + preguntas de marca/tono.

## Reglas
- Secretos (tokens, claves) siempre en `.env`, **nunca** a git. Subir solo `.env.example` vacío. `.gitignore` bloquea `.env`.
- **Música:** nunca incrustar canciones famosas/con copyright por API (Instagram las silencia). Solo librería con licencia o IA; las de moda las añade el cliente en la app de IG.
- **Nada de cifras/plazos sin validar** en textos de producto. Hablar de GESTIÓN, no de tratamientos (es para clínicas; publicidad sanitaria).
- Pedir/plantear un **plan antes de escribir código** para cambios grandes.

## Desarrollo
- `npm run dev` para el servidor local; probar en el navegador con Playwright (Chromium en `/opt/pw-browsers/chromium`, flags `--headless --no-sandbox`).
- Node 22 (`/opt/node22/bin`), `NODE_PATH=/opt/node22/lib/node_modules` para Playwright.

## Memoria del proyecto (segundo cerebro)
El contexto de marca, estrategia y decisiones vive en la memoria del equipo (`team/silo`) y en `/mnt/project-files/`. Consultarlo antes de inventar.
