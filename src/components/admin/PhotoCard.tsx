"use client";

import Image from "next/image";
import { useActionState } from "react";
import { deletePhoto, movePhoto, setAlbumCover, updatePhoto } from "@/app/admin/(panel)/albumes/actions";
import type { FormState } from "@/lib/admin/forms";
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

// Ficha de una foto en el panel: miniatura, títulos y textos alternativos, ficha técnica,
// portada, orden y borrado.
export default function PhotoCard({ photo, isCover, isFirst, isLast }: Props) {
  const [state, formAction] = useActionState<FormState, FormData>(updatePhoto.bind(null, photo.id), { error: null });
  const altIsProvisional = photo.alt_es.startsWith("Fotografía del álbum «");
  // El formato sueco es AAAA-MM-DD, el que espera un campo de fecha
  const takenOn = photo.taken_at && new Date(photo.taken_at).toLocaleDateString("sv-SE", { timeZone: "Europe/Madrid" });

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
          <fieldset className="space-y-3 border-t border-line pt-3">
            <legend className="label-mono pr-2 text-ink-muted">Ficha técnica</legend>
            <p className="text-sm text-ink-muted">
              Se rellena con el EXIF. En un escaneo de carrete, el EXIF indica el escáner: pon aquí tu cámara. Vacío = no se muestra.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <TextField label="Marca" name="camera_make" defaultValue={photo.camera_make} maxLength={80} />
              <TextField label="Modelo" name="camera_model" defaultValue={photo.camera_model} maxLength={80} />
              <TextField label="Objetivo" name="lens" defaultValue={photo.lens} maxLength={120} />
              <TextField label="Fecha" name="taken_at" type="date" defaultValue={takenOn} />
              <TextField label="Focal (mm)" name="focal_length_mm" type="number" min={0.1} step={0.1} defaultValue={photo.focal_length_mm?.toString()} />
              <TextField label="Apertura (f/)" name="aperture" type="number" min={0.1} step={0.1} defaultValue={photo.aperture?.toString()} />
              <TextField label="Velocidad" name="shutter_speed" defaultValue={photo.shutter_speed} maxLength={20} hint="P. ej. 1/250" />
              <TextField label="ISO" name="iso" type="number" min={1} step={1} defaultValue={photo.iso?.toString()} />
            </div>
          </fieldset>
          <FormMessage error={state.error} ok={state.ok} />
          <SubmitButton>Guardar</SubmitButton>
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
