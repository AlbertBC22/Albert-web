import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Admin = {
  id: string;
  email: string | null;
};

// Usuario con sesión, si es admin. Una sola consulta por petición (cache de React).
// Requiere la política "Leer la propia fila de admin" (migración 006).
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: row } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", claims.sub)
    .maybeSingle();
  if (!row) return null;

  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : null };
});

// Para las páginas del panel: sin admin, al login.
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

// Recuentos para la portada del panel.
export async function getDashboardCounts() {
  const supabase = await createClient();
  const count = async (table: "albums" | "photos" | "projects") =>
    (await supabase.from(table).select("*", { count: "exact", head: true })).count ?? 0;

  const [albums, photos, projects, unread, photoLimit] = await Promise.all([
    count("albums"),
    count("photos"),
    count("projects"),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .is("read_at", null)
      .then(({ count }) => count ?? 0),
    supabase.rpc("get_photo_limit").then(({ data }) => data ?? 30),
  ]);

  return { albums, photos, projects, unread, photoLimit };
}
