"use client";

import Image from "next/image";
import { useActionState } from "react";
import {
  deletePhoto,
  movePhoto,
  setAlbumCover,
  updatePhoto,
  type FormState,
} from "@/app/admin/(panel)/albumes/actions";
import { PHOTOS_BUCKET, publicStorageUrl } from "@/lib/supabase/storage";
import type { Tables } from "@/types/database";
import { ConfirmSubmit, SubmitButton } from "./buttons";
import { FormMessage, TextField } from "./fields";

type Props = {
  photo: Tables<"photos">;
  isCover: boolean;
  isFirst: boolean;
  isLast: boolean;
};

// Ficha de una foto en el panel: miniatura, datos técnicos, títulos y textos alternativos,
// portada, orden y borrado.
export default function PhotoCard({ photo, isCover, isFirst, isLast }: Props) {
  const [state, formAction] = useActionState<FormState, FormData>(updatePhoto.bind(null, photo.id), { error: null });
  const altIsProvisional = photo.alt_es.startsWith("Fotografía del álbum «");

  const exif = [
    [photo.camera_make, photo.camera_model].filter(Boolean).join(" "),
    photo.lens,
    photo.focal_length_mm && `${photo.focal_length_mm} mm`,
    photo.aperture && `f/${photo.aperture}`,
    photo.shutter_speed,
    photo.iso && `ISO ${photo.iso}`,
  ].filter(Boolean);

  return (
    <li className="grid gap-5 border border-line bg-paper p-4 md:grid-cols-[12rem_minmax(0,1fr)]">
      <div className="space-y-2">
        <Image
          src={publicStorageUrl(PHOTOS_BUCKET, photo.storage_path)}
          alt={photo.alt_es}
          width={photo.width}
          height={photo.height}
          sizes="12rem"
          unoptimized // miniatura del panel: no gasta la optimización de imágenes de Vercel
          className="h-auto w-full border border-line"
        />
        <p className="label-mono text-ink-muted">
          {photo.width} × {photo.height} px
        </p>
        {exif.length > 0 && <p className="text-xs text-ink-muted">{exif.join(" · ")}</p>}
        {isCover && <p className="label-mono text-sky-ink">Portada</p>}
      </div>

      <div className="space-y-4">
        <form action={formAction} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Título (ES)" name="title_es" defaultValue={photo.title_es} maxLength={120} />
            <TextField label="Título (EN)" name="title_en" defaultValue={photo.title_en} maxLength={120} />
            <TextField label="Texto alternativo (ES)" name="alt_es" defaultValue={photo.alt_es} required maxLength={300} />
            <TextField label="Texto alternativo (EN)" name="alt_en" defaultValue={photo.alt_en} required maxLength={300} />
          </div>
          {altIsProvisional && (
            <p className="text-sm text-sky-ink">Texto alternativo provisional: describe qué se ve en la foto.</p>
          )}
          <FormMessage error={state.error} ok={state.ok} />
          <SubmitButton>Guardar textos</SubmitButton>
        </form>

        <div className="flex flex-wrap items-center gap-x-2 border-t border-line pt-3">
          {!isCover && (
            <form action={setAlbumCover.bind(null, photo.album_id, photo.id)}>
              <SubmitButton>Usar de portada</SubmitButton>
            </form>
          )}
          <form action={movePhoto.bind(null, photo.id, "up")}>
            <SubmitButton className={isFirst ? "invisible" : ""}>↑ Subir</SubmitButton>
          </form>
          <form action={movePhoto.bind(null, photo.id, "down")}>
            <SubmitButton className={isLast ? "invisible" : ""}>↓ Bajar</SubmitButton>
          </form>
          <form action={deletePhoto.bind(null, photo.id)} className="ml-auto">
            <ConfirmSubmit message="¿Borrar esta foto? Se elimina también el archivo. No se puede deshacer.">
              Borrar
            </ConfirmSubmit>
          </form>
        </div>
      </div>
    </li>
  );
}
