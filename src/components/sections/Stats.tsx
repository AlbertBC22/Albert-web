import { getTranslations } from "next-intl/server";
import CountUp from "@/components/motion/CountUp";
import type { Cv, Stat } from "@/types/cv";
import SectionHeading from "./SectionHeading";

// REF. 03 — Cifras: datos grandes con contador y el degradado de acento.
export default async function Stats({ cv }: { cv: Cv }) {
  const t = await getTranslations("Home.stats");

  return (
    <section aria-labelledby="stats-title" className="mx-auto max-w-6xl space-y-14 px-4 py-24 sm:px-8 md:py-32">
      <SectionHeading index="03" label={t("label")} title={t("title")} id="stats-title" />
      <ul className="grid border-t border-l border-line sm:grid-cols-2">
        {cv.stats.map((stat, index) => (
          <li key={stat.label} className="relative space-y-4 border-r border-b border-line p-6 md:p-10">
            <p className="label-mono text-sky-ink">[03.{index + 1}]</p>
            <StatValue stat={stat} />
            <p className="label-mono text-ink-muted">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatValue({ stat }: { stat: Stat }) {
  const big = "text-[clamp(3rem,7vw,5.5rem)] leading-none font-light tracking-[-0.03em]";
  // Degradado de acento tras la cifra (solo para elementos destacados)
  const accent = { backgroundImage: "var(--gradient-accent)" };

  if (stat.kind === "number") {
    return (
      <p className={big}>
        <span className="-mx-2 px-2" style={accent}>
          <CountUp value={stat.value} prefix={stat.prefix} />
        </span>
      </p>
    );
  }

  if (stat.kind === "range") {
    return (
      <p className={big}>
        <span className="-mx-2 px-2" style={accent}>
          <CountUp value={stat.from} />–<CountUp value={stat.to} />
        </span>
      </p>
    );
  }

  // Embudo: cada paso cuenta después del anterior
  return (
    <ol className="flex flex-wrap items-end gap-x-4 gap-y-3">
      {stat.steps.map((step, index) => (
        <li key={step.label} className="flex items-end gap-4">
          {index > 0 && (
            <span aria-hidden className="pb-6 text-h2 font-light text-ink-muted">
              →
            </span>
          )}
          <span className="flex flex-col">
            <span className={big}>
              <span className="-mx-2 px-2" style={accent}>
                <CountUp value={step.value} delay={index * 0.5} />
              </span>
            </span>
            <span className="label-mono mt-2 text-ink-muted">{step.label}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
