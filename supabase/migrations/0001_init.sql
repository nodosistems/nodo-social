-- 0001_init.sql — Nodo Social
-- Base multi-empresa: cada cliente es un "workspace" con sus miembros (roles) y su marca.
-- Seguridad por Row Level Security (RLS): un usuario solo ve/toca los datos de sus workspaces.
-- Las contraseñas las gestiona Supabase Auth (auth.users); aquí nunca se guardan.

create extension if not exists pgcrypto;

-- ─── Tablas ────────────────────────────────────────────────────────────────

-- Un workspace = una empresa/cliente.
create table if not exists public.workspaces (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Quién pertenece a cada workspace y con qué rol.
create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null default 'admin' check (role in ('admin','editor','approver','reader')),
  created_at   timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

-- Identidad de marca (una por workspace). El asistente la usa en todo lo que crea.
create table if not exists public.brand_profiles (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null unique references public.workspaces(id) on delete cascade,
  business_name text,
  sector        text,
  audience      text,
  tone          text,
  talk_about    text,                 -- de qué sí hablar
  avoid         text,                 -- de qué no hablar
  primary_color text default '#12264A',
  accent_color  text default '#E2603F',
  updated_at    timestamptz not null default now()
);

-- ─── Helpers (SECURITY DEFINER: evitan recursión de RLS al comprobar pertenencia) ──

create or replace function public.is_workspace_member(ws uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_admin(ws uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws and m.user_id = auth.uid() and m.role = 'admin'
  );
$$;

-- Al crear un workspace, su creador entra automáticamente como admin.
create or replace function public.handle_new_workspace()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.created_by, 'admin')
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_workspace_created on public.workspaces;
create trigger on_workspace_created
  after insert on public.workspaces
  for each row execute function public.handle_new_workspace();

-- ─── RLS ──────────────────────────────────────────────────────────────────

alter table public.workspaces        enable row level security;
alter table public.workspace_members enable row level security;
alter table public.brand_profiles    enable row level security;

-- workspaces
create policy "ver workspaces propios" on public.workspaces
  for select using (public.is_workspace_member(id));
create policy "crear workspace" on public.workspaces
  for insert with check (created_by = auth.uid());
create policy "editar workspace (admin)" on public.workspaces
  for update using (public.is_workspace_admin(id)) with check (public.is_workspace_admin(id));
create policy "borrar workspace (admin)" on public.workspaces
  for delete using (public.is_workspace_admin(id));

-- workspace_members
create policy "ver miembros del workspace" on public.workspace_members
  for select using (public.is_workspace_member(workspace_id));
create policy "gestionar miembros (admin)" on public.workspace_members
  for all using (public.is_workspace_admin(workspace_id)) with check (public.is_workspace_admin(workspace_id));

-- brand_profiles
create policy "ver marca del workspace" on public.brand_profiles
  for select using (public.is_workspace_member(workspace_id));
create policy "editar marca del workspace" on public.brand_profiles
  for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
