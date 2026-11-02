import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

// Cliente de Supabase para las lecturas públicas: sin cookies ni sesión, así se puede usar
// dentro de "use cache" y las páginas no se vuelven dinámicas. Solo ve lo que permite la
// RLS a un visitante (lo publicado).
export function createPublicClient() {
  const { url, publishableKey } = getSupabaseEnv();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => [],
      setAll() {},
    },
  });
}
