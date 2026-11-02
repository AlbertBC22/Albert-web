"use client";

import { useActionState } from "react";
import { Button } from "@/components/blueprint/Button";
import type { FormState } from "@/lib/admin/forms";
import type { Tables } from "@/types/database";
import { Checkbox, FormMessage, TextArea, TextField } from "./fields";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  album?: Tables<"albums">;
  submitLabel: string;
};

// Formulario de álbum (crear o editar): campos en español e inglés, URL y publicación.
export default function AlbumForm({ action, album, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <TextField label="Título (ES)" name="title_es" defaultValue={album?.title_es} required maxLength={120} />
        <TextField label="Título (EN)" name="title_en" defaultValue={album?.title_en} required maxLength={120} />
        <TextArea label="Descripción (ES)" name="description_es" defaultValue={album?.description_es} maxLength={2000} />
        <TextArea label="Descripción (EN)" name="description_en" defaultValue={album?.description_en} maxLength={2000} />
      </div>
      <TextField
        label="URL (slug)"
        name="slug"
        defaultValue={album?.slug}
        maxLength={80}
        hint={album ? "Minúsculas, números y guiones." : "Si lo dejas vacío, se genera a partir del título en español."}
      />
      <Checkbox label="Publicado (visible en la web)" name="is_published" defaultChecked={album?.is_published} />

      <FormMessage error={state.error} ok={state.ok} />
      <Button type="submit" variant="accent" disabled={pending} aria-busy={pending}>
        {pending ? "Guardando…" : submitLabel}
      </Button>
    </form>
  );
}
