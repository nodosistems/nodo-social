# Base de datos (Supabase)

Nodo Social usa Supabase para datos, login y multi-empresa. El esquema vive en `migrations/`.

## Aplicar el esquema

**Opción rápida (panel):** abre tu proyecto en Supabase → **SQL Editor** → pega el contenido de
`migrations/0001_init.sql` → **Run**.

**Opción CLI:** con la [CLI de Supabase](https://supabase.com/docs/guides/cli) enlazada al proyecto:

```bash
supabase db push
```

## Claves (van en `.env.local`, nunca a git)

Project Settings → API:

- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (solo servidor)

## Qué crea `0001_init.sql`

- `workspaces` — una empresa/cliente por workspace.
- `workspace_members` — quién pertenece y con qué rol (admin / editor / approver / reader).
- `brand_profiles` — la identidad de marca de cada workspace.
- RLS en todas: cada usuario solo ve y edita los datos de sus workspaces.
- Al crear un workspace, su creador queda como `admin` automáticamente.
