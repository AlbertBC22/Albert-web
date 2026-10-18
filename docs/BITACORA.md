# BITÁCORA — Albert-web

Fuente de verdad del estado del desarrollo. Claude Code la actualiza al cerrar cada fase o punto de control ⏸.
Las entradas del registro van de la más reciente a la más antigua.

## Estado actual

- **Fase actual**: Fase 0 — Verificación del entorno (cerrada, pendiente de PR)
- **Último paso completado**: verificación del entorno
- **Siguiente paso**: Fase 1 — Base del proyecto
- **Esperando a Albert**: revisar el PR de la Fase 0 y confirmar el inicio de la Fase 1

## Estado por fase

Leyenda: ☐ pendiente · ◐ en curso · ⏸ parada en punto de control · ☑ terminada

| Fase | Nombre | Estado | Rama | PR / preview |
|---|---|---|---|---|
| 0 | Verificación del entorno | ☑ | `fase-00-entorno` | — |
| 1 | Base del proyecto | ☐ | | |
| 2 | Sistema de diseño "plano técnico" | ☐ | | |
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
- Dominio propio.
- Notificación por email al recibir un mensaje de contacto.
- Captcha invisible si llega spam.
- Ampliar el panel admin (contenido del CV, estadísticas).
- Modo oscuro.
