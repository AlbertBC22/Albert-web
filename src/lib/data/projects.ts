import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type AdminProjectListItem = Pick<Tables<"projects">, "id" | "slug" | "title_es" | "is_published" | "status">;

// Panel: todos los proyectos (publicados o no), en su orden.
export async function listProjectsAdmin(): Promise<AdminProjectListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug, title_es, is_published, status")
    .order("position")
    .order("created_at");
  if (error) throw error;
  return data;
}

// Panel: un proyecto. null si no existe.
export async function getProjectAdmin(id: string): Promise<Tables<"projects"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}
