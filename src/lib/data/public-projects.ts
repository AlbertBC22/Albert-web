import type { Locale } from "next-intl";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

// Lecturas públicas de proyectos. Van en caché; las acciones del panel la invalidan con esta
// etiqueta. La vida de una hora cubre los cambios hechos desde otro despliegue (p. ej. en local).
export const PROJECTS_TAG = "projects";

export type PublicProject = {
  slug: string;
  title: string;
  summary: string;
  tech: string[];
  startedOn: string | null;
  endedOn: string | null;
  isActive: boolean;
  repoUrl: string | null;
  liveUrl: string | null;
  coverPath: string | null;
};

export type PublicProjectDetail = PublicProject & {
  description: string;
  role: string | null;
};

const CARD_COLUMNS =
  "slug, title_es, title_en, summary_es, summary_en, tech, started_on, ended_on, status, repo_url, live_url, cover_path";

type CardRow = {
  slug: string;
  title_es: string;
  title_en: string;
  summary_es: string;
  summary_en: string;
  tech: string[];
  started_on: string | null;
  ended_on: string | null;
  status: string;
  repo_url: string | null;
  live_url: string | null;
  cover_path: string | null;
};

function toProject(row: CardRow, locale: Locale): PublicProject {
  const en = locale === "en";
  return {
    slug: row.slug,
    title: en ? row.title_en : row.title_es,
    summary: en ? row.summary_en : row.summary_es,
    tech: row.tech,
    startedOn: row.started_on,
    endedOn: row.ended_on,
    isActive: row.status === "activo",
    repoUrl: row.repo_url,
    liveUrl: row.live_url,
    coverPath: row.cover_path,
  };
}

// Lista: proyectos publicados (la RLS oculta el resto a los visitantes), en su orden.
export async function listPublicProjects(locale: Locale): Promise<PublicProject[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(PROJECTS_TAG);

  const { data, error } = await createPublicClient()
    .from("projects")
    .select(CARD_COLUMNS)
    .order("position")
    .order("created_at");
  if (error) throw error;
  return data.map((row) => toProject(row, locale));
}

// Un proyecto publicado. null si no existe o no está publicado.
export async function getPublicProject(slug: string, locale: Locale): Promise<PublicProjectDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(PROJECTS_TAG);

  const { data, error } = await createPublicClient().from("projects").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const en = locale === "en";
  return {
    ...toProject(data, locale),
    description: en ? data.description_en : data.description_es,
    role: en ? data.role_en : data.role_es,
  };
}
