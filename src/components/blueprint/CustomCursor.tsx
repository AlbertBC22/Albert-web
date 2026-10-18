"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Mode = "default" | "link" | "view" | "hidden";

const INTERACTIVE = "a, button, [role='button'], label, summary, select";
const VIEW = "img, [data-cursor='view']";
const TEXT = "input, textarea, [contenteditable='true']"; // aquí, cursor nativo

// Solo con ratón (pointer: fine) y sin movimiento reducido.
const FINE_POINTER = "(pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const queries = [window.matchMedia(FINE_POINTER), window.matchMedia(REDUCED_MOTION)];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

const isEnabled = () =>
  window.matchMedia(FINE_POINTER).matches && !window.matchMedia(REDUCED_MOTION).matches;

const pad = (n: number) => String(Math.round(n)).padStart(4, "0");

// Cursor de replanteo: cruz fina con lectura de coordenadas. Sobre enlaces y botones se
// convierte en un marco de corchetes; sobre fotos, en un marco con "VER".
// Estilos en globals.css → .bp-cursor.
export default function CustomCursor() {
  const t = useTranslations("Cursor");
  const enabled = useSyncExternalStore(subscribe, isEnabled, () => false);
  const rootRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<Mode>("hidden");

  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;
    const html = document.documentElement;
    html.classList.add("has-custom-cursor");

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      // Posición y lectura directamente en el DOM: sin re-render en cada movimiento
      root.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      if (coordsRef.current) {
        coordsRef.current.textContent = `X:${pad(event.clientX)} Y:${pad(event.clientY)}`;
      }
      const target = event.target instanceof Element ? event.target : null;
      setMode(
        !target || target.closest(TEXT)
          ? "hidden"
          : target.closest(VIEW)
            ? "view"
            : target.closest(INTERACTIVE)
              ? "link"
              : "default",
      );
    };
    const onLeave = () => setMode("hidden");

    window.addEventListener("pointermove", onMove);
    html.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      html.removeEventListener("pointerleave", onLeave);
      html.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} aria-hidden data-mode={mode} className="bp-cursor">
      <span className="bp-cursor__cross" />
      <span className="bp-cursor__frame">
        <span className="bp-cursor__view label-mono">{t("view")}</span>
      </span>
      <span ref={coordsRef} className="bp-cursor__coords label-mono" />
    </div>
  );
}
