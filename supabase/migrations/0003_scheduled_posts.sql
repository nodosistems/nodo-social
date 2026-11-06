-- 0003_scheduled_posts.sql — Nodo Social
-- Publicaciones programadas en la nube (antes solo en localStorage del navegador). Hace falta que
-- vivan en Supabase para que un servidor pueda PUBLICARLAS SOLAS a su hora. Idempotente.
--
-- Propiedad: cada fila es de quien la creó (created_by = auth.uid()). Así funciona aunque todavía
-- no haya "workspaces" por usuario; workspace_id es opcional y se usará cuando haya equipos.
-- El publicador del servidor usa la clave service_role (salta RLS) para leer las que toca publicar.

create table if not exists public.scheduled_posts (
  id            uuid primary key default gen_random_uuid(),
  created_by    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  workspace_id  uuid references public.workspaces(id) on delete cascade,  -- opcional (equipos, más adelante)

  piece         jsonb not null,            -- la pieza completa (formato, caption, imagen, slides…)
  format        text,                      -- carrusel | reel | video | post | story (copia para consultar)
  caption       text,
  image_url     text,                      -- URL pública a publicar (foto de "Mis fotos"); null si aún no hay imagen real
  music_id      text,

  scheduled_at  timestamptz not null,      -- cuándo debe publicarse
  status        text not null default 'programada'
                check (status in ('programada','publicando','publicada','error','borrador')),
  media_id      text,                      -- id del post en Instagram (al publicar)
  permalink     text,                      -- enlace al post publicado
  error         text,                      -- último error de publicación, si lo hubo

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- El publicador busca "lo que ya toca": status + fecha.
create index if not exists scheduled_posts_due on public.scheduled_posts (status, scheduled_at);
create index if not exists scheduled_posts_owner on public.scheduled_posts (created_by, scheduled_at);

alter table public.scheduled_posts enable row level security;

-- El dueño ve, crea, edita y borra sus publicaciones. (Los miembros del workspace también pueden
-- verlas, para cuando haya equipos.)
drop policy if exists "ver programadas propias" on public.scheduled_posts;
create policy "ver programadas propias" on public.scheduled_posts
  for select using (
    created_by = auth.uid()
    or (workspace_id is not null and public.is_workspace_member(workspace_id))
  );

drop policy if exists "crear programadas propias" on public.scheduled_posts;
create policy "crear programadas propias" on public.scheduled_posts
  for insert with check (created_by = auth.uid());

drop policy if exists "editar programadas propias" on public.scheduled_posts;
create policy "editar programadas propias" on public.scheduled_posts
  for update using (created_by = auth.uid()) with check (created_by = auth.uid());

drop policy if exists "borrar programadas propias" on public.scheduled_posts;
create policy "borrar programadas propias" on public.scheduled_posts
  for delete using (created_by = auth.uid());
