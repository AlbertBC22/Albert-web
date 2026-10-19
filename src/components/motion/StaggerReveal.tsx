"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MOTION_OK } from "@/lib/animations/motion";

type Variant = "legend" | "scale" | "wipe";

type Props = {
  variant: Variant;
  children: ReactNode;
  className?: string;
};

// Animaciones de entrada por sección, al llegar a ella con el scroll:
// - legend: cada fila de la leyenda aparece y su línea guía se traza ([data-row], [data-leader]).
// - scale:  los segmentos de cada escala gráfica se rellenan uno a uno ([data-segment]).
// - wipe:   cada tarjeta se descubre con un barrido de izquierda a derecha ([data-card]).
export default function StaggerReveal({ variant, children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const scrollTrigger = { trigger: ref.current, start: "top 80%", once: true };

        if (variant === "legend") {
          const tl = gsap.timeline({ scrollTrigger });
          tl.from("[data-row]", { autoAlpha: 0, y: 10, duration: 0.5, ease: "power3.out", stagger: 0.08 })
            .from("[data-leader]", { scaleX: 0, transformOrigin: "left center", duration: 0.6, ease: "power2.out", stagger: 0.08 }, 0.15);
        }

        if (variant === "scale") {
          gsap.from("[data-segment][data-filled]", {
            backgroundColor: "transparent",
            duration: 0.25,
            ease: "none",
            stagger: 0.05,
            scrollTrigger,
          });
        }

        if (variant === "wipe") {
          gsap.fromTo(
            "[data-card]",
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut", stagger: 0.15, scrollTrigger },
          );
        }
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
