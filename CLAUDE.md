# CLAUDE.md — Albert-web

Contexto permanente para Claude Code. Léelo entero al empezar cada sesión, junto con `docs/BITACORA.md`.

## 1. Qué es este proyecto

Web personal de **Albert Batiste Castellet** (Software Developer · .NET · Angular · SQL Server, Barcelona).
Sirve como **CV virtual** y como escaparate personal, con una **galería de fotografía** (su gran afición) y una sección de **proyectos de código**.

- Repositorio: https://github.com/AlbertBC22/Albert-web (público)
- Despliegue: Vercel, conectado al repo. `main` = producción; cada rama/PR = preview.
- Dominio: el gratuito de Vercel (`*.vercel.app`) por ahora.
- Idiomas: **español (por defecto) e inglés**. El catalán queda para más adelante.
- Solo **modo claro**.

Documentos de referencia:
- `docs/PLAN.md` → fases de desarrollo, con criterios de "terminado".
- `docs/BITACORA.md` → estado real del desarrollo. Es la fuente de verdad sobre qué está hecho.
- `docs/CONTENIDO.md` → todos los textos del CV (fuente para los archivos de contenido).

## 2. Protocolo de trabajo (OBLIGATORIO)

Albert quiere avanzar **paso a paso y revisar cada fase**. Nunca hagas varias fases seguidas.

### Al empezar una sesión
1. Lee `CLAUDE.md`, `docs/BITACORA.md` y la fase actual en `docs/PLAN.md`.
2. Resume en 3-5 líneas: en qué fase estamos, qué quedó pendiente y qué propones hacer ahora.
3. Espera confirmación antes de tocar código.

### Al empezar una fase
1. Presenta el **plan de la fase**: pasos, archivos que vas a crear o modificar, dependencias nuevas.
2. Lista las **decisiones de diseño o arquitectura** que haya que tomar, con tu recomendación. Albert quiere confirmar las decisiones **antes** de implementar.
3. Espera un "ok" explícito.
4. Crea una rama `fase-XX-nombre-corto` desde `main` actualizado.

### Durante la fase
- Trabaja solo dentro del alcance de la fase. Si descubres algo fuera de alcance, anótalo en la bitácora (sección Backlog) y sigue.
- Si una fase tiene **puntos de control ⏸** en el plan, detente en cada uno igual que al final de una fase.
- Si te bloqueas o algo requiere una acción de Albert (crear un usuario, añadir una variable de entorno en Vercel, etc.), para y explícale exactamente qué hacer.

### Al terminar una fase (o un punto de control ⏸)
1. Ejecuta `npm run lint`, `npm run typecheck` y `npm run build`. Todo debe pasar sin errores.
2. Actualiza `docs/BITACORA.md`: tabla de estado, entrada nueva en el registro, decisiones tomadas y backlog.
3. Haz commit (mensajes en formato Conventional Commits, texto en español, p. ej. `feat(galeria): lightbox con ficha técnica`).
4. Presenta a Albert un **informe de cierre** con este formato:
   - **Hecho**: qué se ha implementado.
   - **Archivos**: creados / modificados. Para los modificados que ya existían, muestra un resumen **antes → después** de los cambios relevantes.
   - **Cómo verificarlo**: comandos, URLs locales y qué mirar.
   - **Acciones para Albert**: si las hay.
   - **Siguiente**: qué fase o paso viene y qué decisiones habrá que tomar.
5. Pregunta: **"¿Hago push y abro el PR para revisar la preview en Vercel?"**. No hagas push sin un sí.
6. Tras revisar la preview, pregunta si hacer merge a `main`. Después pregunta **"¿Continuamos con la Fase X?"**.
7. **No empieces la siguiente fase sin un "sí" explícito.**

## 3. Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js (última versión estable) con App Router, React, TypeScript estricto |
| Estilos | Tailwind CSS (última versión), con tokens de diseño en CSS variables |
| Animaciones | GSAP (+ ScrollTrigger, DrawSVG, SplitText; todos gratuitos) con `@gsap/react` (`useGSAP`) |
| i18n | `next-intl`, rutas con prefijo `/es` y `/en`, pathnames localizados |
| Backend | Supabase: Postgres, Auth (solo el admin), Storage (fotos e imágenes de proyectos) |
| Cliente Supabase | `@supabase/ssr` (cliente de servidor y de navegador separados) |
| Validación | `zod` |
| EXIF | `exifr` (lectura en el navegador al subir fotos) |
| Despliegue | Vercel (integración con GitHub) |

No añadas otras dependencias sin proponerlo antes y explicar por qué.

## 4. Principios de código

- **Separación de responsabilidades clara**: componentes de UI sin lógica de datos; acceso a datos en `src/lib/data/*`; tipos en `src/types`; contenido estático en `src/content`.
- **Simplicidad primero**: no metas capas, abstracciones o patrones "por si acaso". Albert revisa el código y prefiere lo directo. Si dudas entre dos enfoques, elige el más simple y coméntalo.
- **Server Components por defecto**; `"use client"` solo donde haga falta (animaciones, cursor, formularios, panel admin).
- Server Actions para escrituras (formulario de contacto, panel admin), validadas con zod en servidor.
- TypeScript estricto; nada de `any` sin justificar.
- Nombres de código en inglés; textos visibles y comentarios en español.
- Accesibilidad: HTML semántico, `alt` en todas las imágenes, foco visible, contraste AA, navegación por teclado.
- Respeta `prefers-reduced-motion`: sin animaciones de scroll ni cursor personalizado en ese caso.

### Estructura de carpetas orientativa
```
src/
  app/
    [locale]/            # páginas públicas (es/en)
      page.tsx           # principal (scroll)
      formacion/ ...     # pathnames localizados vía next-intl
      proyectos/ ...
      fotografia/ ...
      contacto/ ...
    admin/               # panel admin (solo español, fuera de [locale])
  components/
    blueprint/           # piezas del sistema de diseño (cotas, marcos, cajetín...)
    sections/            # secciones de la página principal
    gallery/ admin/ ...
  content/               # cv.es.ts, cv.en.ts (datos tipados del CV)
  lib/
    supabase/            # server.ts, client.ts, middleware
    data/                # consultas por entidad
    animations/          # helpers GSAP
  messages/              # es.json, en.json (textos de interfaz)
  types/
supabase/
  migrations/            # SQL versionado de todas las migraciones
```

## 5. Seguridad y datos personales

- **Nunca** subas claves al repo. `.env.local` está en `.gitignore`; mantén un `.env.example` sin valores.
- La app usa **solo** la URL del proyecto y la clave pública (publishable/anon) de Supabase. La clave secreta (service role) **no** se usa en la app. Toda la protección va por **RLS**.
- El repo es **público**: no escribas en él teléfono, email personal ni datos privados de Albert. El contacto es solo mediante formulario.
- Al subir fotos, **elimina la ubicación GPS** y el resto de metadatos del archivo. Solo se guardan en BD los datos técnicos permitidos (cámara, objetivo, focal, apertura, velocidad, ISO, fecha).
- Supabase MCP: está limitado a este proyecto. Toda modificación del esquema se hace con **migraciones** guardadas también en `supabase/migrations/`. Antes de aplicar una migración, enséñale el SQL a Albert.

## 6. Sistema de diseño — "plano técnico"

Concepto: la web es un **plano de arquitecto que se está dibujando**. Minimalista, moderna, fondo blanco y tinta negra, con acentos azul cielo.

Referencias que le gustan a Albert: heronaiapp.com y abatable.com. De ellas tomamos:
- Lectura de coordenadas `X:0412 Y:0218` que sigue al ratón.
- Pantalla de carga con pasos numerados (`001 TRAZANDO RETÍCULA…`) y porcentaje.
- Índices entre corchetes `[01]`, coordenadas en esquinas `[0,246]`, indicaciones tipo `[Scroll para continuar]`.
- Fichas clave–valor (`ROL : Software Developer`).
- Cifras grandes como datos destacados.
- Líneas de dibujo y topográficas como ornamento.

Elementos propios:
- **Retícula** milimetrada muy tenue de fondo (líneas azul cielo a baja opacidad).
- **Marcos** con marcas de esquina que se trazan al entrar en pantalla.
- **Cotas** (líneas de medida con flechas y valor) que acompañan títulos y bloques.
- **Etiquetas de sección** en monoespaciada: `REF. 02 — EXPERIENCIA`.
- **Cajetín** de plano como pie de página: autor, nº de plano, escala, fecha de revisión e idioma.
- **Cursor personalizado**: cruz de replanteo fina con lectura de coordenadas. Sobre enlaces o botones se transforma en un marco de corchetes; sobre fotos muestra `VER`. Se desactiva en dispositivos táctiles (`pointer: coarse`) y con `prefers-reduced-motion`. En campos de texto se usa el cursor nativo.
- **Animaciones** distintas por sección (no la misma aparición para todo):
  - líneas que se dibujan con el scroll (DrawSVG + ScrollTrigger con scrub);
  - textos que aparecen línea a línea con máscara (SplitText);
  - contadores numéricos en las cifras;
  - barrido tipo "escáner" al revelar fotos;
  - cotas que se extienden al aparecer.
- **Degradados sutiles** azul cielo solo para resaltar elementos destacados (cifras, rol actual, CTA). Nunca de fondo general.

Tokens de partida (se confirman en la Fase 2):
```
--paper:      #FFFFFF
--ink:        #0A0A0A
--ink-muted:  #5A5A5A
--line:       rgba(10,10,10,0.14)
--grid:       rgba(56,189,248,0.10)
--sky:        #38BDF8   /* acento gráfico (líneas, cursor, detalles) */
--sky-soft:   #E0F2FE   /* fondos de resalte */
--sky-ink:    #0369A1   /* azul para TEXTO (cumple contraste AA sobre blanco) */
--gradient-accent: linear-gradient(90deg, #E0F2FE 0%, rgba(224,242,254,0) 100%)
```
Tipografías propuestas: **IBM Plex Sans** (texto) + **IBM Plex Mono** (etiquetas, cotas, datos), cargadas con `next/font`.

## 7. Comandos

```
npm run dev        # desarrollo
npm run lint
npm run typecheck  # tsc --noEmit (crear el script en la Fase 1)
npm run build
```
