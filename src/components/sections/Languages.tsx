import { getTranslations } from "next-intl/server";
import StaggerReveal from "@/components/motion/StaggerReveal";
import type { Cv } from "@/types/cv";
import SectionHeading from "./SectionHeading";

const SEGMENTS = 10;

// REF. 05 — Idiomas: cada nivel como una escala gráfica de plano (segmentos rellenos).
export default async function Languages({ cv }: { cv: Cv }) {
  const t = await getTranslations("Home.languages");

  return (
    <section aria-labelledby="languages-title" className="mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-8 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:py-32">
      <SectionHeading index="05" label={t("label")} title={t("title")} id="languages-title" />
      <StaggerReveal variant="scale">
        <ul className="space-y-8">
          {cv.languages.map((language) => {
            const filled = Math.round(language.scale * SEGMENTS);
            return (
              <li key={language.name} className="space-y-3">
                <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="text-h3 font-medium">{language.name}</span>
                  <span className="label-mono text-ink-muted">
                    {language.level}
                    {language.detail && ` · ${language.detail}`}
                  </span>
                </p>
                {/* Escala gráfica: segmentos alternos como en las escalas de los planos */}
                <div aria-hidden className="flex h-2 border border-ink">
                  {Array.from({ length: SEGMENTS }, (_, i) => (
                    <span
                      key={i}
                      data-segment
                      data-filled={i < filled ? "" : undefined}
                      className={`flex-1 border-r border-ink last:border-r-0 ${i < filled ? (i % 2 ? "bg-sky" : "bg-ink") : ""}`}
                    />
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </StaggerReveal>
    </section>
  );
}
