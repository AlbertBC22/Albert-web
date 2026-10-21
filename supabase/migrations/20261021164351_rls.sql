-- 004 · Seguridad a nivel de fila (RLS)
--
-- Público (anon): lee solo lo publicado y puede enviar mensajes de contacto.
-- Admin (private.is_admin()): todo.
-- "(select private.is_admin())" entre paréntesis: Postgres lo evalúa una vez por consulta,
-- no una vez por fila (recomendación de rendimiento de Supabase).

alter table public.albums enable row level security;
alter table public.photos enable row level security;
alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;

-- ---------------------------------------------------------------------------
-- Álbumes
-- ---------------------------------------------------------------------------
create policy "Leer álbumes publicados (admin: todos)"
  on public.albums for select to anon, authenticated
  using (is_published or (select private.is_admin()));

create policy "Admin: crear álbumes"
  on public.albums for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admin: editar álbumes"
  on public.albums for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admin: borrar álbumes"
  on public.albums for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- Fotos: visibles si su álbum está publicado
-- ---------------------------------------------------------------------------
create policy "Leer fotos de álbumes publicados (admin: todas)"
  on public.photos for select to anon, authenticated
  using (
    exists (
      select 1 from public.albums a
      where a.id = photos.album_id and a.is_published
    )
    or (select private.is_admin())
  );

create policy "Admin: crear fotos"
  on public.photos for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admin: editar fotos"
  on public.photos for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admin: borrar fotos"
  on public.photos for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- Proyectos
-- ---------------------------------------------------------------------------
create policy "Leer proyectos publicados (admin: todos)"
  on public.projects for select to anon, authenticated
  using (is_published or (select private.is_admin()));

create policy "Admin: crear proyectos"
  on public.projects for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admin: editar proyectos"
  on public.projects for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admin: borrar proyectos"
  on public.projects for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- Mensajes de contacto: cualquiera puede enviar; solo el admin los lee y gestiona
-- ---------------------------------------------------------------------------
create policy "Enviar mensajes de contacto"
  on public.contact_messages for insert to anon, authenticated
  with check (read_at is null);

create policy "Admin: leer mensajes"
  on public.contact_messages for select to authenticated
  using ((select private.is_admin()));

create policy "Admin: marcar mensajes como leídos"
  on public.contact_messages for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admin: borrar mensajes"
  on public.contact_messages for delete to authenticated
  using ((select private.is_admin()));
