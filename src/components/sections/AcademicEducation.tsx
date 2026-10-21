import { getTranslations } from "next-intl/server";
import BlueprintFrame from "@/components/blueprint/BlueprintFrame";
import SpecList from "@/components/blueprint/SpecList";
import TimelineAnimation from "@/components/motion/TimelineAnimation";
import type { Cv } from "@/types/cv";
import SectionHeading from "./SectionHeading";

// REF. 01 — Formación académica: misma línea de tiempo que la experiencia. Los premios
// van como anotación azul, igual que el aprendizaje de NITS.
export default async function AcademicEducation({ cv }: { cv: Cv }) {
  const t = await getTranslations("Education.academic");

  return (
    <section aria-labelledby="academic-title" className="mx-auto max-w-6xl space-y-14 px-4 py-20 sm:px-8 md:py-28">
      <SectionHeading index="01" label={t("label")} title={t("title")} id="academic-title" />

      <TimelineAnimation className="relative space-y-10">
        <span aria-hidden data-timeline-line className="absolute top-0 bottom-0 left-0 w-px origin-top bg-ink" />
        {cv.education.map((item) => (
          <li key={item.id} data-timeline-item className="relative pl-8 md:pl-14">
            <span aria-hidden data-timeline-node className="bp-timeline-node absolute top-10 left-0 size-3 -translate-x-1/2" />
            <div data-timeline-body>
              <BlueprintFrame>
                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] md:items-end md:gap-12">
                  <div className="space-y-3">
                    <p className="label-mono text-sky-ink">
                      {item.start} – {item.end}
                    </p>
                    <h3 className="text-h3 font-medium">{item.title}</h3>
                  </div>
                  <SpecList items={[{ label: t("center"), value: item.center }]} className="text-sm" />
                </div>
                {item.award && (
                  <aside className="mt-8 border-l border-sky pl-5">
                    <p className="label-mono text-sky-ink">{t("award")}</p>
                    <p className="mt-2 text-ink-muted">{item.award}</p>
                  </aside>
                )}
              </BlueprintFrame>
            </div>
          </li>
        ))}
      </TimelineAnimation>
    </section>
  );
}
