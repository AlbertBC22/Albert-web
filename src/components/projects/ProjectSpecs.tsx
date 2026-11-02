import { getTranslations } from "next-intl/server";
import ExternalLink from "@/components/blueprint/ExternalLink";
import SpecList, { type SpecItem } from "@/components/blueprint/SpecList";
import type { PublicProject } from "@/lib/data/public-projects";

type Props = {
  project: PublicProject;
  role?: string | null;
};

// "2026 — actualidad", "2024 — 2025" o "2024". Sin fechas, null.
function formatPeriod(project: PublicProject, present: string) {
  const start = project.startedOn?.slice(0, 4);
  const end = project.endedOn?.slice(0, 4) ?? (project.isActive ? present : undefined);
  if (start && end && start !== end) return `${start} — ${end}`;
  return start ?? end ?? null;
}

// Ficha de un proyecto: rol, periodo, estado, stack y enlaces.
export default async function ProjectSpecs({ project, role }: Props) {
  const t = await getTranslations("Projects");
  const tCommon = await getTranslations("Common");
  const period = formatPeriod(project, t("present"));

  const items: SpecItem[] = [
    ...(role ? [{ label: t("role"), value: role }] : []),
    ...(period ? [{ label: t("period"), value: period }] : []),
    { label: t("status"), value: project.isActive ? t("statusActive") : t("statusClosed") },
  ];

  return (
    <div className="space-y-4">
      <SpecList items={items} />
      {project.tech.length > 0 && (
        <ul aria-label={t("stack")} className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <li key={tech} className="label-mono border border-line bg-paper px-2 py-1 normal-case">
              {tech}
            </li>
          ))}
        </ul>
      )}
      {(project.repoUrl || project.liveUrl) && (
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          {project.repoUrl && (
            <ExternalLink href={project.repoUrl} newTabLabel={tCommon("newTab")}>
              {t("repo")}
            </ExternalLink>
          )}
          {project.liveUrl && (
            <ExternalLink href={project.liveUrl} newTabLabel={tCommon("newTab")}>
              {t("live")}
            </ExternalLink>
          )}
        </p>
      )}
    </div>
  );
}
