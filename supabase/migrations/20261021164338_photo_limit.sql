-- 003 · Límite de fotos
--
-- El límite vive en UNA sola función. Para cambiarlo: nueva migración con
-- "create or replace function private.photo_limit() ... select <nuevo valor>".

create function private.photo_limit()
returns integer
language sql
immutable
set search_path = ''
as $$
  select 30;
$$;

-- Para el panel de admin (contador "N / 30"): expone el límite sin duplicarlo en la web.
create function public.get_photo_limit()
returns integer
language sql
stable
set search_path = ''
as $$
  select private.photo_limit();
$$;

revoke execute on function public.get_photo_limit() from public, anon;
grant execute on function public.get_photo_limit() to authenticated;
grant execute on function private.photo_limit() to authenticated;

-- Impide insertar más fotos que el límite, contando TODAS las fotos (security definer:
-- el recuento no depende de lo que la RLS deje ver). El bloqueo evita que dos subidas a
-- la vez se cuelen por encima del límite.
create function private.enforce_photo_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtext('public.photos:limit'));
  if (select count(*) from public.photos) >= private.photo_limit() then
    raise exception 'Se ha alcanzado el límite de % fotos', private.photo_limit()
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

revoke execute on function private.enforce_photo_limit() from public;

create trigger photos_enforce_limit
  before insert on public.photos
  for each row execute function private.enforce_photo_limit();
