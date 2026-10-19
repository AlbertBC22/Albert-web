import { getTranslations } from "next-intl/server";
import SplitReveal from "@/components/motion/SplitReveal";
import type { Cv } from "@/types/cv";
import SectionHeading from "./SectionHeading";

// REF. 01 — Perfil: texto grande que aparece línea a línea.
export default async function Profile({ cv }: { cv: Cv }) {
  const t = await getTranslations("Home.profile");

  return (
    <section aria-labelledby="profile-title" className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-24 sm:px-8 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:pt-16 md:pb-32">
      <SectionHeading index="01" label={t("label")} title={t("title")} id="profile-title" />
      <SplitReveal className="space-y-6 text-[clamp(1.25rem,2.1vw,1.75rem)] leading-snug">
        {cv.profile.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </SplitReveal>
    </section>
  );
}
