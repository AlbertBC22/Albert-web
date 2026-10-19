"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/animations/gsap";
import { MOTION_OK } from "@/lib/animations/motion";

type Props = {
  children: ReactNode;
  className?: string;
};

// Texto que aparece línea a línea con máscara al entrar en pantalla (SplitText).
// Divide cada <p> hijo. autoSplit vuelve a dividir al cargar las fuentes o cambiar el ancho,
// así las líneas siempre coinciden con las reales y no hay saltos.
export default function SplitReveal({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        SplitText.create(ref.current!.querySelectorAll("p"), {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 100,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.07,
              scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
            }),
        });
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
