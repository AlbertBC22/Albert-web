"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { LOADER_REVEAL_EVENT, LOADER_STORAGE_KEY } from "@/lib/loader";

// Retícula del loader: líneas cada 80 px desde el centro de la pantalla.
const VERTICALS = Array.from({ length: 25 }, (_, i) => (i - 12) * 80);
const HORIZONTALS = Array.from({ length: 15 }, (_, i) => (i - 7) * 80);
const STEPS = ["step1", "step2", "step3", "step4"] as const;
const CORNERS = [
  "top-4 left-4 sm:top-6 sm:left-6",
  "top-4 right-4 rotate-90 sm:top-6 sm:right-6",
  "bottom-4 right-4 rotate-180 sm:bottom-6 sm:right-6",
  "bottom-4 left-4 -rotate-90 sm:bottom-6 sm:left-6",
];

// Pantalla de carga: el plano se dibuja (retícula, marco, nombre, pasos y cota con el %)
// y al terminar se abre en dos hojas. Solo en la primera visita de la sesión; se salta con
// clic o Esc. El script de LoaderScript la oculta antes de pintar si no toca mostrarla.
// Estados iniciales y ocultación en globals.css → .bp-loader.
export default function Loader() {
  const t = useTranslations("Loader");
  const rootRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const skip = () => {
    const tl = timelineRef.current;
    if (tl && tl.time() < tl.labels.exit) tl.seek("exit");
  };

  useGSAP(
    () => {
      const html = document.documentElement;
      if (html.classList.contains("loader-off")) return;
      html.classList.add("loader-active"); // bloquea el scroll mientras se ve

      const finish = () => {
        try {
          sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
        } catch {
          // sin almacenamiento: no pasa nada, se volverá a ver en la próxima visita
        }
        html.classList.remove("loader-active");
        html.classList.add("loader-off");
      };

      const progress = { value: 0 };
      const tl = gsap.timeline({ onComplete: finish });
      timelineRef.current = tl;

      // fromTo: el estado inicial lo fija también el CSS (para que no parpadee antes de hidratar)
      tl
        // 1. Retícula desde el centro
        .fromTo("[data-grid-v]", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power2.out", stagger: { each: 0.015, from: "center" } }, 0)
        .fromTo("[data-grid-h]", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.out", stagger: { each: 0.02, from: "center" } }, 0.05)
        // 2. Marco y rótulos de esquina
        .set("[data-corner]", { autoAlpha: 1 }, 0.2)
        .fromTo("[data-corner] path", { drawSVG: 0 }, { drawSVG: "100%", duration: 0.6, ease: "power2.inOut", stagger: 0.08 }, 0.2)
        .to("[data-meta]", { autoAlpha: 1, duration: 0.3 }, 0.25)
        // 3. Nombre línea a línea con máscara
        // y: 0 → GSAP leería el translateY(110%) del CSS como píxeles y lo sumaría al yPercent
        .fromTo("[data-name]", { y: 0, yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.1 }, 0.35)
        .to("[data-role]", { autoAlpha: 1, duration: 0.4 }, 0.7)
        // 4. Porcentaje y cota de progreso
        .to(
          progress,
          {
            value: 100,
            duration: 1.3,
            ease: "power1.inOut",
            onUpdate: () => {
              if (percentRef.current) percentRef.current.textContent = String(Math.round(progress.value)).padStart(3, "0");
            },
          },
          0,
        )
        .fromTo("[data-progress]", { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "power1.inOut" }, 0);

      // 5. Pasos numerados: cada uno aparece y se marca OK cuando empieza el siguiente
      STEPS.forEach((_, i) => {
        tl.to(`[data-step="${i}"]`, { autoAlpha: 1, duration: 0.2 }, 0.05 + i * 0.3);
        tl.to(`[data-step-ok="${i}"]`, { autoAlpha: 1, duration: 0.15 }, 0.35 + i * 0.3);
      });

      // 6. Salida: se traza un corte horizontal y el plano se abre en dos hojas
      tl.addLabel("exit", 1.45)
        .to("[data-content]", { autoAlpha: 0, duration: 0.25 }, "exit")
        .fromTo("[data-seam]", { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "power3.inOut" }, "exit")
        // Aviso para las animaciones de la página (p. ej. el hero): la web empieza a verse
        .call(
          () => {
            html.classList.add("loader-revealing");
            window.dispatchEvent(new Event(LOADER_REVEAL_EVENT));
          },
          undefined,
          "exit+=0.3",
        )
        .to("[data-panel='top']", { yPercent: -100, duration: 0.7, ease: "power3.inOut" }, "exit+=0.3")
        .to("[data-panel='bottom']", { yPercent: 100, duration: 0.7, ease: "power3.inOut" }, "exit+=0.3")
        .to("[data-seam]", { autoAlpha: 0, duration: 0.2 }, "exit+=0.3");

      const onKey = (event: KeyboardEvent) => event.key === "Escape" && skip();
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        html.classList.remove("loader-active");
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} role="status" aria-label={t("label")} className="bp-loader" onClick={skip}>
      <div data-panel="top" className="absolute inset-x-0 top-0 h-1/2 bg-paper" />
      <div data-panel="bottom" className="absolute inset-x-0 bottom-0 h-1/2 bg-paper" />
      <div data-seam className="absolute inset-x-0 top-1/2 h-px bg-ink" />

      <div data-content className="absolute inset-0">
        {/* Retícula */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          {VERTICALS.map((offset) => (
            <span key={`v${offset}`} data-grid-v className="absolute inset-y-0 w-px bg-sky/25" style={{ left: `calc(50% + ${offset}px)` }} />
          ))}
          {HORIZONTALS.map((offset) => (
            <span key={`h${offset}`} data-grid-h className="absolute inset-x-0 h-px bg-sky/25" style={{ top: `calc(50% + ${offset}px)` }} />
          ))}
        </div>

        {/* Marco */}
        {CORNERS.map((position) => (
          <svg key={position} data-corner aria-hidden viewBox="0 0 24 24" className={`absolute size-6 text-ink ${position}`}>
            <path d="M0.5 24V0.5H24" fill="none" stroke="currentColor" />
          </svg>
        ))}
        <p data-meta aria-hidden className="label-mono absolute top-5 left-14 text-ink-muted sm:top-7 sm:left-16">
          AB-00 · Albert-web
        </p>
        <p data-meta aria-hidden className="label-mono absolute top-5 right-14 text-ink-muted sm:top-7 sm:right-16">
          [0,0]
        </p>

        {/* Nombre */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center">
          <p className="text-h1 font-medium">
            <span className="block overflow-hidden pb-1">
              <span data-name className="block">Albert Batiste</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span data-name className="block">Castellet</span>
            </span>
          </p>
          <p data-role className="label-mono mt-4 text-ink-muted">{t("role")}</p>
        </div>

        {/* Pasos numerados */}
        <ol aria-hidden className="label-mono absolute bottom-24 left-6 space-y-1 text-ink-muted sm:bottom-28 sm:left-10">
          {STEPS.map((step, i) => (
            <li key={step} data-step={i} className="flex gap-3">
              <span className="text-sky-ink">{String(i + 1).padStart(3, "0")}</span>
              <span>{t(step)}…</span>
              <span data-step-ok={i} className="text-ink">OK</span>
            </li>
          ))}
        </ol>

        {/* Cota de progreso con el porcentaje */}
        <div aria-hidden className="absolute inset-x-6 bottom-12 flex items-center gap-3 sm:inset-x-10 sm:bottom-14">
          <span className="h-3 w-px bg-ink-muted" />
          <span className="relative h-px flex-1 bg-line">
            <span data-progress className="absolute inset-0 origin-left bg-ink" />
          </span>
          <span className="label-mono text-ink">
            <span ref={percentRef}>000</span> %
          </span>
          <span className="h-3 w-px bg-ink-muted" />
        </div>

        <button
          type="button"
          onClick={skip}
          className="label-mono absolute right-6 bottom-4 py-2 text-ink-muted hover:text-ink sm:right-10 sm:bottom-5"
        >
          [ {t("skip")} ]
        </button>
      </div>
    </div>
  );
}
