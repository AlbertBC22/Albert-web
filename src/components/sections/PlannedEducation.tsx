import { getTranslations } from "next-intl/server";
import type { Cv } from "@/types/cv";
import SectionHeading from "./SectionHeading";

// REF. 03 — Formación prevista: lámina "en obra" (línea discontinua). Solo se monta si
// SHOW_PLANNED_EDUCATION (src/content/flags.ts) está activo.
export default async function PlannedEducation({ cv }: { cv: Cv }) {
  const t = await getTranslations("Education.planned");

  return (
    <section aria-labelledby="planned-title" className="mx-auto max-w-6xl space-y-10 px-4 py-20 sm:px-8 md:py-28">
      <SectionHeading index="03" label={t("label")} title={t("title")} id="planned-title" />
      <ul className="space-y-4">
        {cv.plannedEducation.map((item) => (
          <li key={item.title} className="flex flex-wrap items-baseline justify-between gap-4 border border-dashed border-ink-muted p-6">
            <span className="text-h3 font-medium">{item.title}</span>
            <span className="label-mono text-sky-ink">{item.year}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
