-- 0002_ai_usage.sql — Nodo Social
-- Registro de uso del asistente (cerebro Claude) por workspace, para poner un límite diario
-- y que ningún cliente dispare la factura de Claude. Idempotente (se puede ejecutar varias veces).

create table if not exists public.ai_usage (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid references public.workspaces(id) on delete cascade,
  user_id       uuid references auth.users(id) on delete set null,
  input_tokens  int not null default 0,
  output_tokens int not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists ai_usage_ws_created on public.ai_usage (workspace_id, created_at);

alter table public.ai_usage enable row level security;

-- Un miembro ve el uso de su workspace…
drop policy if exists "ver uso del workspace" on public.ai_usage;
create policy "ver uso del workspace" on public.ai_usage
  for select using (public.is_workspace_member(workspace_id));

-- …y el servidor (con la sesión del propio usuario) registra su uso.
drop policy if exists "registrar uso del workspace" on public.ai_usage;
create policy "registrar uso del workspace" on public.ai_usage
  for insert with check (public.is_workspace_member(workspace_id));
