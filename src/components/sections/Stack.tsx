import { getTranslations } from "next-intl/server";
import StaggerReveal from "@/components/motion/StaggerReveal";
import type { Cv } from "@/types/cv";
import SectionHeading from "./SectionHeading";

// REF. 04 — Stack técnico como leyenda de plano: símbolo, categoría, línea guía y elementos.
export default async function Stack({ cv }: { cv: Cv }) {
  const t = await getTranslations("Home.stack");

  return (
    <section aria-labelledby="stack-title" className="mx-auto max-w-6xl space-y-14 px-4 py-24 sm:px-8 md:py-32">
      <SectionHeading index="04" label={t("label")} title={t("title")} id="stack-title" />
      <StaggerReveal variant="legend">
        <dl className="border-y border-line">
          {cv.stack.map((group, index) => (
            <div
              key={group.category}
              data-row
              className="grid gap-x-6 gap-y-2 border-b border-line py-5 last:border-b-0 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:items-baseline"
            >
              <dt className="flex items-center gap-3">
                {/* Símbolo de leyenda con la letra de la categoría */}
                <span aria-hidden className="label-mono grid size-6 shrink-0 place-items-center border border-ink">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="label-mono shrink-0">{group.category}</span>
                <span aria-hidden data-leader className="hidden h-px flex-1 border-t border-dashed border-ink-muted md:block" />
              </dt>
              <dd className="flex flex-wrap gap-x-2 gap-y-1">
                {group.items.map((item, i) => (
                  <span key={item}>
                    {item}
                    {i < group.items.length - 1 && <span aria-hidden className="ml-2 text-line">/</span>}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </StaggerReveal>
    </section>
  );
}
