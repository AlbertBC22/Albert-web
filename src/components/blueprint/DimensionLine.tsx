"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MOTION_OK } from "@/lib/animations/motion";

type Props = {
  value: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
};

// Cota: línea de medida con topes, flechas y valor centrado.
// Al entrar en pantalla las dos mitades se extienden desde el valor hacia los extremos.
export default function DimensionLine({ value, orientation = "horizontal", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isHorizontal = orientation === "horizontal";

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        });
        tl.from("[data-value]", { autoAlpha: 0, duration: 0.3 })
          .from("[data-half]", {
            [isHorizontal ? "scaleX" : "scaleY"]: 0,
            duration: 0.7,
            ease: "power3.out",
          })
          .from("[data-end]", { autoAlpha: 0, duration: 0.2 }, "-=0.15");
      });
    },
    { scope: ref },
  );

  const half = isHorizontal ? "h-px flex-1" : "w-px flex-1";
  const tick = isHorizontal ? "h-3 w-px" : "h-px w-3";
  // Una sola rotación por flecha (en Tailwind 4 dos clases rotate-* no se suman).
  const startArrow = isHorizontal ? "" : "rotate-90";
  const endArrow = isHorizontal ? "rotate-180" : "-rotate-90";

  return (
    <div
      ref={ref}
      aria-hidden
      className={`flex items-center text-ink-muted ${isHorizontal ? "w-full" : "h-full flex-col"} ${className}`}
    >
      <span data-end className={`${tick} shrink-0 bg-current`} />
      <Arrow data-end className={startArrow} />
      <span data-half className={`${half} bg-current ${isHorizontal ? "origin-right" : "origin-bottom"}`} />
      <span
        data-value
        className={`label-mono shrink-0 px-2 text-ink ${isHorizontal ? "" : "py-2 [writing-mode:vertical-rl] rotate-180"}`}
      >
        {value}
      </span>
      <span data-half className={`${half} bg-current ${isHorizontal ? "origin-left" : "origin-top"}`} />
      <Arrow data-end className={endArrow} />
      <span data-end className={`${tick} shrink-0 bg-current`} />
    </div>
  );
}

// Punta de flecha abierta apuntando hacia el extremo izquierdo (o superior, girada).
// Incluye su propio tramo de línea para empalmar sin huecos con la mitad de la cota.
function Arrow({ className = "", ...rest }: { className?: string; "data-end"?: boolean }) {
  return (
    <svg viewBox="0 0 8 8" className={`size-2 shrink-0 ${className}`} {...rest}>
      <path d="M7 0.5 1 4l6 3.5M1 4h7" fill="none" stroke="currentColor" />
    </svg>
  );
}
