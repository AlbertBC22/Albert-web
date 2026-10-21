import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

const LOGIN_PATH = "/admin/login";

// Para /admin/*: refresca la sesión de Supabase (si el token ha caducado) y escribe las
// cookies nuevas en la respuesta. Además hace de primera barrera:
// - sin sesión → /admin/login
// - con sesión en /admin/login → /admin
// La comprobación de que el usuario es ADMIN se hace en el servidor (requireAdmin).
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
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);
  const isLoginPage = request.nextUrl.pathname === LOGIN_PATH;

  if (!isLoggedIn && !isLoginPage) return redirectKeepingCookies(request, response, LOGIN_PATH);
  if (isLoggedIn && isLoginPage) return redirectKeepingCookies(request, response, "/admin");

  return response;
}

// Redirige conservando las cookies de sesión que haya escrito Supabase en `response`.
function redirectKeepingCookies(request: NextRequest, response: NextResponse, path: string) {
  const redirect = NextResponse.redirect(new URL(path, request.url));
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  redirect.headers.set("Cache-Control", "private, no-store");
  return redirect;
}
