"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { MOTION_OK } from "@/lib/animations/motion";

type Props = {
  children: ReactNode;
  className?: string;
  aspectRatio?: number;
};

// Revelado tipo escáner: una línea azul baja por la foto y va retirando la capa que la tapa.
// Empieza al llegar con el scroll y cuando la imagen ya ha cargado. La capa se muestra desde
// globals.css (.js [data-scan-cover]): sin JS o con movimiento reducido, la foto se ve directamente.
// No se recorta la imagen con clip-path: el navegador no carga una imagen lazy que está oculta así.
export default function ScanReveal({ children, className = "", aspectRatio }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const root = ref.current;
        const image = root?.querySelector("img");
        if (!root || !image) return;

        const timeline = gsap
          .timeline({ paused: true })
          .set("[data-scan-line]", { autoAlpha: 1 })
          .fromTo("[data-scan-cover]", { clipPath: "inset(0% 0 0 0)" }, { clipPath: "inset(100% 0 0 0)", duration: 1.1, ease: "power2.inOut" })
          .fromTo("[data-scan-line]", { yPercent: 0 }, { yPercent: 100, duration: 1.1, ease: "power2.inOut" }, 0)
          .to("[data-scan-line]", { autoAlpha: 0, duration: 0.2 });

        // Si la imagen falla, también se destapa: se ve su texto alternativo
        const loaded = image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            });

        ScrollTrigger.create({
          trigger: root,
          start: "top 90%",
          once: true,
          onEnter: () => void loaded.then(() => timeline.play()),
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      {children}
      <span data-scan-cover aria-hidden className="pointer-events-none absolute inset-0 hidden bg-paper" />
      <span data-scan-line aria-hidden className="pointer-events-none invisible absolute inset-0 border-t-2 border-sky" />
    </div>
  );
}
