import { defineRouting } from "next-intl/routing";

// Idiomas y rutas públicas localizadas.
// Las claves son las rutas internas (carpetas de src/app/[locale]); los valores, la URL pública en cada idioma.
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/formacion": { es: "/formacion", en: "/education" },
    "/proyectos": { es: "/proyectos", en: "/projects" },
    "/proyectos/[slug]": { es: "/proyectos/[slug]", en: "/projects/[slug]" },
    "/fotografia": { es: "/fotografia", en: "/photography" },
    "/fotografia/[slug]": { es: "/fotografia/[slug]", en: "/photography/[slug]" },
    "/contacto": { es: "/contacto", en: "/contact" },
  },
});
