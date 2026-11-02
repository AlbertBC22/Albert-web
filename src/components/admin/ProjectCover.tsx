"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { removeProjectCover, setProjectCover } from "@/app/admin/(panel)/proyectos/actions";
import { processPhoto } from "@/lib/images/processPhoto";
import { createClient } from "@/lib/supabase/client";
import { PROJECTS_BUCKET, publicStorageUrl } from "@/lib/supabase/storage";
import { SubmitButton } from "./buttons";
import { FormMessage } from "./fields";

type Props = {
  projectId: string;
  projectTitle: string;
  coverPath: string | null;
};

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

// Portada de un proyecto. Pasa por el mismo procesado que las fotos (redimensionado y
// re-codificado sin metadatos), se sube al Storage desde el navegador y se guarda la ruta.
export default function ProjectCover({ projectId, projectTitle, coverPath }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setBusy(true);
    setError(null);
    try {
      if (!ACCEPTED.includes(file.type)) throw new Error("Formato no compatible (usa JPEG, PNG o WebP).");
      const image = await processPhoto(file);
      const path = `${projectId}/${crypto.randomUUID()}.${image.extension}`;

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(PROJECTS_BUCKET)
        .upload(path, image.blob, { contentType: image.blob.type, cacheControl: "31536000", upsert: false });
      if (uploadError) throw new Error("No se ha podido subir el archivo.");

      const result = await setProjectCover(projectId, path);
      if (result.error) {
        await supabase.storage.from(PROJECTS_BUCKET).remove([path]); // no dejar archivos huérfanos
        throw new Error(result.error);
      }
      router.refresh();
    } catch (uploadFailure) {
      setError(uploadFailure instanceof Error ? uploadFailure.message : "Error desconocido.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {coverPath ? (
        <Image
          src={publicStorageUrl(PROJECTS_BUCKET, coverPath)}
          alt={`Portada de ${projectTitle}`}
          width={640}
          height={400}
          sizes="20rem"
          unoptimized // miniatura del panel: no gasta la optimización de imágenes de Vercel
          className="h-auto w-80 max-w-full border border-line"
        />
      ) : (
        <p className="text-ink-muted">Este proyecto no tiene portada.</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <label className={`label-mono border border-dashed border-ink-muted px-4 py-3 ${busy ? "cursor-not-allowed text-ink-muted" : "cursor-pointer hover:border-ink"}`}>
          {busy ? "Subiendo…" : coverPath ? "Cambiar portada" : "Elegir portada"}
          <input type="file" accept={ACCEPTED.join(",")} disabled={busy} className="sr-only" onChange={onFile} />
        </label>
        {coverPath && (
          <form action={removeProjectCover.bind(null, projectId)}>
            <SubmitButton>Quitar portada</SubmitButton>
          </form>
        )}
      </div>

      <FormMessage error={error} />
    </div>
  );
}
