import { getLocale, getTranslations } from "next-intl/server";
import BlueprintFrame from "@/components/blueprint/BlueprintFrame";
import ProjectCard from "@/components/projects/ProjectCard";
import PageHeader from "@/components/sections/PageHeader";
import { listPublicProjects } from "@/lib/data/public-projects";

// Plano AB-02: lista de proyectos publicados.
export default async function ProjectsPage() {
  const t = await getTranslations("Projects");
  const projects = await listPublicProjects(await getLocale());

  return (
    <>
      <PageHeader label={t("label")} title={t("title")} intro={t("intro")} scale="AB-02" />
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-24 sm:px-8">
        {projects.length === 0 ? (
          <BlueprintFrame className="space-y-3 text-center">
            <h2 className="text-h3 font-medium">{t("emptyTitle")}</h2>
            <p className="text-ink-muted">{t("emptyText")}</p>
          </BlueprintFrame>
        ) : (
          <ol className="space-y-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
