"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MOTION_OK } from "@/lib/animations/motion";

type Props = {
  children: ReactNode;
  className?: string;
};

// Cada esquina es la misma "L" girada.
const CORNERS = [
  "top-0 left-0",
  "top-0 right-0 rotate-90",
  "bottom-0 right-0 rotate-180",
  "bottom-0 left-0 -rotate-90",
];

// Marco con marcas de esquina que se trazan al entrar en pantalla.
export default function BlueprintFrame({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-corner] path", {
          drawSVG: 0,
          duration: 0.8,
          ease: "power2.inOut",
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`relative p-6 md:p-10 ${className}`}>
      {CORNERS.map((position) => (
        <svg
          key={position}
          data-corner
          aria-hidden
          viewBox="0 0 16 16"
          className={`pencil absolute size-4 overflow-visible text-ink ${position}`}
        >
          <path d="M0.5 16V0.5H16" fill="none" stroke="currentColor" />
        </svg>
      ))}
      {children}
    </div>
  );
}
