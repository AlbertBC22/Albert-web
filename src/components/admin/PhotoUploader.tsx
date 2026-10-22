"use client";

import { useRouter } from "next/navigation";
import { useState, type DragEvent } from "react";
import { createPhoto } from "@/app/admin/(panel)/albumes/actions";
import { processPhoto } from "@/lib/images/processPhoto";
import { createClient } from "@/lib/supabase/client";
import { PHOTOS_BUCKET } from "@/lib/supabase/storage";

type Props = {
  albumId: string;
  albumTitle: { es: string; en: string };
  used: number; // fotos ya subidas (todas las del sitio)
  limit: number;
};

type Item = { name: string; status: "pending" | "working" | "done" | "error"; message?: string };

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

// Subida múltiple de fotos (arrastrar y soltar o elegir archivos). Cada foto se procesa en
// el navegador (EXIF sin GPS + redimensionado + re-codificado sin metadatos), se sube al
// Storage y se guarda su fila. Respeta el límite global de fotos.
export default function PhotoUploader({ albumId, albumTitle, used, limit }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const remaining = Math.max(0, limit - used);

  const update = (index: number, patch: Partial<Item>) =>
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  async function upload(files: File[]) {
    if (busy || files.length === 0) return;
    const accepted = files.slice(0, remaining);
    const skipped = files.slice(remaining);
    setItems([
      ...accepted.map((file) => ({ name: file.name, status: "pending" as const })),
      ...skipped.map((file) => ({ name: file.name, status: "error" as const, message: `Límite de ${limit} fotos alcanzado` })),
    ]);
    setBusy(true);
    const supabase = createClient();

    for (const [index, file] of accepted.entries()) {
      update(index, { status: "working" });
      try {
        if (!ACCEPTED.includes(file.type)) throw new Error("Formato no compatible (usa JPEG, PNG o WebP).");
        const photo = await processPhoto(file);
        const path = `${albumId}/${crypto.randomUUID()}.${photo.extension}`;

        const { error: uploadError } = await supabase.storage
          .from(PHOTOS_BUCKET)
          .upload(path, photo.blob, { contentType: photo.blob.type, cacheControl: "31536000", upsert: false });
        if (uploadError) throw new Error("No se ha podido subir el archivo.");

        const result = await createPhoto(albumId, {
          storage_path: path,
          width: photo.width,
          height: photo.height,
          // Texto alternativo provisional: hay que revisarlo después en la ficha de la foto
          alt_es: `Fotografía del álbum «${albumTitle.es}»`,
          alt_en: `Photograph from the album “${albumTitle.en}”`,
          ...photo.exif,
        });
        if (result.error) {
          await supabase.storage.from(PHOTOS_BUCKET).remove([path]); // no dejar archivos huérfanos
          throw new Error(result.error);
        }
        update(index, { status: "done" });
      } catch (error) {
        update(index, { status: "error", message: error instanceof Error ? error.message : "Error desconocido." });
      }
    }

    setBusy(false);
    router.refresh();
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    void upload(Array.from(event.dataTransfer.files));
  }

  const full = remaining === 0;

  return (
    <div className="space-y-4">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          if (!full) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={full ? (event) => event.preventDefault() : onDrop}
        className={`flex flex-col items-center gap-2 border border-dashed p-8 text-center transition-colors ${
          full ? "border-line text-ink-muted" : dragging ? "border-sky bg-sky-soft" : "border-ink-muted hover:border-ink"
        } ${busy || full ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="label-mono">
          {full ? `Límite de ${limit} fotos alcanzado` : busy ? "Subiendo…" : "Arrastra fotos aquí o haz clic para elegirlas"}
        </span>
        <span className="text-sm text-ink-muted">
          JPEG, PNG o WebP · se redimensionan a 2.500 px y se les quita el GPS y el resto de metadatos · quedan {remaining}
        </span>
        <input
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          disabled={busy || full}
          className="sr-only"
          onChange={(event) => {
            void upload(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
      </label>

      {items.length > 0 && (
        <ul aria-live="polite" className="space-y-1 text-sm">
          {items.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex gap-3">
              <span className="label-mono w-20 shrink-0 text-ink-muted">
                {{ pending: "En cola", working: "Subiendo", done: "Hecho", error: "Error" }[item.status]}
              </span>
              <span className="truncate">{item.name}</span>
              {item.message && <span className="text-red-700">{item.message}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
