"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { firstIssue, numberOrNull, slugify, SLUG, text, textOrNull, type FormState } from "@/lib/admin/forms";
import { requireAdmin } from "@/lib/data/admin";
import { GALLERY_TAG } from "@/lib/data/gallery";
import { reorder } from "@/lib/data/reorder";
import { createClient } from "@/lib/supabase/server";
import { PHOTOS_BUCKET } from "@/lib/supabase/storage";

// Escrituras del panel para álbumes y fotos. Cada acción comprueba que el usuario es admin
// (además de la RLS de la base de datos) y valida los datos con zod.

// Errores de la base de datos → mensaje para el panel
function dbErrorMessage(error: { code?: string; message: string }) {
  if (error.code === "23505") return "Ya existe un álbum con esa URL (slug). Elige otra.";
  if (error.message.startsWith("Se ha alcanzado el límite")) return error.message + ".";
  return "No se ha podido guardar. Revisa los datos e inténtalo de nuevo.";
}

function refresh() {
  revalidatePath("/admin", "layout");
  updateTag(GALLERY_TAG); // la galería pública se actualiza al momento
}

// ---------------------------------------------------------------------------
// Álbumes
// ---------------------------------------------------------------------------
const AlbumSchema = z.object({
  slug: z.union([z.literal(""), z.string().max(80).regex(SLUG, "La URL solo admite minúsculas, números y guiones.")]),
  title_es: z.string().min(1, "El título en español es obligatorio.").max(120),
  title_en: z.string().min(1, "El título en inglés es obligatorio.").max(120),
  description_es: z.string().max(2000, "La descripción en español es demasiado larga."),
  description_en: z.string().max(2000, "La descripción en inglés es demasiado larga."),
  is_published: z.boolean(),
});

function parseAlbum(formData: FormData) {
  const parsed = AlbumSchema.safeParse({
    slug: text(formData, "slug"),
    title_es: text(formData, "title_es"),
    title_en: text(formData, "title_en"),
    description_es: text(formData, "description_es"),
    description_en: text(formData, "description_en"),
    is_published: formData.get("is_published") === "on",
  });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) } as const;

  const values = parsed.data;
  return {
    ok: true,
    values: {
      ...values,
      slug: values.slug || slugify(values.title_es),
      description_es: values.description_es || null,
      description_en: values.description_en || null,
    },
  } as const;
}

export async function createAlbum(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseAlbum(formData);
  if (!parsed.ok) return { error: parsed.error };
  if (!parsed.values.slug) return { error: "No se ha podido generar la URL: escribe un slug." };

  const supabase = await createClient();
  const { data: last } = await supabase
    .from("albums")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("albums")
    .insert({ ...parsed.values, position: (last?.position ?? -1) + 1 })
    .select("id")
    .single();
  if (error) return { error: dbErrorMessage(error) };

  refresh();
  redirect(`/admin/albumes/${data.id}`);
}

export async function updateAlbum(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseAlbum(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("albums").update(parsed.values).eq("id", id);
  if (error) return { error: dbErrorMessage(error) };

  refresh();
  return { error: null, ok: true };
}

export async function setAlbumPublished(id: string, published: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("albums").update({ is_published: published }).eq("id", id);
  refresh();
}

// Borra el álbum, sus fotos (por la clave foránea en cascada) y los archivos del Storage.
export async function deleteAlbum(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: photos } = await supabase.from("photos").select("storage_path").eq("album_id", id);
  const paths = (photos ?? []).map((photo) => photo.storage_path);
  if (paths.length > 0) await supabase.storage.from(PHOTOS_BUCKET).remove(paths);
  await supabase.from("albums").delete().eq("id", id);
  refresh();
  redirect("/admin/albumes");
}

// Sube o baja un álbum en el orden.
export async function moveAlbum(id: string, direction: "up" | "down") {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("albums").select("id").order("position").order("created_at");
  await reorder(supabase, "albums", (data ?? []).map((row) => row.id), id, direction);
  refresh();
}

export async function setAlbumCover(albumId: string, photoId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("albums").update({ cover_photo_id: photoId }).eq("id", albumId);
  refresh();
}

// ---------------------------------------------------------------------------
// Fotos
// ---------------------------------------------------------------------------

// Fila de una foto ya subida al Storage desde el navegador (ver PhotoUploader).
const NewPhotoSchema = z.object({
  storage_path: z.string().regex(/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(webp|jpg)$/),
  width: z.number().int().positive().max(2500),
  height: z.number().int().positive().max(2500),
  alt_es: z.string().min(1).max(300),
  alt_en: z.string().min(1).max(300),
  camera_make: z.string().max(80).nullable(),
  camera_model: z.string().max(80).nullable(),
  lens: z.string().max(120).nullable(),
  focal_length_mm: z.number().positive().max(99999).nullable(),
  aperture: z.number().positive().max(999).nullable(),
  shutter_speed: z.string().max(20).nullable(),
  iso: z.number().int().positive().nullable(),
  taken_at: z.iso.datetime().nullable(),
});

export type NewPhoto = z.infer<typeof NewPhotoSchema>;

export async function createPhoto(albumId: string, photo: NewPhoto): Promise<FormState> {
  await requireAdmin();
  const parsed = NewPhotoSchema.safeParse(photo);
  if (!parsed.success) return { error: "Los datos de la foto no son válidos." };
  if (!parsed.data.storage_path.startsWith(`${albumId}/`)) return { error: "La ruta no corresponde al álbum." };

  const supabase = await createClient();
  const { count } = await supabase.from("photos").select("*", { count: "exact", head: true }).eq("album_id", albumId);
  const { error } = await supabase.from("photos").insert({ ...parsed.data, album_id: albumId, position: count ?? 0 });
  if (error) return { error: dbErrorMessage(error) };

  refresh();
  return { error: null, ok: true };
}

const PhotoDetailsSchema = z.object({
  title_es: z.string().max(120).nullable(),
  title_en: z.string().max(120).nullable(),
  alt_es: z.string().min(1, "El texto alternativo en español es obligatorio.").max(300),
  alt_en: z.string().min(1, "El texto alternativo en inglés es obligatorio.").max(300),
  camera_make: z.string().max(80, "La marca es demasiado larga.").nullable(),
  camera_model: z.string().max(80, "El modelo es demasiado largo.").nullable(),
  lens: z.string().max(120, "El objetivo es demasiado largo.").nullable(),
  focal_length_mm: z.number("La focal no es válida.").positive("La focal no es válida.").max(99999, "La focal no es válida.").nullable(),
  aperture: z.number("La apertura no es válida.").positive("La apertura no es válida.").max(999, "La apertura no es válida.").nullable(),
  shutter_speed: z.string().max(20, "La velocidad es demasiado larga.").nullable(),
  iso: z.number("El ISO no es válido.").int("El ISO no es válido.").positive("El ISO no es válido.").nullable(),
  taken_at: z.iso.date("La fecha no es válida.").nullable(),
});

export async function updatePhoto(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = PhotoDetailsSchema.safeParse({
    title_es: textOrNull(formData, "title_es"),
    title_en: textOrNull(formData, "title_en"),
    alt_es: text(formData, "alt_es"),
    alt_en: text(formData, "alt_en"),
    camera_make: textOrNull(formData, "camera_make"),
    camera_model: textOrNull(formData, "camera_model"),
    lens: textOrNull(formData, "lens"),
    focal_length_mm: numberOrNull(formData, "focal_length_mm"),
    aperture: numberOrNull(formData, "aperture"),
    shutter_speed: textOrNull(formData, "shutter_speed"),
    iso: numberOrNull(formData, "iso"),
    taken_at: textOrNull(formData, "taken_at"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  const { taken_at, ...values } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("photos")
    // Solo importa el día: a las 12:00 UTC sigue siendo el mismo día en Europa
    .update({ ...values, taken_at: taken_at && `${taken_at}T12:00:00Z` })
    .eq("id", id);
  if (error) return { error: dbErrorMessage(error) };

  refresh();
  return { error: null, ok: true };
}

// Borra la foto de la base de datos y su archivo del Storage.
export async function deletePhoto(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: photo } = await supabase.from("photos").select("storage_path").eq("id", id).maybeSingle();
  if (!photo) return;
  await supabase.from("photos").delete().eq("id", id);
  await supabase.storage.from(PHOTOS_BUCKET).remove([photo.storage_path]);
  refresh();
}

export async function movePhoto(id: string, direction: "up" | "down") {
  await requireAdmin();
  const supabase = await createClient();
  const { data: photo } = await supabase.from("photos").select("album_id").eq("id", id).maybeSingle();
  if (!photo) return;
  const { data } = await supabase
    .from("photos")
    .select("id")
    .eq("album_id", photo.album_id)
    .order("position")
    .order("created_at");
  await reorder(supabase, "photos", (data ?? []).map((row) => row.id), id, direction);
  refresh();
}
