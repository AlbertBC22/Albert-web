// Buckets de Supabase Storage y URLs públicas de sus archivos.

export const PHOTOS_BUCKET = "photos";
export const PROJECTS_BUCKET = "projects";

// URL pública de un archivo de un bucket público (no necesita sesión ni firma).
export function publicStorageUrl(bucket: string, path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
