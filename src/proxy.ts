import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/proxy";

const handleI18nRouting = createMiddleware(routing);

// Se ejecuta antes de cada petición (salvo archivos estáticos):
// - /admin: solo refresca la sesión de Supabase (panel sin prefijo de idioma).
// - resto: next-intl resuelve el idioma y redirige / → /es o /en.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return updateSession(request);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Excluye api, internos de Next/Vercel y cualquier ruta con extensión (favicon.ico, imágenes...).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
