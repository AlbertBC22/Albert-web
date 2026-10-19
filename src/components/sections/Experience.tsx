import { getFormatter, getTranslations } from "next-intl/server";
import BlueprintFrame from "@/components/blueprint/BlueprintFrame";
import ExternalLink from "@/components/blueprint/ExternalLink";
import SpecList, { type SpecItem } from "@/components/blueprint/SpecList";
import TimelineAnimation from "@/components/motion/TimelineAnimation";
import type { Cv, YearMonth } from "@/types/cv";
import SectionHeading from "./SectionHeading";

// REF. 02 — Experiencia: línea de tiempo que se dibuja con el scroll; cada puesto es una
// lámina con su periodo, ficha (empresa, proyecto, lugar, modalidad), logros y, si la hay,
// una anotación.
export default async function Experience({ cv }: { cv: Cv }) {
  const t = await getTranslations("Home.experience");
  const tCommon = await getTranslations("Common");
  const format = await getFormatter();

  // "sept 2024" / "Sep 2024". Día 15 para que la zona horaria no cambie de mes.
  const formatMonth = (value: YearMonth) => {
    const [year, month] = value.split("-").map(Number);
    return format.dateTime(new Date(Date.UTC(year, month - 1, 15)), { month: "short", year: "numeric" });
  };

  return (
    <section aria-labelledby="experience-title" className="mx-auto max-w-6xl space-y-14 px-4 py-24 sm:px-8 md:py-32">
      <SectionHeading index="02" label={t("label")} title={t("title")} id="experience-title" />

      <TimelineAnimation className="relative space-y-10 md:space-y-14">
        <span aria-hidden data-timeline-line className="absolute top-0 bottom-0 left-0 w-px origin-top bg-ink" />

        {cv.experience.map((job) => {
          const period = `${formatMonth(job.start)} – ${job.end ? formatMonth(job.end) : t("present")}`;
          const specs: SpecItem[] = [
            { label: t("company"), value: job.company },
            ...(job.project ? [{ label: t("project"), value: job.project }] : []),
            ...(job.location ? [{ label: t("location"), value: job.location }] : []),
            ...(job.mode ? [{ label: t("mode"), value: job.mode }] : []),
          ];

          return (
            <li key={job.id} data-timeline-item className="relative pl-8 md:pl-14">
              <span aria-hidden data-timeline-node className="bp-timeline-node absolute top-10 left-0 size-3 -translate-x-1/2" />
              <div data-timeline-body>
                <BlueprintFrame>
                  <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-12">
                    <div className="space-y-4">
                      <p className="label-mono text-sky-ink">{period}</p>
                      <h3 className="text-h3 font-medium">{job.role}</h3>
                      <SpecList items={specs} className="text-sm" />
                    </div>
                    <div className="space-y-6">
                      <ul className="space-y-3">
                        {job.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-3">
                            <span aria-hidden className="mt-[0.8em] h-px w-3 shrink-0 bg-ink-muted" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      {job.links && job.links.length > 0 && (
                        <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                          <span className="label-mono text-ink-muted">{t("links")}</span>
                          {job.links.map((link) => (
                            <ExternalLink key={link.href} href={link.href} newTabLabel={tCommon("newTab")}>
                              {link.label}
                            </ExternalLink>
                          ))}
                        </p>
                      )}
                      {job.note && (
                        <aside className="border-l border-sky pl-5">
                          <p className="label-mono text-sky-ink">{job.note.title}</p>
                          <p className="mt-2 text-ink-muted">{job.note.text}</p>
                        </aside>
                      )}
                    </div>
                  </div>
                </BlueprintFrame>
              </div>
            </li>
          );
        })}

        <li data-timeline-item className="relative pl-8 md:pl-14">
          <span aria-hidden data-timeline-node className="bp-timeline-node absolute top-1.5 left-0 size-3 -translate-x-1/2" />
          <div data-timeline-body className="space-y-3">
            <h3 className="label-mono text-ink-muted">{t("other")}</h3>
            <ul className="space-y-2 text-ink-muted">
              {cv.otherExperience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </li>
      </TimelineAnimation>
    </section>
  );
}
