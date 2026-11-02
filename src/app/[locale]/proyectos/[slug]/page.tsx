import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import ScanReveal from "@/components/motion/ScanReveal";
import Markdown from "@/components/projects/Markdown";
import ProjectSpecs from "@/components/projects/ProjectSpecs";
import PageHeader from "@/components/sections/PageHeader";
import { Link } from "@/i18n/navigation";
import { getPublicProject } from "@/lib/data/public-projects";
import { PROJECTS_BUCKET, publicStorageUrl } from "@/lib/supabase/storage";

type Props = PageProps<"/[locale]/proyectos/[slug]">;

// El slug solo se conoce al pedir la página: se renderiza dentro de Suspense
// (requisito de cacheComponents). El hueco evita que el pie salte cuando llega el contenido.
export default function ProjectPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}

async function ProjectDetail({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  const t = await getTranslations("Projects");
  const tCommon = await getTranslations("Common");
  const project = await getPublicProject(slug, await getLocale());
  if (!project) notFound();

  return (
    <>
      <PageHeader label={t("detailLabel")} title={project.title} intro={project.summary} scale="AB-02" />
      <div className="mx-auto max-w-6xl space-y-10 px-4 pt-8 pb-24 sm:px-8">
        {project.coverPath && (
          <ScanReveal className="aspect-[3/2] border border-line bg-sky-soft/30 md:aspect-[21/9]">
            <Image
              src={publicStorageUrl(PROJECTS_BUCKET, project.coverPath)}
              alt={t("coverAlt", { title: project.title })}
              fill
              sizes="(min-width: 1152px) 1088px, 100vw"
              className="object-cover"
            />
          </ScanReveal>
        )}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 lg:order-1">
            {project.description && <Markdown newTabLabel={tCommon("newTab")}>{project.description}</Markdown>}
          </div>
          <aside className="lg:order-2">
            <ProjectSpecs project={project} role={project.role} />
          </aside>
        </div>
        <Link href="/proyectos" className="label-mono inline-block text-ink-muted transition-colors hover:text-ink">
          ← {t("back")}
        </Link>
      </div>
    </>
  );
}
