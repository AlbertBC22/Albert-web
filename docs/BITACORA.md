# BITÁCORA — Albert-web

Fuente de verdad del estado del desarrollo. Claude Code la actualiza al cerrar cada fase o punto de control ⏸.
Las entradas del registro van de la más reciente a la más antigua.

## Estado actual

- **Fase actual**: Fase 2 — Sistema de diseño "plano técnico" (⏸ revisión de componentes)
- **Último paso completado**: bloque A: tokens, fuentes, GSAP y componentes de `components/blueprint/` en `/es/_plano`
- **Siguiente paso**: bloque B: cursor personalizado, pantalla de carga y layout global (cabecera + cajetín)
- **Esperando a Albert**: revisar `/es/_plano` y dar el visto bueno al bloque A

## Estado por fase

Leyenda: ☐ pendiente · ◐ en curso · ⏸ parada en punto de control · ☑ terminada

| Fase | Nombre | Estado | Rama | PR / preview |
|---|---|---|---|---|
| 0 | Verificación del entorno | ☑ | `fase-00-entorno` | [#1](https://github.com/AlbertBC22/Albert-web/pull/1) (merge) |
| 1 | Base del proyecto | ☑ | `fase-01-base` | [#2](https://github.com/AlbertBC22/Albert-web/pull/2) (merge) · [producción](https://albert-web-iota.vercel.app) |
| 2 | Sistema de diseño "plano técnico" | ◐ | `fase-02-diseno` | |
| 3 | Página principal (scroll) | ☐ | | |
| 4 | Formación | ☐ | | |
| 5 | Supabase: esquema, RLS y storage | ☐ | | |
| 6 | Panel de administración | ☐ | | |
| 7 | Galería de fotografía | ☐ | | |
| 8 | Proyectos | ☐ | | |
| 9 | Contacto | ☐ | | |
| 10 | Pulido y publicación | ☐ | | |

## Decisiones tomadas

Decisiones confirmadas por Albert. No se reabren sin que él lo pida.

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-10-18 | Next.js + React + TypeScript en lugar de Angular | Integración nativa con Vercel, `next/image` para la galería y ecosistema GSAP |
| 2026-10-18 | El contenido del CV vive en archivos tipados del repo, no en Supabase | Cambia poco; más simple de mantener |
| 2026-10-18 | Sin teléfono ni email públicos; contacto por formulario | Evitar spam; el repo es público |
| 2026-10-18 | Idiomas: español (por defecto) e inglés | Catalán más adelante |
| 2026-10-18 | Panel `/admin` con login de Supabase y un único usuario | Subir álbumes y crear proyectos sin tocar Supabase; ampliable en el futuro |
| 2026-10-18 | Máximo 30 fotos en total, optimizadas a ≤2.500 px y sin metadatos | Límites del plan gratuito y privacidad (sin GPS) |
| 2026-10-18 | Ficha técnica EXIF en cada foto | Encaja con el estilo de plano |
| 2026-10-18 | Proyectos como fichas manuales desde el panel; GitHub API al backlog | Simplicidad inicial |
| 2026-10-18 | Cursor personalizado acorde al estilo de plano | Petición de Albert |
| 2026-10-18 | Solo modo claro; dominio gratuito de Vercel | Por ahora |
| 2026-10-18 | `.mcp.json` se versiona en el repo | Solo contiene la URL del MCP con el `project_ref`, que no es secreto |
| 2026-10-18 | Next.js 16.4 con `cacheComponents` (plantilla por defecto); el middleware es `src/proxy.ts` | Convenciones de Next 16 |
| 2026-10-18 | next-intl lee el idioma con `next/root-params` (no `setRequestLocale`) | Recomendación actual de next-intl, compatible con `cacheComponents` |
| 2026-10-18 | La sesión de Supabase se refresca en el proxy **solo en `/admin`** | El público no inicia sesión; la seguridad la da RLS |
| 2026-10-18 | `/` redirige a `/es` o `/en` según el idioma del navegador; todas las rutas con prefijo | Plan de rutas |
| 2026-10-18 | `.gitattributes` con `eol=lf` | Evitar cambios de finales de línea en Windows |
| 2026-10-18 | `engines.node >= 24` en `package.json` | Misma versión de Node en local y en Vercel |
| 2026-10-18 | Sin Prettier por ahora | Simplicidad |
| 2026-10-18 | Se usa la clave `sb_publishable_…` (no la anon legacy) | Recomendación de Supabase para apps nuevas |
| 2026-10-18 | Tokens de color de `CLAUDE.md` sin cambios, + `--grid-minor` para las líneas finas de la retícula | Confirmado por Albert; revisión visual más adelante si hace falta |
| 2026-10-18 | IBM Plex Sans (300–600) + Plex Mono (400–500) con `next/font`; escala fluida display/h1/h2/h3/lead/label | Confirmado por Albert |
| 2026-10-18 | Espaciado en múltiplos de 8 px; retícula de fondo cada 16 px (finas) y 80 px (principales) | Una retícula de 8 px resulta demasiado densa en pantalla |
| 2026-10-18 | Sin scroll suave | Accesibilidad y simplicidad |
| 2026-10-18 | Página interna en `/es/_plano` (carpeta `%5Fplano`), `noindex` | Las carpetas con `_` son privadas en Next.js |
| 2026-10-18 | Cursor: coordenadas del viewport en px con 4 cifras (`X:0412 Y:0218`) | Como las referencias |
| 2026-10-18 | Pantalla de carga: primera visita de la sesión, saltable, ≤ ~1,6 s, no se muestra con reduced motion; que sea "bonita e interesante" | Petición de Albert |
| 2026-10-18 | Cajetín: fecha de revisión = fecha del build; nº de plano por página (`AB-00` inicio, `AB-01` formación…) | Se actualiza sola |

## Registro

<!--
Plantilla de entrada (copiar arriba del todo):

### AAAA-MM-DD — Fase X[.paso] — Título corto
- **Hecho**:
- **Archivos creados**:
- **Archivos modificados**:
- **Decisiones**:
- **Problemas / notas**:
- **Pendiente**:
- **Verificación**: lint ☐ · typecheck ☐ · build ☐
-->

### 2026-10-18 — Fase 2 ⏸ — Tokens, GSAP y componentes estáticos
- **Hecho**:
  - Tokens en `globals.css` (`:root` + `@theme inline` de Tailwind 4): colores, fuentes y escala tipográfica (`text-display`, `text-h1`… `text-label`), utilidad `label-mono`, foco visible, selección y estilos del botón de plano (`.bp-button`).
  - IBM Plex Sans y Plex Mono con `next/font` (`src/app/fonts.ts`).
  - GSAP 3.15 + `@gsap/react`: registro único de ScrollTrigger, DrawSVG y SplitText en `src/lib/animations/gsap.ts`; `MOTION_OK` y `prefersReducedMotion()` en `motion.ts`.
  - Componentes en `src/components/blueprint/`: `GridBackground`, `BlueprintFrame` (esquinas con DrawSVG), `DimensionLine` (cota horizontal/vertical que se extiende desde el valor), `SectionLabel`, `Annotation`, `SpecList`, `CornerCoords`, `TitleBlock`, `AccentHighlight`, `Button` / `ButtonLink`.
  - Página interna `/es/_plano` con todos los componentes, colores y escala tipográfica.
- **Archivos creados**: `src/app/fonts.ts`, `src/lib/animations/{gsap,motion}.ts`, `src/components/blueprint/*` (11 componentes en 10 archivos), `src/app/[locale]/%5Fplano/page.tsx`.
- **Archivos modificados**: `src/app/globals.css`, `src/app/[locale]/layout.tsx` (fuentes), `package.json` / `package-lock.json` (gsap, @gsap/react), `docs/BITACORA.md`.
- **Decisiones**: ver tabla.
- **Problemas / notas**:
  - En Tailwind 4 dos clases `rotate-*` en el mismo elemento no se suman (gana una): cada flecha de cota lleva una única rotación.
  - Las animaciones solo se crean con `prefers-reduced-motion: no-preference` (`gsap.matchMedia`); sin JS o con movimiento reducido todo se ve dibujado.
  - Revisión visual con capturas (Playwright + Edge, fuera del repo) en escritorio (1440) y móvil (390). El modo `--screenshot` de Edge headless no ejecuta bien las animaciones; no sirve para revisarlas.
  - Al parar `next start` en segundo plano en Windows, el proceso `node` puede quedar vivo ocupando el puerto. Hay que cerrarlo por PID.
  - Hay un paquete `node` instalado en `C:\Users\AlbertBatiste\node_modules` (junto al `package-lock.json` suelto de la carpeta de usuario). No afecta al proyecto.
- **Pendiente**: bloque B (cursor, pantalla de carga, layout global).
- **Verificación**: lint ☑ · typecheck ☑ · build ☑

### 2026-10-18 — Fase 1 — Cierre: preview y producción
- **Hecho**: variables de Supabase añadidas en Vercel (tipo *Config*, Production y Preview). PR #2 con preview correcta, merge a `main` y primer despliegue en producción.
- **Problemas / notas**:
  - Vercel marca como posible fuga las variables `NEXT_PUBLIC_…KEY` y no deja guardarlas como *Secret*. Hay que crearlas como **Config** (son públicas por diseño). Un *Secret* ya guardado no se puede pasar a *Config*: hay que borrarlo y crearlo de nuevo.
  - Las previews están protegidas con Vercel Authentication (solo Albert las ve con sesión iniciada).
  - `albert-web.vercel.app` pertenece a otra persona; el dominio de producción es **https://albert-web-iota.vercel.app**.
- **Verificación**: rutas probadas en producción: `/` → `/es` o `/en`, pathnames localizados, redirección `/en/formacion` → `/en/education`, `[slug]`, 404.

### 2026-10-18 — Fase 1 ⏸ — App base, i18n, Supabase y placeholders
- **Hecho**:
  - App creada con `create-next-app@16.4.2` (TypeScript, App Router, Tailwind 4, ESLint, `src/`, `@/*`) en carpeta temporal y movida sin tocar `CLAUDE.md`, `docs/` ni `.mcp.json`. Eliminados la página de ejemplo, las fuentes Geist, el modo oscuro de la plantilla y los SVG de `public/`.
  - Script `typecheck` (`next typegen && tsc --noEmit`) y `engines.node >= 24`.
  - next-intl: `es` (por defecto) y `en`, pathnames localizados (`/es/formacion` ↔ `/en/education`, etc.), detección del idioma del navegador, mensajes en `src/messages/`.
  - Supabase: clientes de servidor y de navegador, y `updateSession` para el proxy.
  - `src/proxy.ts`: `/admin` → refresco de sesión de Supabase; resto → next-intl.
  - Páginas placeholder de todas las rutas públicas, navegación mínima, selector ES/EN que mantiene la página actual y 404 traducido (`[...rest]` + `not-found.tsx`).
  - `remotePatterns` para Supabase Storage. `.env.example` y `.env.local` (este último fuera del repo).
- **Archivos creados**: `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.gitignore`, `.gitattributes`, `.env.example`, `README.md`, `AGENTS.md`, `src/proxy.ts`, `src/i18n/{routing,request,navigation}.ts`, `src/lib/supabase/{env,server,client,proxy}.ts`, `src/messages/{es,en}.json`, `src/components/layout/{SiteNav,LocaleSwitcher}.tsx`, `src/app/globals.css`, `src/app/favicon.ico`, `src/app/[locale]/{layout,page,not-found}.tsx` y las páginas de `formacion`, `proyectos`, `proyectos/[slug]`, `fotografia`, `fotografia/[slug]`, `contacto` y `[...rest]`.
- **Archivos modificados**: `docs/BITACORA.md`.
- **Decisiones**: ver tabla (Next 16 + `proxy.ts`, `next/root-params`, sesión solo en `/admin`, `.gitattributes`, `engines`, sin Prettier, clave publishable).
- **Problemas / notas**:
  - Con `cacheComponents`, lo que lee la URL en tiempo de petición tiene que ir dentro de `<Suspense>`: el selector de idioma (por las rutas `[slug]`) y el contenido de las páginas `[slug]`.
  - El 404 dentro de un idioma devuelve estado 404 y `noindex`, pero su contenido se pinta en el navegador (el HTML del servidor llega vacío). Comprobado que el payload trae el texto traducido. Se revisará en la Fase 10.
  - `AGENTS.md` lo genera Next.js (indica leer la documentación incluida en `node_modules/next/dist/docs/`); se versiona porque `next dev` lo vuelve a crear.
  - npm 11 avisa de scripts de instalación no aprobados (`unrs-resolver`, `@parcel/watcher`, `@swc/core`). No afectan: lint y build funcionan.
  - Next avisa de un `package-lock.json` suelto en `C:\Users\AlbertBatiste` (fuera del repo). No afecta al build.
- **Pendiente**: variables de entorno en Vercel, PR, preview, merge y despliegue en producción.
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · rutas probadas con `next start` (redirecciones `/` → `/es`/`/en` según idioma, rutas localizadas, redirección `/en/formacion` → `/en/education`, `[slug]`, 404).

### 2026-10-18 — Fase 0 — Verificación del entorno
- **Hecho**: comprobado todo el entorno.
  - Node v24.22.0 · npm 11.19.1 · git 2.55.0 · gh 2.102.0.
  - `gh auth status`: cuenta AlbertBC22 activa (scopes `repo`, `workflow`, `gist`, `read:org`).
  - Remoto `origin` → `https://github.com/AlbertBC22/Albert-web.git`; `main` sincronizada.
  - MCP de Supabase: esquema `public` vacío; URL del proyecto `https://vavygglppyhueqpywjxt.supabase.co`.
  - Vercel: proyecto `albert-web` conectado a `AlbertBC22/Albert-web` (confirmado por Albert con captura de *Settings → Git*).
- **Archivos creados**: `.mcp.json` (pasa a estar versionado).
- **Archivos modificados**: `docs/BITACORA.md`.
- **Decisiones**: versionar `.mcp.json`.
- **Problemas / notas**: `gh` está instalado en `C:\Program Files\GitHub CLI\gh.exe` pero no está en el PATH de las terminales de VS Code. Mientras tanto se usa con la ruta completa; probablemente se arregla reiniciando VS Code.
- **Pendiente**: comprobar que la *Production Branch* de Vercel es `main` (por defecto lo es).
- **Verificación**: lint — · typecheck — · build — (no aplica: todavía no hay app)

### 2026-10-18 — Preparación — Documentación inicial
- **Hecho**: se crean `CLAUDE.md`, `docs/PLAN.md`, `docs/BITACORA.md` y `docs/CONTENIDO.md`.
- **Pendiente**: empezar la Fase 0.

## Backlog

Ideas y cosas detectadas fuera de alcance. No se hacen sin pedirlo.

- Integración con la API de GitHub para proyectos.
- Versión en catalán.
- Dominio propio. Mientras tanto, opción gratuita: añadir un subdominio `.vercel.app` más bonito (p. ej. `albertbatiste.vercel.app`) si está libre.
- Notificación por email al recibir un mensaje de contacto.
- Captcha invisible si llega spam.
- Ampliar el panel admin (contenido del CV, estadísticas).
- Modo oscuro.
- (Fase 10) 404: conseguir que el contenido venga en el HTML del servidor (ahora se pinta en el cliente por `cacheComponents`).
- (Fase 5/7/8) Las lecturas públicas de Supabase no deben usar `cookies()` (convertiría las páginas en dinámicas): usar un cliente anónimo sin cookies y `use cache`.
