import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type AdminAlbumListItem = Pick<
  Tables<"albums">,
  "id" | "slug" | "title_es" | "is_published" | "position"
> & { photoCount: number };

export type AdminAlbum = Tables<"albums"> & { photos: Tables<"photos">[] };

// Panel: todos los álbumes (publicados o no) con su nº de fotos, en su orden.
export async function listAlbumsAdmin(): Promise<AdminAlbumListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    // Dos relaciones entre albums y photos (fotos del álbum y portada): se indica cuál usar
    .select("id, slug, title_es, is_published, position, photos!photos_album_id_fkey(count)")
    .order("position")
    .order("created_at");
  if (error) throw error;

  return data.map(({ photos, ...album }) => ({ ...album, photoCount: photos[0]?.count ?? 0 }));
}

// Panel: un álbum con sus fotos ordenadas. null si no existe.
export async function getAlbumAdmin(id: string): Promise<AdminAlbum | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .select("*, photos!photos_album_id_fkey(*)")
    .eq("id", id)
    .order("position", { referencedTable: "photos" })
    .order("created_at", { referencedTable: "photos" })
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Total de fotos (de todos los álbumes) y límite, para el contador "N / 30".
export async function getPhotoUsage() {
  const supabase = await createClient();
  const [{ count }, { data: limit }] = await Promise.all([
    supabase.from("photos").select("*", { count: "exact", head: true }),
    supabase.rpc("get_photo_limit"),
  ]);
  return { count: count ?? 0, limit: limit ?? 30 };
}
