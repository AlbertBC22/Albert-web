import { getTranslations } from "next-intl/server";
import StaggerReveal from "@/components/motion/StaggerReveal";
import type { Cv } from "@/types/cv";
import SectionHeading from "./SectionHeading";

// REF. 02 — Certificaciones como tabla de leyenda: nº, certificación, línea guía, emisor y año.
export default async function Certifications({ cv }: { cv: Cv }) {
  const t = await getTranslations("Education.certifications");

  return (
    <section aria-labelledby="certifications-title" className="mx-auto max-w-6xl space-y-10 px-4 py-20 sm:px-8 md:py-28">
      <SectionHeading index="02" label={t("label")} title={t("title")} id="certifications-title" />
      <p className="text-ink-muted">{cv.certificationsNote}</p>

      <StaggerReveal variant="legend">
        <table className="w-full border-collapse text-left">
          <thead className="label-mono text-ink-muted">
            <tr className="border-y border-ink">
              <th scope="col" className="w-12 py-3 font-normal">Nº</th>
              <th scope="col" className="py-3 font-normal">{t("certification")}</th>
              <th scope="col" className="hidden py-3 font-normal md:table-cell" aria-hidden />
              <th scope="col" className="hidden py-3 pl-4 font-normal sm:table-cell">{t("issuer")}</th>
              <th scope="col" className="hidden py-3 pl-4 text-right font-normal sm:table-cell">{t("year")}</th>
            </tr>
          </thead>
          <tbody>
            {cv.certifications.map((cert, index) => (
              <tr key={cert.title} data-row className="border-b border-line align-baseline">
                <td className="label-mono py-4 text-sky-ink">{String(index + 1).padStart(2, "0")}</td>
                <td className="py-4 pr-4">
                  {cert.title}
                  {/* En móvil, emisor y año bajo el título (las columnas se ocultan) */}
                  <span className="label-mono mt-1 block text-ink-muted sm:hidden">
                    {cert.issuer ?? "—"} · {cert.year}
                  </span>
                </td>
                <td aria-hidden className="hidden w-1/4 py-4 md:table-cell">
                  <span data-leader className="block border-t border-dashed border-ink-muted" />
                </td>
                <td className="label-mono hidden py-4 pl-4 sm:table-cell">
                  {cert.issuer ?? (
                    <>
                      <span aria-hidden className="text-ink-muted">—</span>
                      <span className="sr-only">{t("unknown")}</span>
                    </>
                  )}
                </td>
                <td className="label-mono hidden py-4 pl-4 text-right whitespace-nowrap text-ink-muted sm:table-cell">{cert.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </StaggerReveal>
    </section>
  );
}
