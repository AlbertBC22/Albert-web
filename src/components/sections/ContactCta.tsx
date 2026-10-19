import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/blueprint/Button";
import DimensionLine from "@/components/blueprint/DimensionLine";
import SectionLabel from "@/components/blueprint/SectionLabel";
import SplitReveal from "@/components/motion/SplitReveal";

// Cierre de la página: invitación a escribir desde el formulario de contacto.
export default async function ContactCta() {
  const t = await getTranslations("Home.cta");

  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-6xl space-y-10 px-4 py-24 sm:px-8 md:py-32">
      <SectionLabel index="07">{t("label")}</SectionLabel>
      <DimensionLine value="1:1" />
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="space-y-6">
          <h2 id="cta-title" className="text-[clamp(2.75rem,7vw,6rem)] leading-none font-medium tracking-[-0.03em]">
            {t("title")}
          </h2>
          <SplitReveal className="max-w-xl text-lead text-ink-muted">
            <p>{t("text")}</p>
          </SplitReveal>
        </div>
        <ButtonLink href="/contacto" variant="accent" arrow>
          {t("button")}
        </ButtonLink>
      </div>
    </section>
  );
}
