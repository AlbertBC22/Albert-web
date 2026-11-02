"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/data/admin";
import { createClient } from "@/lib/supabase/server";

// Escrituras del panel para los mensajes de contacto. Cada acción comprueba que el usuario
// es admin (además de la RLS de la base de datos).

export async function markMessageRead(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("contact_messages").update({ read_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}
