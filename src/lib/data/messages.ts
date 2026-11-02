import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

// Panel: mensajes de contacto, del más reciente al más antiguo.
export async function listMessagesAdmin(): Promise<Tables<"contact_messages">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
