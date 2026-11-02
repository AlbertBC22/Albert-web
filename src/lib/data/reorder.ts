import type { createClient } from "@/lib/supabase/server";

// Intercambia `id` con su vecino y guarda las posiciones 0, 1, 2… de toda la lista, para que
// queden limpias aunque hubiera huecos o empates.
export async function reorder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: "albums" | "photos" | "projects",
  ids: string[],
  id: string,
  direction: "up" | "down",
) {
  const index = ids.indexOf(id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= ids.length) return;
  [ids[index], ids[target]] = [ids[target], ids[index]];
  await Promise.all(ids.map((rowId, position) => supabase.from(table).update({ position }).eq("id", rowId)));
}
