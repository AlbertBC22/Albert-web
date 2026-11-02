import type { Locale } from "next-intl";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

// Lecturas públicas de la galería. Van en caché; las acciones del panel la invalidan con esta
// etiqueta. La vida de una hora cubre los cambios hechos desde otro despliegue (p. ej. en local).
export const GALLERY_TAG = "gallery";

export type GalleryAlbumCard = {
  slug: string;
  title: string;
  coverPath: string;
  coverAlt: string;
  photoCount: number;
  year: number | null;
};

export type GalleryPhoto = {
  id: string;
  path: string;
  width: number;
  height: number;
  title: string | null;
  alt: string;
  camera: string | null;
  lens: string | null;
  focalLengthMm: number | null;
  aperture: number | null;
  shutterSpeed: string | null;
  iso: number | null;
  takenAt: string | null;
};

export type GalleryAlbum = {
  title: string;
  description: string | null;
  photos: GalleryPhoto[];
};

// Índice: álbumes publicados con alguna foto. Sin portada elegida, se usa la primera foto.
// El año es el de la foto más reciente con fecha; si ninguna la tiene, no se muestra.
export async function listGalleryAlbums(locale: Locale): Promise<GalleryAlbumCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(GALLERY_TAG);

  const { data, error } = await createPublicClient()
    .from("albums")
    // Dos relaciones entre albums y photos (fotos del álbum y portada): se indica cuál usar
    .select(
      "slug, title_es, title_en, cover_photo_id, photos!photos_album_id_fkey(id, storage_path, alt_es, alt_en, taken_at)",
    )
    .order("position")
    .order("created_at")
    .order("position", { referencedTable: "photos" })
    .order("created_at", { referencedTable: "photos" });
  if (error) throw error;

  return data
    .filter((album) => album.photos.length > 0)
    .map((album) => {
      const cover = album.photos.find((photo) => photo.id === album.cover_photo_id) ?? album.photos[0];
      const years = album.photos.flatMap((photo) => (photo.taken_at ? [new Date(photo.taken_at).getUTCFullYear()] : []));
      return {
        slug: album.slug,
        title: locale === "en" ? album.title_en : album.title_es,
        coverPath: cover.storage_path,
        coverAlt: locale === "en" ? cover.alt_en : cover.alt_es,
        photoCount: album.photos.length,
        year: years.length > 0 ? Math.max(...years) : null,
      };
    });
}

// Un álbum publicado con sus fotos en orden. null si no existe, no está publicado o está vacío.
export async function getGalleryAlbum(slug: string, locale: Locale): Promise<GalleryAlbum | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(GALLERY_TAG);

  const { data, error } = await createPublicClient()
    .from("albums")
    .select("title_es, title_en, description_es, description_en, photos!photos_album_id_fkey(*)")
    .eq("slug", slug)
    .order("position", { referencedTable: "photos" })
    .order("created_at", { referencedTable: "photos" })
    .maybeSingle();
  if (error) throw error;
  if (!data || data.photos.length === 0) return null;

  const en = locale === "en";
  return {
    title: en ? data.title_en : data.title_es,
    description: en ? data.description_en : data.description_es,
    photos: data.photos.map((photo) => ({
      id: photo.id,
      path: photo.storage_path,
      width: photo.width,
      height: photo.height,
      title: en ? photo.title_en : photo.title_es,
      alt: en ? photo.alt_en : photo.alt_es,
      camera: [photo.camera_make, photo.camera_model].filter(Boolean).join(" ") || null,
      lens: photo.lens,
      focalLengthMm: photo.focal_length_mm,
      aperture: photo.aperture,
      shutterSpeed: photo.shutter_speed,
      iso: photo.iso,
      takenAt: photo.taken_at,
    })),
  };
}
