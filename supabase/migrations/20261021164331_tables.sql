-- 002 · Tablas: álbumes, fotos, proyectos y mensajes de contacto
--
-- Las restricciones (check) validan los datos en la propia base de datos, para que no
-- dependan solo de la web.

-- Mantiene updated_at al día en cada modificación.
create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Álbumes de fotos
-- ---------------------------------------------------------------------------
create table public.albums (
  id uuid primary key default gen_random_uuid(),
  -- Slug para la URL: minúsculas, números y guiones (p. ej. "viaje-a-islandia")
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title_es text not null check (char_length(title_es) between 1 and 120),
  title_en text not null check (char_length(title_en) between 1 and 120),
  description_es text check (char_length(description_es) <= 2000),
  description_en text check (char_length(description_en) <= 2000),
  cover_photo_id uuid, -- la clave foránea se añade tras crear "photos"
  position integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger albums_set_updated_at
  before update on public.albums
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Fotos (se ven si su álbum está publicado; no tienen "publicado" propio)
-- ---------------------------------------------------------------------------
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums (id) on delete cascade,
  storage_path text not null unique, -- ruta en el bucket "photos": {album_id}/{uuid}.webp
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  title_es text check (char_length(title_es) <= 120),
  title_en text check (char_length(title_en) <= 120),
  -- Texto alternativo obligatorio (accesibilidad)
  alt_es text not null check (char_length(alt_es) between 1 and 300),
  alt_en text not null check (char_length(alt_en) between 1 and 300),
  position integer not null default 0,
  -- Ficha técnica (EXIF permitido; nunca ubicación GPS)
  camera_make text check (char_length(camera_make) <= 80),
  camera_model text check (char_length(camera_model) <= 80),
  lens text check (char_length(lens) <= 120),
  focal_length_mm numeric(6, 1) check (focal_length_mm > 0),
  aperture numeric(4, 1) check (aperture > 0), -- número f, p. ej. 2.8
  shutter_speed text check (char_length(shutter_speed) <= 20), -- p. ej. "1/250"
  iso integer check (iso > 0),
  taken_at timestamptz,
  created_at timestamptz not null default now()
);

create index photos_album_id_position_idx on public.photos (album_id, position);

-- Portada del álbum: si se borra esa foto, el álbum se queda sin portada (no da error).
alter table public.albums
  add constraint albums_cover_photo_id_fkey
  foreign key (cover_photo_id) references public.photos (id) on delete set null;

create index albums_cover_photo_id_idx on public.albums (cover_photo_id);

-- ---------------------------------------------------------------------------
-- Proyectos
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title_es text not null check (char_length(title_es) between 1 and 120),
  title_en text not null check (char_length(title_en) between 1 and 120),
  summary_es text not null check (char_length(summary_es) between 1 and 300),
  summary_en text not null check (char_length(summary_en) between 1 and 300),
  -- Descripción larga en markdown
  description_es text not null default '' check (char_length(description_es) <= 20000),
  description_en text not null default '' check (char_length(description_en) <= 20000),
  role_es text check (char_length(role_es) <= 120),
  role_en text check (char_length(role_en) <= 120),
  tech text[] not null default '{}',
  started_on date,
  ended_on date,
  status text not null default 'activo' check (status in ('activo', 'cerrado')),
  repo_url text check (repo_url ~ '^https://'),
  live_url text check (live_url ~ '^https://'),
  cover_path text, -- ruta en el bucket "projects"
  position integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ended_on is null or started_on is null or ended_on >= started_on)
);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Mensajes del formulario de contacto
-- ---------------------------------------------------------------------------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  email text not null
    check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(btrim(message)) between 1 and 5000),
  locale text not null check (locale in ('es', 'en')),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

-- Desde la API, el público solo puede rellenar estos cuatro campos (no created_at ni read_at).
revoke insert on public.contact_messages from anon, authenticated;
grant insert (name, email, message, locale) on public.contact_messages to anon, authenticated;
