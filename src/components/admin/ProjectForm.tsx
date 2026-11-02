"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { Button } from "@/components/blueprint/Button";
import type { FormState } from "@/lib/admin/forms";
import type { Tables } from "@/types/database";
import { Checkbox, FormMessage, SelectField, TextArea, TextField } from "./fields";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  project?: Tables<"projects">;
  submitLabel: string;
};

const HTTPS_PATTERN = "https://.+";

// Formulario de proyecto (crear o editar): campos en español e inglés, datos y publicación.
export default function ProjectForm({ action, project, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  // Con <form action={…}> React vacía el formulario al terminar, también si hay un error.
  // Aquí se envía a mano para no perder una descripción larga por una URL repetida.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <TextField label="Título (ES)" name="title_es" defaultValue={project?.title_es} required maxLength={120} />
        <TextField label="Título (EN)" name="title_en" defaultValue={project?.title_en} required maxLength={120} />
        <TextArea label="Resumen (ES)" name="summary_es" defaultValue={project?.summary_es} required maxLength={300} />
        <TextArea label="Resumen (EN)" name="summary_en" defaultValue={project?.summary_en} required maxLength={300} />
        <TextArea label="Descripción (ES)" name="description_es" defaultValue={project?.description_es} maxLength={20000} rows={10} hint="Admite markdown." />
        <TextArea label="Descripción (EN)" name="description_en" defaultValue={project?.description_en} maxLength={20000} rows={10} hint="Admite markdown." />
        <TextField label="Rol (ES)" name="role_es" defaultValue={project?.role_es} maxLength={120} />
        <TextField label="Rol (EN)" name="role_en" defaultValue={project?.role_en} maxLength={120} />
      </div>

      <TextField
        label="Tecnologías"
        name="tech"
        defaultValue={project?.tech.join(", ")}
        hint="Separadas por comas: Next.js, TypeScript, Supabase"
      />

      <div className="grid gap-6 md:grid-cols-3">
        <TextField label="Inicio" name="started_on" type="date" defaultValue={project?.started_on} />
        <TextField label="Fin" name="ended_on" type="date" defaultValue={project?.ended_on} />
        <SelectField
          label="Estado"
          name="status"
          defaultValue={project?.status}
          options={[
            { value: "activo", label: "Activo" },
            { value: "cerrado", label: "Cerrado" },
          ]}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TextField label="Repositorio" name="repo_url" type="url" pattern={HTTPS_PATTERN} defaultValue={project?.repo_url} maxLength={500} hint="https://…" />
        <TextField label="Web" name="live_url" type="url" pattern={HTTPS_PATTERN} defaultValue={project?.live_url} maxLength={500} hint="https://…" />
      </div>

      <TextField
        label="URL (slug)"
        name="slug"
        defaultValue={project?.slug}
        maxLength={80}
        hint={project ? "Minúsculas, números y guiones." : "Si lo dejas vacío, se genera a partir del título en español."}
      />
      <Checkbox label="Publicado (visible en la web)" name="is_published" defaultChecked={project?.is_published} />

      <FormMessage error={state.error} ok={state.ok} />
      <Button type="submit" variant="accent" disabled={pending} aria-busy={pending}>
        {pending ? "Guardando…" : submitLabel}
      </Button>
    </form>
  );
}
