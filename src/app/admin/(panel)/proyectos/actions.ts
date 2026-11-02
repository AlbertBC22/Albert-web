"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { firstIssue, slugify, SLUG, text, textOrNull, type FormState } from "@/lib/admin/forms";
import { requireAdmin } from "@/lib/data/admin";
import { PROJECTS_TAG } from "@/lib/data/public-projects";
import { reorder } from "@/lib/data/reorder";
import { createClient } from "@/lib/supabase/server";
import { PROJECTS_BUCKET } from "@/lib/supabase/storage";

// Escrituras del panel para proyectos. Cada acción comprueba que el usuario es admin
// (además de la RLS de la base de datos) y valida los datos con zod.

function dbErrorMessage(error: { code?: string }) {
  if (error.code === "23505") return "Ya existe un proyecto con esa URL (slug). Elige otra.";
  return "No se ha podido guardar. Revisa los datos e inténtalo de nuevo.";
}

function refresh() {
  revalidatePath("/admin", "layout");
  updateTag(PROJECTS_TAG); // la lista pública se actualiza al momento
}

const HttpsUrl = z.string().max(500, "El enlace es demasiado largo.").regex(/^https:\/\/\S+$/, "Los enlaces deben empezar por https://.");

const ProjectSchema = z
  .object({
    slug: z.union([z.literal(""), z.string().max(80).regex(SLUG, "La URL solo admite minúsculas, números y guiones.")]),
    title_es: z.string().min(1, "El título en español es obligatorio.").max(120),
    title_en: z.string().min(1, "El título en inglés es obligatorio.").max(120),
    summary_es: z.string().min(1, "El resumen en español es obligatorio.").max(300, "El resumen en español es demasiado largo."),
    summary_en: z.string().min(1, "El resumen en inglés es obligatorio.").max(300, "El resumen en inglés es demasiado largo."),
    description_es: z.string().max(20000, "La descripción en español es demasiado larga."),
    description_en: z.string().max(20000, "La descripción en inglés es demasiado larga."),
    role_es: z.string().max(120, "El rol en español es demasiado largo.").nullable(),
    role_en: z.string().max(120, "El rol en inglés es demasiado largo.").nullable(),
    tech: z.array(z.string().max(40, "Cada tecnología admite 40 caracteres como máximo.")).max(30, "Son demasiadas tecnologías."),
    started_on: z.iso.date("La fecha de inicio no es válida.").nullable(),
    ended_on: z.iso.date("La fecha de fin no es válida.").nullable(),
    status: z.enum(["activo", "cerrado"], "El estado no es válido."),
    repo_url: HttpsUrl.nullable(),
    live_url: HttpsUrl.nullable(),
    is_published: z.boolean(),
  })
  .refine((project) => !project.started_on || !project.ended_on || project.ended_on >= project.started_on, {
    message: "La fecha de fin no puede ser anterior a la de inicio.",
  });

function parseProject(formData: FormData) {
  const parsed = ProjectSchema.safeParse({
    slug: text(formData, "slug"),
    title_es: text(formData, "title_es"),
    title_en: text(formData, "title_en"),
    summary_es: text(formData, "summary_es"),
    summary_en: text(formData, "summary_en"),
    description_es: text(formData, "description_es"),
    description_en: text(formData, "description_en"),
    role_es: textOrNull(formData, "role_es"),
    role_en: textOrNull(formData, "role_en"),
    // "Next.js, Supabase" → ["Next.js", "Supabase"], sin vacíos ni repetidos
    tech: [...new Set(text(formData, "tech").split(",").map((item) => item.trim()).filter(Boolean))],
    started_on: textOrNull(formData, "started_on"),
    ended_on: textOrNull(formData, "ended_on"),
    status: text(formData, "status"),
    repo_url: textOrNull(formData, "repo_url"),
    live_url: textOrNull(formData, "live_url"),
    is_published: formData.get("is_published") === "on",
  });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) } as const;

  const values = parsed.data;
  return { ok: true, values: { ...values, slug: values.slug || slugify(values.title_es) } } as const;
}

export async function createProject(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseProject(formData);
  if (!parsed.ok) return { error: parsed.error };
  if (!parsed.values.slug) return { error: "No se ha podido generar la URL: escribe un slug." };

  const supabase = await createClient();
  const { data: last } = await supabase
    .from("projects")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...parsed.values, position: (last?.position ?? -1) + 1 })
    .select("id")
    .single();
  if (error) return { error: dbErrorMessage(error) };

  refresh();
  redirect(`/admin/proyectos/${data.id}`);
}

export async function updateProject(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseProject(formData);
  if (!parsed.ok) return { error: parsed.error };
  if (!parsed.values.slug) return { error: "No se ha podido generar la URL: escribe un slug." };

  const supabase = await createClient();
  const { error } = await supabase.from("projects").update(parsed.values).eq("id", id);
  if (error) return { error: dbErrorMessage(error) };

  refresh();
  return { error: null, ok: true };
}

export async function setProjectPublished(id: string, published: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("projects").update({ is_published: published }).eq("id", id);
  refresh();
}

export async function moveProject(id: string, direction: "up" | "down") {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("id").order("position").order("created_at");
  await reorder(supabase, "projects", (data ?? []).map((row) => row.id), id, direction);
  refresh();
}

// Borra el proyecto y su portada del Storage.
export async function deleteProject(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("cover_path").eq("id", id).maybeSingle();
  await supabase.from("projects").delete().eq("id", id);
  if (project?.cover_path) await supabase.storage.from(PROJECTS_BUCKET).remove([project.cover_path]);
  refresh();
  redirect("/admin/proyectos");
}

// Guarda la portada ya subida al Storage desde el navegador (ver ProjectCover) y borra la anterior.
export async function setProjectCover(id: string, path: string): Promise<FormState> {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(webp|jpg)$/.test(path) || !path.startsWith(`${id}/`)) {
    return { error: "La ruta no corresponde al proyecto." };
  }

  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("cover_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from("projects").update({ cover_path: path }).eq("id", id);
  if (error) return { error: dbErrorMessage(error) };
  if (project?.cover_path) await supabase.storage.from(PROJECTS_BUCKET).remove([project.cover_path]);

  refresh();
  return { error: null, ok: true };
}

export async function removeProjectCover(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("cover_path").eq("id", id).maybeSingle();
  if (!project?.cover_path) return;
  await supabase.from("projects").update({ cover_path: null }).eq("id", id);
  await supabase.storage.from(PROJECTS_BUCKET).remove([project.cover_path]);
  refresh();
}
