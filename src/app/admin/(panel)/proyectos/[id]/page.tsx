import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionLabel from "@/components/blueprint/SectionLabel";
import { ConfirmSubmit } from "@/components/admin/buttons";
import ProjectCover from "@/components/admin/ProjectCover";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectAdmin } from "@/lib/data/projects";
import { deleteProject, updateProject } from "../actions";

export const metadata: Metadata = { title: "Editar proyecto" };

// Edición de un proyecto: portada, datos (ES/EN) y borrado.
export default async function ProjectEditPage({ params }: PageProps<"/admin/proyectos/[id]">) {
  const { id } = await params;
  const project = await getProjectAdmin(id);
  if (!project) notFound();

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <Link href="/admin/proyectos" className="label-mono text-ink-muted hover:text-ink">
          ← Proyectos
        </Link>
        <SectionLabel index="02">{project.is_published ? "Publicado" : "Borrador"}</SectionLabel>
        <h1 className="text-h2 font-medium">{project.title_es}</h1>
      </div>

      <section aria-labelledby="project-cover" className="space-y-6">
        <h2 id="project-cover" className="text-h3 font-medium">
          Portada
        </h2>
        <ProjectCover projectId={project.id} projectTitle={project.title_es} coverPath={project.cover_path} />
      </section>

      <section aria-labelledby="project-data" className="space-y-6">
        <h2 id="project-data" className="text-h3 font-medium">
          Datos del proyecto
        </h2>
        <ProjectForm action={updateProject.bind(null, project.id)} project={project} submitLabel="Guardar cambios" />
      </section>

      <section aria-labelledby="danger" className="space-y-3 border-t border-line pt-6">
        <h2 id="danger" className="label-mono text-ink-muted">
          Zona de peligro
        </h2>
        <form action={deleteProject.bind(null, project.id)}>
          <ConfirmSubmit message={`¿Borrar el proyecto «${project.title_es}» y su portada? No se puede deshacer.`}>
            Borrar proyecto
          </ConfirmSubmit>
        </form>
      </section>
    </div>
  );
}
