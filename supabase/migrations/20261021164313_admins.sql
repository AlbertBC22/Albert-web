-- 001 · Administradores y función is_admin()
--
-- Las funciones con privilegios (security definer) viven en el esquema "private", que la API
-- de Supabase (PostgREST) no expone: se usan dentro de las políticas RLS, pero nadie puede
-- llamarlas desde fuera.

create schema if not exists private;
grant usage on schema private to anon, authenticated;

-- Usuarios con permisos de administración (de momento, solo Albert).
-- El user_id de Albert NO se guarda en el repo: se inserta a mano (repo público).
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- RLS activo y sin políticas: nadie puede leer ni escribir esta tabla desde la API.
-- Solo la consulta private.is_admin(), que se ejecuta con los permisos de su dueño.
alter table public.admins enable row level security;

-- ¿El usuario de la petición actual es administrador?
create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;
