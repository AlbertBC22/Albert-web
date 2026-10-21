-- Datos de prueba (no es una migración: se ejecuta una vez a mano y se puede borrar).
-- Las fotos del álbum "Prueba" se subirán en la Fase 6 desde el panel de admin
-- (así se prueba de verdad la lectura del EXIF y el borrado del GPS).

insert into public.albums (slug, title_es, title_en, description_es, description_en, position, is_published)
values (
  'prueba',
  'Prueba',
  'Test',
  'Álbum de prueba para comprobar la galería.',
  'Test album to check the gallery.',
  0,
  true
);

insert into public.projects (
  slug, title_es, title_en, summary_es, summary_en, description_es, description_en,
  role_es, role_en, tech, started_on, status, repo_url, live_url, position, is_published
)
values (
  'albert-web',
  'Albert-web',
  'Albert-web',
  'Mi web personal: CV, proyectos y galería de fotografía con estética de plano técnico.',
  'My personal website: resume, projects and photo gallery with a technical-drawing look.',
  E'Web personal construida con Next.js, TypeScript y Supabase, desplegada en Vercel.\n\nIncluye un sistema de diseño propio inspirado en los planos de arquitectura, animaciones con GSAP y un panel de administración para gestionar la galería y los proyectos.',
  E'Personal website built with Next.js, TypeScript and Supabase, deployed on Vercel.\n\nIt includes a custom design system inspired by architectural drawings, GSAP animations and an admin panel to manage the gallery and the projects.',
  'Diseño y desarrollo',
  'Design and development',
  array['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Supabase', 'Vercel'],
  '2026-10-18',
  'activo',
  'https://github.com/AlbertBC22/Albert-web',
  'https://albert-web-iota.vercel.app',
  0,
  true
);
