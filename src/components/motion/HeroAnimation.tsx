"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MOTION_OK } from "@/lib/animations/motion";
import { onLoaderReveal } from "@/lib/loader";

type Props = {
  children: ReactNode;
  className?: string;
  labelledBy: string;
};

// Entrada del hero, cuando la pantalla de carga se abre (o al momento si no hay):
// nombre línea a línea con máscara, cotas que se extienden desde el centro, marco de la
// foto que se traza y el resto que aparece. Elementos marcados con data-hero-*.
// Estados iniciales en globals.css (solo con JS y sin reduced motion), para que no parpadee.
export default function HeroAnimation({ children, className = "", labelledBy }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        // fromTo: el estado inicial lo fija también el CSS (y: 0 para que no sume el translateY del CSS)
        tl.fromTo("[data-hero-name]", { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.12 })
          .fromTo("[data-hero-dim-x]", { clipPath: "inset(0 50% 0 50%)" }, { clipPath: "inset(0 0% 0 0%)", duration: 0.9 }, 0.35)
          .fromTo("[data-hero-dim-y]", { clipPath: "inset(50% 0 50% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 0.9 }, 0.55)
          .set("[data-hero-corner]", { autoAlpha: 1 }, 0.4)
          .fromTo("[data-hero-corner] path", { drawSVG: 0 }, { drawSVG: "100%", duration: 0.7, ease: "power2.inOut", stagger: 0.08 }, 0.4)
          .fromTo("[data-hero-fade]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.5);

        return onLoaderReveal(() => tl.play());
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}
