# Albert-web

Web personal de Albert Batiste Castellet: CV virtual, proyectos y galería de fotografía.

Next.js (App Router) · TypeScript · Tailwind CSS · next-intl (ES/EN) · Supabase · Vercel.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # y rellena las variables de Supabase
npm run dev                  # http://localhost:3000 → redirige a /es o /en
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run lint` | ESLint |
| `npm run typecheck` | Genera los tipos de rutas y ejecuta `tsc --noEmit` |
| `npm run build` | Build de producción |

## Documentación

- [`CLAUDE.md`](CLAUDE.md): contexto y normas del proyecto.
- [`docs/PLAN.md`](docs/PLAN.md): fases de desarrollo.
- [`docs/BITACORA.md`](docs/BITACORA.md): estado real del desarrollo.
