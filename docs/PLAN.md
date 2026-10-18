# PLAN.md — Plan de desarrollo de Albert-web

Cada fase termina con el protocolo de cierre de `CLAUDE.md` §2: verificación, bitácora, commit, informe y **parada**.
⏸ = punto de control intermedio: se para igual que al final de una fase.

Rutas públicas (pathnames localizados con next-intl):

| Página | ES | EN |
|---|---|---|
| Principal | `/es` | `/en` |
| Formación | `/es/formacion` | `/en/education` |
| Proyectos | `/es/proyectos` | `/en/projects` |
| Detalle proyecto | `/es/proyectos/[slug]` | `/en/projects/[slug]` |
| Fotografía | `/es/fotografia` | `/en/photography` |
| Álbum | `/es/fotografia/[slug]` | `/en/photography/[slug]` |
| Contacto | `/es/contacto` | `/en/contact` |
| Admin | `/admin` (solo español, sin prefijo de idioma) | — |

---

## Fase 0 — Verificación del entorno (sin código)

Objetivo: confirmar que todas las piezas están conectadas antes de escribir nada.

- Comprobar versiones: `node -v` (24.x o superior), `npm -v`, `git --version`, `gh --version`.
- `gh auth status` muestra la cuenta AlbertBC22.
- El remoto de git apunta a `AlbertBC22/Albert-web`.
- El MCP de Supabase responde: listar las tablas del proyecto `Albert-web` (debería estar vacío) y obtener la URL del proyecto.
- Confirmar con Albert que el repo está importado en Vercel.

**Terminado cuando**: todo lo anterior está verificado y anotado en la bitácora.

---

## Fase 1 — Base del proyecto

- Crear la app con `create-next-app` (TypeScript, App Router, Tailwind, ESLint, carpeta `src/`, alias `@/*`).
  - El repo ya contiene `CLAUDE.md` y `docs/`. Si el comando se queja de que la carpeta no está vacía, genera el proyecto en una carpeta temporal y mueve los archivos **sin sobrescribir** `CLAUDE.md` ni `docs/`.
- Añadir el script `typecheck`.
- Configurar `next-intl`: locales `es` (por defecto) y `en`, pathnames localizados, detección del idioma del navegador y `messages/es.json` y `messages/en.json`.
- Crear los clientes de Supabase con `@supabase/ssr` (`lib/supabase/server.ts`, `lib/supabase/client.ts`) y el middleware combinado con el de next-intl.
- Crear `.env.example` con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Comprobar que `.env.local` está en `.gitignore`.
- Crear páginas placeholder para todas las rutas públicas, con navegación mínima y selector de idioma.
- Configurar `next.config` con `remotePatterns` para las imágenes de Supabase Storage.

⏸ **Acciones para Albert**: crear `.env.local` con sus valores y añadir las mismas variables en Vercel (Production y Preview).

- Primer push → PR → preview en Vercel → merge → primer despliegue en producción.

**Terminado cuando**: `/es` y `/en` funcionan en la URL de Vercel; lint, typecheck y build pasan.

---

## Fase 2 — Sistema de diseño "plano técnico"

Antes de implementar, presentar a Albert y confirmar: tokens, tipografías, escala tipográfica, retícula base (8 px), y si usar scroll suave (GSAP ScrollSmoother o ninguno; recomendación: ninguno al principio).

1. Tokens en CSS variables + integración con Tailwind. Fuentes con `next/font`.
2. Configuración de GSAP: registro de plugins una sola vez y helper para `prefers-reduced-motion`.
3. Componentes en `components/blueprint/`:
   - `GridBackground` (retícula milimetrada).
   - `BlueprintFrame` (marco con marcas de esquina que se trazan).
   - `DimensionLine` (cota horizontal y vertical con valor).
   - `SectionLabel` (`REF. 02 — EXPERIENCIA`).
   - `Annotation` (nota con línea guía).
   - `SpecList` (fichas clave–valor).
   - `CornerCoords` (`[0,246]`).
   - `TitleBlock` (cajetín de pie de página).
   - `AccentHighlight` (degradado sutil).
   - `Button` / `Link` con estilo de plano.

⏸ Revisión de componentes estáticos en `/es/_plano` (página interna con `noindex`, excluida del sitemap y del menú).

4. Cursor personalizado (`CustomCursor`): cruz + coordenadas + estados `hover-link` y `hover-image`. Desactivado en táctil y con reduced motion.
5. Pantalla de carga (`Loader`): pasos numerados + porcentaje + retícula que se dibuja. Solo en la primera visita de la sesión (`sessionStorage` con try/catch) y saltable.
6. Layout global: cabecera con navegación tipo índice de planos, selector ES/EN y cajetín como footer.

**Terminado cuando**: todos los componentes se ven en `/es/_plano`, las animaciones respetan reduced motion y el cursor funciona en escritorio y desaparece en móvil.

---

## Fase 3 — Página principal (scroll)

Contenido desde `docs/CONTENIDO.md` → `src/content/cv.es.ts` y `cv.en.ts`, con tipos compartidos en `src/types/cv.ts`. La traducción al inglés la propone Claude y **Albert la revisa** antes del cierre.

Secciones, en este orden, cada una con su animación propia:
1. **Hero**: nombre "dibujado" con cotas que miden el titular, rol, ubicación, foto profesional (placeholder hasta que Albert la aporte) e indicación `[Scroll para continuar]`.
2. **Perfil** (REF. 01): texto con aparición línea a línea.
3. **Experiencia** (REF. 02): línea de tiempo vertical que se dibuja con el scroll (scrub). Cada experiencia es una lámina con `SpecList` (empresa, lugar, modalidad, fechas) y sus logros.
4. **Cifras** (REF. 03): datos destacados con contador y degradado (≈1.500 usuarios NITS, +10.000 seguidores, 6–7 proyectos en BeonDev, 1 venta B2B cerrada con Keep).
5. **Stack técnico** (REF. 04): agrupado por categoría, como leyenda de plano.
6. **Idiomas** (REF. 05).
7. **Intereses** (REF. 06): fotografía, cine y baloncesto, con enlace a la galería.
8. **CTA de contacto**: enlace a `/contacto`.

⏸ Tras Hero + Perfil + Experiencia.

**Terminado cuando**: la página está completa en ES y EN, se ve bien en móvil (≥360 px) y escritorio, y no hay saltos de layout al cargar.

---

## Fase 4 — Página de formación

Mismo lenguaje visual que la principal: formación académica, certificaciones y una breve sección de "formación prevista" desactivada (no se muestra hasta que Albert la active; ver CONTENIDO.md).

**Terminado cuando**: la página está en ES y EN y enlazada desde la navegación.

---

## Fase 5 — Supabase: esquema, seguridad y almacenamiento

Enseñar el SQL a Albert antes de aplicar cada migración. Guardar todas las migraciones en `supabase/migrations/`.

Tablas:
- `admins (user_id uuid pk → auth.users)` + función `is_admin()` (`security definer`).
- `albums`: id, slug (único), title_es, title_en, description_es, description_en, cover_photo_id (nullable), position, is_published, created_at, updated_at.
- `photos`: id, album_id (→ albums, on delete cascade), storage_path, width, height, title_es, title_en, alt_es, alt_en (obligatorios), position, camera_make, camera_model, lens, focal_length_mm, aperture, shutter_speed, iso, taken_at, created_at.
  - Trigger que **impide insertar más de 30 fotos en total** (límite definido en una sola constante o función, fácil de cambiar).
- `projects`: id, slug, title_es/en, summary_es/en, description_es/en (markdown), role_es/en, tech (text[]), started_on, ended_on, status (`activo` | `cerrado`), repo_url, live_url, cover_path, position, is_published, created_at, updated_at.
- `contact_messages`: id, name, email, message, locale, created_at, read_at.

RLS:
- Público (anon): `select` solo de álbumes, fotos y proyectos publicados; `insert` en `contact_messages`, con límites de longitud en un `check`.
- Admin (`is_admin()`): todo sobre todas las tablas.

Storage:
- Buckets públicos de lectura `photos` y `projects`; escritura y borrado solo para el admin.

Datos de prueba:
- 1 álbum "Prueba" con 2–3 fotos. Pedir a Albert 2–3 fotos suyas para probar también el EXIF; si no las aporta, usar imágenes de prueba.
- 1 proyecto de prueba: **esta misma web (Albert-web)**, con su repo real.

⏸ **Acciones para Albert**: crear su usuario en Supabase Auth, **desactivar el registro público** (sign-ups) e insertar su `user_id` en `admins`. Claude explica cada paso.

**Terminado cuando**: las políticas se han probado. Anon no puede escribir en álbumes, fotos ni proyectos, ni leer mensajes. El admin sí puede.

---

## Fase 6 — Panel de administración

Ruta `/admin`, solo español, con el mismo estilo de plano en versión sobria. Pensado para crecer en el futuro: una sección por entidad, navegación lateral.

1. Login con email y contraseña (Supabase Auth). Protección de todas las rutas `/admin/*` en el middleware y comprobación de `is_admin()` en servidor. Logout.

⏸

2. **Álbumes**: listar, crear, editar (campos ES y EN), publicar o despublicar, reordenar y elegir portada.
3. **Fotos**: subida múltiple con arrastrar y soltar. En el navegador, por cada foto:
   - leer el EXIF con `exifr` (sin GPS);
   - redimensionar a un máximo de 2.500 px en el lado largo y re-codificar (WebP o JPEG, calidad ~0,85) con canvas, lo que **elimina todos los metadatos del archivo**;
   - subir a `photos/{album_id}/{uuid}.webp`;
   - guardar la fila con dimensiones y EXIF.

   Además: editar título y alt (ES/EN), reordenar y borrar (también del Storage). Contador visible `N / 30` y bloqueo de la subida al llegar al límite.

⏸

4. **Proyectos**: CRUD completo con imagen de portada y publicar o despublicar.
5. **Mensajes**: lista de mensajes de contacto, marcar como leído y borrar.

**Terminado cuando**: Albert puede gestionar álbumes, fotos y proyectos sin tocar Supabase, y el límite de 30 fotos se respeta tanto en la UI como en la BD.

---

## Fase 7 — Galería de fotografía (pública)

- `/fotografia`: índice de álbumes como "láminas" con portada, título, nº de fotos y año.
- `/fotografia/[slug]`: galería en rejilla o masonry respetando proporciones, con `next/image`, `sizes` correctos y placeholder.
- Revelado de cada foto con barrido tipo escáner.
- Lightbox: navegación con teclado y gestos, cierre con Esc, y **ficha técnica** al lado (cámara, objetivo, focal, f/, velocidad, ISO, fecha) en estilo `SpecList` con cotas alrededor de la imagen.
- Estado vacío con estilo de plano ("Plano en preparación").

**Terminado cuando**: el álbum de prueba se ve bien en móvil y escritorio y el lightbox es accesible.

---

## Fase 8 — Proyectos (pública)

- `/proyectos`: fichas de proyecto (portada, título, resumen, stack, año, estado, enlaces).
- `/proyectos/[slug]`: detalle con descripción en markdown.
- Estado vacío cuidado.
- Por ahora fichas manuales desde el panel. La integración con la API de GitHub queda en el backlog.

**Terminado cuando**: el proyecto de prueba (Albert-web) se ve bien en ES y EN.

---

## Fase 9 — Contacto

- `/contacto`: formulario con nombre, email y mensaje. Server Action + zod.
- Antispam simple: campo trampa (honeypot), tiempo mínimo de envío y límites de longitud.
- Mensajes de éxito y error en ES y EN. Los mensajes llegan a `contact_messages` y se ven en el panel.

**Terminado cuando**: un envío real aparece en el panel y un envío con honeypot relleno se descarta.

---

## Fase 10 — Pulido y publicación

- SEO: metadata por página y por idioma, `hreflang`, imágenes Open Graph generadas con estilo de plano, `sitemap.xml` y `robots.txt` (excluir `/admin` y `/_plano`).
- Página 404 con estilo de plano ("Cota fuera de plano").
- Accesibilidad: revisión de teclado, foco, contraste y textos alternativos.
- Rendimiento: Lighthouse ≥ 90 en todas las categorías en móvil; revisar el peso de GSAP y de las fuentes.
- Revisión responsive completa.
- Preguntar a Albert si quiere Vercel Analytics.

**Terminado cuando**: Albert da el visto bueno en producción.

---

## Backlog (no hacer sin pedirlo)

- Integración con la API de GitHub para proyectos (repos seleccionados, lenguajes, estrellas, imagen de vista previa).
- Versión en catalán.
- Dominio propio.
- Notificación por email al recibir un mensaje de contacto.
- Captcha invisible (p. ej. Cloudflare Turnstile) si llega spam.
- Ampliar el panel admin: editar el contenido del CV, estadísticas.
- Modo oscuro.
