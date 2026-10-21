-- 006 · El panel de admin necesita saber, en el servidor, si el usuario con sesión es admin.
--
-- Cada usuario con sesión puede leer SOLO su propia fila de "admins" (si existe). Así la web
-- comprueba "¿soy admin?" sin exponer quién más lo es ni permitir escribir en la tabla.

create policy "Leer la propia fila de admin"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()));
