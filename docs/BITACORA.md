# BITÁCORA — Albert-web

Fuente de verdad del estado del desarrollo. Claude Code la actualiza al cerrar cada fase o punto de control ⏸.
Las entradas del registro van de la más reciente a la más antigua.

## Estado actual

- **Fase actual**: Fase 3 — Página principal (⏸ tras Hero + Perfil + Experiencia)
- **Último paso completado**: contenido tipado del CV (ES + propuesta EN) y secciones Hero, Perfil y Experiencia
- **Siguiente paso**: Cifras, Stack, Idiomas, Intereses y CTA
- **Esperando a Albert**: —

## Estado por fase

Leyenda: ☐ pendiente · ◐ en curso · ⏸ parada en punto de control · ☑ terminada

| Fase | Nombre | Estado | Rama | PR / preview |
|---|---|---|---|---|
| 0 | Verificación del entorno | ☑ | `fase-00-entorno` | [#1](https://github.com/AlbertBC22/Albert-web/pull/1) (merge) |
| 1 | Base del proyecto | ☑ | `fase-01-base` | [#2](https://github.com/AlbertBC22/Albert-web/pull/2) (merge) · [producción](https://albert-web-iota.vercel.app) |
| 2 | Sistema de diseño "plano técnico" | ☑ | `fase-02-diseno` | [#3](https://github.com/AlbertBC22/Albert-web/pull/3) (squash merge) |
| 3 | Página principal (scroll) | ⏸ | `fase-03-principal` | |
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
| 2026-10-18 | **Descartado** el trazo a lápiz (filtro SVG de temblor y grano) en las líneas | A Albert le parece "mal hecho"; las líneas se quedan nítidas |
| 2026-10-18 | **Descartado** el "toque plateado" (incluido el garabato plateado): se mantienen tinta y azul cielo | Probado y no le convenció |
| 2026-10-19 | Merge de la Fase 2 con **squash** (un solo commit en `main`) | Historia limpia: la rama tenía pruebas descartadas y sus reversiones |
| 2026-10-19 | Fechas del CV como datos (`AAAA-MM`, `null` = actualidad) formateadas por idioma | Sin duplicar ni desincronizar fechas entre ES y EN |
| 2026-10-19 | Interruptor `NITS_PUBLISHED` en el contenido para el cambio de 2027 | El cambio "publicada" → "fue publicada" (y quitar enlaces) queda en una línea |
| 2026-10-19 | Foto del hero: marco de plano 4:5 con "Foto — pendiente" hasta que Albert la aporte | Sin saltos de layout cuando llegue la real |
| 2026-10-19 | La animación del hero espera a que se abra la pantalla de carga | Que no se pierda detrás del loader |
| 2026-10-19 | Experiencia en el orden de `CONTENIDO.md`; Suited y BeonDev son simultáneas (media jornada cada una) | Confirmado por Albert |
| 2026-10-18 | Botones: líneas de construcción nítidas que se pasan de las esquinas + garabato de rotulador azul cielo (trazo de 6 px, pasadas cada ~6 px) en zigzag vertical que rellena **de izquierda a derecha** al hover y remata en una línea horizontal en el borde | Los botones con marcas de esquina le parecían demasiado típicos; ajustes pedidos por Albert |

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

### 2026-10-19 — Fase 3 — Revisión del ⏸ y enlaces de NITS
- **Hecho**: Albert revisa en local las tres secciones y da el visto bueno (también a la traducción). Aporta las URLs de NITS: se añaden en `NITS_LINKS` (`flags.ts`), ligadas a `NITS_PUBLISHED`, y se muestran en la lámina de Chimera ("Disponible en: App Store ↗ Google Play ↗"). De la URL de Google Play se quita `hl=es` para que la tienda use el idioma del visitante. `ExternalLink` pasa a componente compartido y el aviso "(se abre en una pestaña nueva)" a `Common.newTab`.
- **Archivos creados**: `src/components/blueprint/ExternalLink.tsx`.
- **Archivos modificados**: `src/types/cv.ts`, `src/content/{flags,cv.es,cv.en}.ts`, `Hero.tsx`, `Experience.tsx`, `src/messages/{es,en}.json`, `docs/BITACORA.md`.
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · enlaces presentes en el HTML de `/en`.

### 2026-10-19 — Fase 3 ⏸ — Contenido del CV, Hero, Perfil y Experiencia
- **Hecho**:
  - Contenido tipado: `src/types/cv.ts`, `src/content/cv.es.ts` (de `CONTENIDO.md`, sin inventar datos), `src/content/cv.en.ts` (traducción propuesta, pendiente de revisión), `getCv(locale)` y el interruptor `NITS_PUBLISHED` (`src/content/flags.ts`).
  - **Hero**: nombre que sube línea a línea con máscara; encima, una cota que mide el ancho real del titular en px (`MeasuredDimension`, con `ResizeObserver`); rol, tagline, ficha (ubicación, LinkedIn, GitHub); foto pendiente en marco 4:5 con esquinas que se trazan y cotas 4 y 5; `[Scroll para continuar]` con una marca animada. La entrada espera a que se abra la pantalla de carga (`onLoaderReveal` + evento `loader:reveal`).
  - **Perfil (REF. 01)**: texto grande revelado línea a línea con SplitText (`mask: "lines"`, `autoSplit`).
  - **Experiencia (REF. 02)**: línea de tiempo vertical con *scrub*; nodos que se rellenan de azul al llegar la línea; cada puesto es una lámina (`BlueprintFrame`) con periodo, ficha, logros y la anotación de aprendizaje en NITS; "Otras experiencias" al final.
  - Fechas formateadas por idioma con `getFormatter` (zona `Europe/Madrid` en `i18n/request.ts`).
- **Archivos creados**: `src/types/cv.ts`, `src/content/{cv.es,cv.en,flags,index}.ts`, `src/components/sections/{SectionHeading,Hero,Profile,Experience}.tsx`, `src/components/motion/{HeroAnimation,MeasuredDimension,SplitReveal,TimelineAnimation}.tsx`.
- **Archivos modificados**: `src/app/[locale]/page.tsx`, `src/app/globals.css` (nodos, indicación de scroll, estados iniciales del hero), `src/lib/loader.ts` (`onLoaderReveal`), `Loader.tsx` (evento de apertura), `LoaderScript.tsx` (clase `js`), `DimensionLine.tsx` (prop `animated`), `src/i18n/request.ts` (zona horaria), `src/messages/{es,en}.json`, `docs/BITACORA.md`.
- **Problemas / notas**:
  - `toggleClass` de ScrollTrigger desactivaba los nodos al salir la lámina por arriba → `onEnter` / `onLeaveBack`.
  - Los estados iniciales del hero van en CSS solo con la clase `js` y sin reduced motion: sin JS o con movimiento reducido todo se ve desde el principio.
  - El periodo salía dos veces (arriba y en la ficha): se quita de la ficha.
  - Pendiente de Albert: URLs de NITS en App Store / Google Play (no están en `CONTENIDO.md`; de momento no hay enlaces).
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · Playwright: CLS 0 en 1440, 390 y 360 px; sin scroll horizontal; línea de tiempo con scrub y 6/6 nodos; reduced motion sin animaciones; loader, cursor y cabecera sin regresiones; sin errores de consola.

### 2026-10-19 — Fase 2 — Cierre: squash merge y producción
- **Hecho**: PR #3 con preview correcta; squash merge a `main` (`4313358`), rama borrada. Producción verificada con las mismas pruebas de navegador que en local (loader, cursor, cabecera, cajetín, móvil y reduced motion).
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · producción ☑

### 2026-10-19 — Fase 2 — Bloque B: cursor, pantalla de carga y layout global
- **Hecho**:
  - **Cursor de replanteo** (`CustomCursor`): cruz fina con halo blanco + lectura `X:0000 Y:0000`; marco de corchetes sobre enlaces y botones; marco con "VER" sobre `img` o `[data-cursor="view"]`; cursor nativo en campos de texto. Solo con `pointer: fine` y sin reduced motion (`useSyncExternalStore` sobre las media queries). Posición escrita directamente en el DOM, sin re-render por movimiento.
  - **Pantalla de carga** (`Loader` + `LoaderScript`): retícula que se traza desde el centro, marco con esquinas (DrawSVG), nombre revelado con máscara, pasos numerados con OK, cota de progreso con el %, y salida con un corte horizontal y apertura en dos hojas (~2,3 s en total). Primera visita de la sesión (`sessionStorage`), se salta con clic, Esc o el botón "[ Saltar ]". Un script en `<head>` la oculta antes de pintar si ya se vio o con reduced motion; `<noscript>` la oculta sin JS; failsafe CSS a los 6 s. Bloquea el scroll mientras se ve.
  - **Layout global**: retícula de fondo en todas las páginas; cabecera fija con firma, índice de planos `[00] Inicio…` (página activa marcada, menú desplegable en móvil) y selector `ES / EN`; pie con el cajetín (autor, proyecto, nº de plano por página `AB-00…AB-04`, `AB-99` en `_plano`, escala 1:1, revisión = fecha del build, idioma).
  - Páginas provisionales con el mismo contenedor que la cabecera y el cajetín.
- **Archivos creados**: `src/components/blueprint/CustomCursor.tsx`, `src/components/layout/{SiteHeader,HeaderNav,SiteFooter,SheetNumber,Loader,LoaderScript}.tsx`, `src/lib/loader.ts`.
- **Archivos modificados**: `src/app/[locale]/layout.tsx`, `src/app/globals.css`, `src/components/layout/LocaleSwitcher.tsx`, `next.config.ts` (`NEXT_PUBLIC_BUILD_DATE`), `src/messages/{es,en}.json`, páginas provisionales, `%5Fplano/page.tsx` (la retícula pasa al layout), `docs/BITACORA.md`.
- **Archivos eliminados**: `src/components/layout/SiteNav.tsx` (sustituido por `SiteHeader` + `HeaderNav`).
- **Problemas / notas**:
  - Una constante exportada desde un archivo `"use client"` llega al servidor como referencia de cliente, no como valor → la clave del loader vive en `src/lib/loader.ts`.
  - GSAP lee un `transform` puesto por CSS como píxeles: con estado inicial en CSS hay que usar `fromTo` (y `y: 0` cuando se anima `yPercent`).
  - La cruz negra desaparecía sobre fondos oscuros → halo blanco (`box-shadow` / `text-shadow`). Se descartó `mix-blend-mode` porque invertiría el marco de "VER".
  - En las rutas `[slug]` la navegación de la cabecera y el nº de plano se resuelven al recibir la petición (dentro de `Suspense`), por `cacheComponents`.
  - La duración real del loader (~2,3 s con la apertura) es algo mayor que los ~1,6 s previstos: 1,45 s de dibujo + ~0,9 s de apertura.
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · pruebas con Playwright + Edge: secuencia del loader, no reaparece al recargar, cursor (normal / enlace / foto / fondo oscuro), nº de plano y enlace activo correctos (`/es/_plano` → AB-99, `/en/projects/albert-web` → AB-02), móvil sin cursor ni scroll horizontal con menú desplegable, reduced motion sin loader ni cursor, sin errores de consola.

### 2026-10-18 — Fase 2 ⏸ — Plateado descartado: garabato azul de nuevo
- **Hecho**: Albert descarta también el garabato plateado. `globals.css` y `Scribble.tsx` se restauran tal cual estaban en `ea9f65e` (garabato azul cielo, opacidad 0,55). El código de `src/` queda idéntico al de antes de la prueba.
- **Archivos modificados**: `src/app/globals.css`, `src/components/blueprint/Scribble.tsx`, `docs/BITACORA.md`.
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · captura de los botones.

### 2026-10-18 — Fase 2 ⏸ — Del plateado, solo el garabato
- **Hecho**: Albert se queda solo con el garabato plateado. Se eliminan la clase `theme-silver`, los títulos metálicos, las líneas plateadas, el brillo plateado de los resaltes y los tokens `--stroke` / `--stroke-muted` (sin tema que alternar ya no aportan nada). Los componentes vuelven a `text-ink`, `text-ink-muted` y `border-ink`.
- Queda: degradado plateado del garabato (`--scribble-silver` #C3C8CE → `--scribble-silver-dark` #79808A → `--scribble-silver`, opacidad 0,8) en `Scribble.tsx`.
- **Archivos modificados**: `globals.css`, `[locale]/layout.tsx`, `Scribble.tsx`, `BlueprintFrame.tsx`, `DimensionLine.tsx`, `TitleBlock.tsx`, `docs/BITACORA.md`.
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · capturas.

### 2026-10-18 — Fase 2 ⏸ — PRUEBA: tema plateado
- **Hecho**: a petición de Albert, prueba de "un toque de plateado a todo", reversible:
  - Clase `theme-silver` en `<html>` (layout) que sobrescribe tokens: líneas de dibujo en gris plata (`--stroke`, `--stroke-muted`), resaltes y CTA con brillo plateado (`--gradient-accent`), garabato del botón en degradado plateado (`--scribble-from/to`, `--scribble-opacity`) y títulos grandes (`text-display`, `text-h1`, `text-h2`) con texto metálico grafito → plata.
  - Se mantienen en azul la retícula, las etiquetas `REF.`, las anotaciones y el foco.
  - Refactor de apoyo: los componentes usan `text-stroke`, `text-stroke-muted` y `border-stroke` en lugar de `ink` para sus líneas; el garabato toma el color de un degradado SVG con variables CSS (sin cambios visibles con el tema por defecto).
- **Archivos modificados**: `globals.css`, `[locale]/layout.tsx`, `Scribble.tsx`, `BlueprintFrame.tsx`, `DimensionLine.tsx`, `TitleBlock.tsx`, `docs/BITACORA.md`.
- **Decisiones**: pendiente de Albert. Si no le convence, se revierte este commit.
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · capturas comparativas con y sin plateado.

### 2026-10-18 — Fase 2 ⏸ — Separación del garabato a 6 px · cierre del bloque A
- **Hecho**: separación entre pasadas del garabato reducida a ~6 px (`STEPS` en `Scribble.tsx`), a petición de Albert. Con esto da por bueno el aspecto de los botones y el bloque A.
- **Archivos modificados**: `src/components/blueprint/Scribble.tsx`, `docs/BITACORA.md`.
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · capturas de los botones.

### 2026-10-18 — Fase 2 ⏸ — Remate del garabato en línea
- **Hecho**: el garabato ya no es uniforme: en el último tramo (30 % del ancho, máx. 70 px) el zigzag pierde altura hasta acabar en una línea horizontal en el borde derecho, como el remate de un trazo.
- **Archivos creados**: `src/components/blueprint/Scribble.tsx` (componente de cliente).
- **Archivos modificados**: `Button.tsx`, `globals.css`, `docs/BITACORA.md`.
- **Decisiones**: para rematar justo en el borde hay que conocer el ancho del botón → `Scribble` lo mide con `ResizeObserver`, genera el trazo en px reales y pasa su longitud exacta (`getTotalLength`) en `--scribble-length` al `<svg>`. Desaparecen el valor fijo de `stroke-dasharray` y el truco del `slice`. Animación: 0,7 s.
- **Problemas / notas**: la variable CSS debe ir en el `<svg>` (donde se resuelve `stroke-dasharray`), no en el `<path>`.
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · capturas de los tres botones.

### 2026-10-18 — Fase 2 ⏸ — Garabato con pasadas más separadas
- **Hecho**: a petición de Albert, más separación entre las pasadas del garabato (~8 px, igual en todos los botones).
- **Problemas / notas**:
  - Con el garabato estirado al ancho del botón (`preserveAspectRatio="none"`), la separación dependía del ancho: los botones estrechos quedaban macizos. Ahora el garabato se dibuja a escala real (480 × 40) y cada botón muestra su tramo (`xMinYMid slice` + `overflow: hidden`). El rotulador avanza a la misma velocidad en todos.
  - Al salir del hover ya no se "despinta" (empezaría por el tramo invisible y tardaría en notarse): se desvanece en 0,25 s y se reinicia.
  - Si cambia la altura del botón o el patrón del garabato, revisar `stroke-dasharray` (longitud total ~1.900 px).
- **Archivos modificados**: `Button.tsx`, `globals.css`, `docs/BITACORA.md`.
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · capturas de los tres botones.

### 2026-10-18 — Fase 2 ⏸ — Garabato de izquierda a derecha y más fino
- **Hecho**: el garabato pasa a ser un zigzag vertical (~48 pasadas con avance y extremos irregulares) que avanza de izquierda a derecha; grosor 6 px constante gracias a `vector-effect="non-scaling-stroke"`.
- **Problemas / notas**: con `non-scaling-stroke` no se puede usar `pathLength`; el guion se fija en px (`stroke-dasharray: 1900px 2000px`). Funciona porque la longitud del zigzag (~1.700–1.850 px) apenas depende del ancho del botón: la marcan las pasadas verticales. Si se cambia la altura del botón o el nº de pasadas, revisar ese valor.
- **Archivos modificados**: `Button.tsx`, `globals.css`, `docs/BITACORA.md`.
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · capturas de los tres botones.

### 2026-10-18 — Fase 2 ⏸ — Botones con garabato de rotulador
- **Hecho**:
  - Se probó un trazo a lápiz (filtro SVG) en todas las líneas y botones dibujados a mano (`f8428c2`). Albert lo descarta para las líneas → revertido (`c7f2aa3`).
  - Botones nuevos: cuatro líneas de construcción nítidas que se pasan 8 px de las esquinas; al pasar el ratón (o con foco de teclado) un garabato en zigzag de "rotulador" azul cielo los rellena de arriba abajo (`stroke-dashoffset` con `pathLength=1`) y la flecha opcional (`arrow`) avanza. Al salir, se "despinta" en sentido inverso. La variante `accent` conserva el degradado de base.
- **Archivos modificados**: `src/components/blueprint/Button.tsx`, `src/app/globals.css`, `src/app/[locale]/%5Fplano/page.tsx`, `docs/BITACORA.md`.
- **Problemas / notas**:
  - `vector-effect="non-scaling-stroke"` rompe `pathLength` en Chromium (el garabato se quedaba a medias). El grosor va en unidades del viewBox.
  - Con `stroke-dasharray: 1` y remate redondo quedaba un punto visible en reposo; se usa `1 1.1`.
- **Verificación**: lint ☑ · typecheck ☑ · build ☑ · capturas en reposo, a mitad y al final del hover.

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
