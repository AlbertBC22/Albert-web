import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/blueprint/Button";
import StaggerReveal from "@/components/motion/StaggerReveal";
import type { Cv } from "@/types/cv";
import SectionHeading from "./SectionHeading";

// REF. 06 — Intereses: tres láminas que se descubren con un barrido; la de fotografía
// enlaza a la galería.
export default async function Interests({ cv }: { cv: Cv }) {
  const t = await getTranslations("Home.interests");

  return (
    <section aria-labelledby="interests-title" className="mx-auto max-w-6xl space-y-14 px-4 py-24 sm:px-8 md:py-32">
      <SectionHeading index="06" label={t("label")} title={t("title")} id="interests-title" />
      <StaggerReveal variant="wipe">
        <ul className="grid gap-6 md:grid-cols-3">
          {cv.interests.map((interest, index) => (
            <li key={interest.id} data-card className="flex flex-col gap-4 border border-ink bg-paper p-6">
              <p className="label-mono text-sky-ink">[06.{index + 1}]</p>
              <h3 className="text-h3 font-medium">{interest.title}</h3>
              <p className="flex-1 text-ink-muted">{interest.text}</p>
              {interest.id === "photography" && (
                <div className="pt-2">
                  <ButtonLink href="/fotografia" arrow>
                    {t("gallery")}
                  </ButtonLink>
                </div>
              )}
            </li>
          ))}
        </ul>
      </StaggerReveal>
    </section>
  );
}
