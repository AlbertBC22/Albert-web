import type { Metadata } from "next";
import Link from "next/link";
import SectionLabel from "@/components/blueprint/SectionLabel";
import { SubmitButton } from "@/components/admin/buttons";
import ProjectForm from "@/components/admin/ProjectForm";
import { listProjectsAdmin } from "@/lib/data/projects";
import { createProject, moveProject, setProjectPublished } from "./actions";

export const metadata: Metadata = { title: "Proyectos" };

// Lista de proyectos: orden, estado y alta de proyectos nuevos.
export default async function ProjectsPage() {
  const projects = await listProjectsAdmin();

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <SectionLabel index="02">Proyectos</SectionLabel>
        <h1 className="text-h2 font-medium">Proyectos</h1>
      </div>

      {projects.length === 0 ? (
        <p className="text-ink-muted">Todavía no hay proyectos.</p>
      ) : (
        <ol className="divide-y divide-line border-y border-line">
          {projects.map((project, index) => (
            <li key={project.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
              <span className="label-mono w-8 text-sky-ink">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/proyectos/${project.id}`} className="font-medium underline-offset-4 hover:underline">
                  {project.title_es}
                </Link>
                <p className="label-mono text-ink-muted normal-case">
                  /{project.slug} · {project.status}
                </p>
              </div>
              <span className={`label-mono ${project.is_published ? "text-sky-ink" : "text-ink-muted"}`}>
                {project.is_published ? "Publicado" : "Borrador"}
              </span>
              <div className="flex items-center">
                <form action={setProjectPublished.bind(null, project.id, !project.is_published)}>
                  <SubmitButton>{project.is_published ? "Despublicar" : "Publicar"}</SubmitButton>
                </form>
                <form action={moveProject.bind(null, project.id, "up")}>
                  <SubmitButton className={index === 0 ? "invisible" : ""}>↑</SubmitButton>
                </form>
                <form action={moveProject.bind(null, project.id, "down")}>
                  <SubmitButton className={index === projects.length - 1 ? "invisible" : ""}>↓</SubmitButton>
                </form>
              </div>
            </li>
          ))}
        </ol>
      )}

      <section aria-labelledby="new-project" className="space-y-6 border border-line bg-paper/70 p-6">
        <h2 id="new-project" className="text-h3 font-medium">
          Nuevo proyecto
        </h2>
        <p className="text-ink-muted">La portada se añade después de crearlo.</p>
        <ProjectForm action={createProject} submitLabel="Crear proyecto" />
      </section>
    </div>
  );
}
