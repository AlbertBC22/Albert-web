import { getTranslations } from "next-intl/server";
import DimensionLine from "@/components/blueprint/DimensionLine";
import ExternalLink from "@/components/blueprint/ExternalLink";
import SectionLabel from "@/components/blueprint/SectionLabel";
import SpecList from "@/components/blueprint/SpecList";
import HeroAnimation from "@/components/motion/HeroAnimation";
import MeasuredDimension from "@/components/motion/MeasuredDimension";
import type { Cv } from "@/types/cv";

// Esquinas del marco de la foto: la misma "L" girada.
const CORNERS = [
  "-top-2 -left-2",
  "-top-2 -right-2 rotate-90",
  "-bottom-2 -right-2 rotate-180",
  "-bottom-2 -left-2 -rotate-90",
];

// Hero: nombre con una cota que mide el titular, rol, tagline, ficha y foto (placeholder).
// Las marcas data-hero-* las anima HeroAnimation.
export default async function Hero({ cv }: { cv: Cv }) {
  const t = await getTranslations("Home.hero");
  const tCommon = await getTranslations("Common");

  return (
    <HeroAnimation
      labelledBy="hero-title"
      className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-12 px-4 pt-12 pb-24 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20"
    >
      <div className="min-w-0 space-y-8">
        <div data-hero-fade>
          <SectionLabel index="00">{t("label")}</SectionLabel>
        </div>

        {/* El bloque mide lo mismo que el titular: la cota de encima lo "mide" */}
        <div className="inline-block max-w-full">
          <div data-hero-dim-x>
            <MeasuredDimension className="mb-3" />
          </div>
          <h1 id="hero-title" className="text-[clamp(2.5rem,6.4vw,5.75rem)] leading-[0.95] font-medium tracking-[-0.03em]">
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-name className="block">{cv.name.first}</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-name className="block">{cv.name.last}</span>
            </span>
          </h1>
        </div>

        <p data-hero-fade className="label-mono text-sky-ink">{cv.role}</p>
        <p data-hero-fade className="max-w-xl text-lead text-ink-muted">{cv.tagline}</p>

        <div data-hero-fade className="max-w-md">
          <SpecList
            items={[
              { label: t("location"), value: cv.location },
              {
                label: t("links"),
                value: (
                  <span className="flex flex-wrap gap-x-5 gap-y-1">
                    <ExternalLink href={cv.links.linkedin} newTabLabel={tCommon("newTab")}>LinkedIn</ExternalLink>
                    <ExternalLink href={cv.links.github} newTabLabel={tCommon("newTab")}>GitHub</ExternalLink>
                  </span>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Foto: marco 4:5 reservado (sin saltos de layout cuando llegue la real) */}
      <figure className="relative mx-auto w-full max-w-xs md:max-w-none">
        <div className="flex gap-4">
          <div className="relative flex-1">
            {CORNERS.map((position) => (
              <svg key={position} data-hero-corner aria-hidden viewBox="0 0 16 16" className={`absolute size-4 text-ink ${position}`}>
                <path d="M0.5 16V0.5H16" fill="none" stroke="currentColor" />
              </svg>
            ))}
            <div
              role="img"
              aria-label={t("photoAlt")}
              className="relative grid aspect-[4/5] place-items-center overflow-hidden border border-dashed border-line bg-paper/70"
            >
              {/* Cruz de "hueco reservado", como en los planos */}
              <svg aria-hidden className="absolute inset-0 size-full text-line" preserveAspectRatio="none" viewBox="0 0 100 125">
                <path d="M0 0L100 125M100 0L0 125" stroke="currentColor" vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="label-mono relative bg-paper px-2 py-1 text-ink-muted">{t("photoPending")}</span>
            </div>
          </div>
          <div data-hero-dim-y className="hidden sm:block">
            <DimensionLine value="5" orientation="vertical" animated={false} />
          </div>
        </div>
        {/* Margen derecho = hueco + ancho de la cota vertical: mide solo la foto */}
        <div data-hero-dim-x className="mt-3 sm:mr-7">
          <DimensionLine value="4" animated={false} />
        </div>
      </figure>

      <p data-hero-fade className="label-mono absolute bottom-8 left-4 flex items-center gap-3 text-ink-muted sm:left-8">
        <span aria-hidden className="bp-scroll-hint h-6 w-px bg-ink-muted" />[{t("scroll")}]
      </p>
    </HeroAnimation>
  );
}
