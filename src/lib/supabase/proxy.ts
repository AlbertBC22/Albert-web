import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

// Refresca la sesión de Supabase (si el token ha caducado) y escribe las cookies
// nuevas en la respuesta. Solo se usa en /admin; ver src/proxy.ts.
export async function updateSession(request: NextRequest) {
  const { url, publishableKey } = getSupabaseEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        // Cabeceras anti-caché: una respuesta con cookies de sesión no debe cachearse.
        Object.entries(headers).forEach(([key, value]) =>
          response.headers.set(key, value),
        );
      },
    },
  });

  // Debe llamarse antes de devolver la respuesta: es lo que dispara el refresco.
  await supabase.auth.getClaims();

  return response;
}
