import Image from "next/image";
import { getTranslations } from "next-intl/server";
import BlueprintFrame from "@/components/blueprint/BlueprintFrame";
import ScanReveal from "@/components/motion/ScanReveal";
import StaggerReveal from "@/components/motion/StaggerReveal";
import { Link } from "@/i18n/navigation";
import type { PublicProject } from "@/lib/data/public-projects";
import { PROJECTS_BUCKET, publicStorageUrl } from "@/lib/supabase/storage";
import ProjectSpecs from "./ProjectSpecs";

type Props = {
  project: PublicProject;
  index: number;
};

// Ficha de un proyecto en la lista, a todo el ancho: portada a un lado (si la tiene) y datos al otro.
export default async function ProjectCard({ project, index }: Props) {
  const t = await getTranslations("Projects");
  const href = { pathname: "/proyectos/[slug]", params: { slug: project.slug } } as const;

  return (
    <li>
      <StaggerReveal variant="wipe">
        <div data-card>
          <BlueprintFrame className={`grid gap-8 ${project.coverPath ? "md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" : ""}`}>
            {project.coverPath && (
              // Enlace repetido con el del título: se oculta al teclado y a los lectores de pantalla
              <Link href={href} tabIndex={-1} aria-hidden className="block">
                <ScanReveal className="aspect-[3/2] border border-line bg-sky-soft/30">
                  <Image
                    src={publicStorageUrl(PROJECTS_BUCKET, project.coverPath)}
                    alt={t("coverAlt", { title: project.title })}
                    fill
                    sizes="(min-width: 1152px) 400px, (min-width: 768px) 35vw, 100vw"
                    className="object-cover"
                  />
                </ScanReveal>
              </Link>
            )}
            <div className="space-y-5">
              <h2 className="flex items-baseline gap-3 text-h3 font-medium">
                <span className="label-mono text-sky-ink">[{String(index + 1).padStart(2, "0")}]</span>
                <Link href={href} className="underline-offset-4 hover:underline">
                  {project.title}
                </Link>
              </h2>
              <p className="max-w-2xl text-ink-muted">{project.summary}</p>
              <ProjectSpecs project={project} />
            </div>
          </BlueprintFrame>
        </div>
      </StaggerReveal>
    </li>
  );
}
