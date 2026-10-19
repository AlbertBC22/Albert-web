"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { MOTION_OK } from "@/lib/animations/motion";

type Props = {
  children: ReactNode;
  className?: string;
};

// Línea de tiempo vertical que se dibuja al ritmo del scroll (scrub). Cada nodo se
// activa cuando la línea llega a él y su lámina aparece.
// Marcas esperadas: [data-timeline-line], [data-timeline-item] y [data-timeline-node].
export default function TimelineAnimation({ children, className = "" }: Props) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-timeline-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 70%", scrub: 0.4 },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-timeline-item]").forEach((item) => {
          const node = item.querySelector("[data-timeline-node]");
          // Mismo punto de la pantalla que la punta de la línea (70 %). Se queda activo al
          // pasar; solo se apaga al volver a subir por encima.
          ScrollTrigger.create({
            trigger: item,
            start: "top 70%",
            onEnter: () => node?.classList.add("is-active"),
            onLeaveBack: () => node?.classList.remove("is-active"),
          });
          gsap.from(item.querySelector("[data-timeline-body]"), {
            autoAlpha: 0,
            y: 24,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 80%", once: true },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}
