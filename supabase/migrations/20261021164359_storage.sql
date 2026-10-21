-- 005 · Storage: buckets de imágenes y sus permisos
--
-- Buckets públicos: cualquiera puede VER una imagen por su URL pública (no hace falta
-- política de lectura para eso). Subir, reemplazar, listar y borrar: solo el admin.
-- Límite de 10 MB por archivo y solo tipos de imagen.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('photos', 'photos', true, 10485760, array['image/webp', 'image/jpeg']),
  ('projects', 'projects', true, 10485760, array['image/webp', 'image/jpeg', 'image/png']);

create policy "Admin: listar imágenes"
  on storage.objects for select to authenticated
  using (bucket_id in ('photos', 'projects') and (select private.is_admin()));

create policy "Admin: subir imágenes"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('photos', 'projects') and (select private.is_admin()));

create policy "Admin: reemplazar imágenes"
  on storage.objects for update to authenticated
  using (bucket_id in ('photos', 'projects') and (select private.is_admin()))
  with check (bucket_id in ('photos', 'projects') and (select private.is_admin()));

create policy "Admin: borrar imágenes"
  on storage.objects for delete to authenticated
  using (bucket_id in ('photos', 'projects') and (select private.is_admin()));
