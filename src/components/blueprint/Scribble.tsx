"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";

// Pequeñas variaciones (siempre las mismas) para que el trazo parezca hecho a mano.
const STEPS = [5.5, 6.5, 5.8, 6.4, 5.6, 6.2]; // avance entre pasadas, en px (~6)
const TOP_JITTER = [2, 0, 4, 1, 3, 0];
const BOTTOM_JITTER = [2, 0, 4, 1, 3, 0];
const PAD = 3; // medio grosor del trazo: que no se corte arriba y abajo

// Zigzag vertical que avanza de izquierda a derecha y, en el último tramo, va perdiendo
// altura hasta acabar en una línea horizontal hasta el borde: como cuando se remata un trazo.
function buildPath(width: number, height: number) {
  const mid = height / 2;
  const taper = Math.min(70, width * 0.3); // tramo final donde el zigzag se aplana
  const end = width - PAD;
  const taperStart = end - taper;

  let d = `M${PAD} ${PAD + TOP_JITTER[0]}`;
  for (let i = 1, x = PAD + 5; x < end - 10; i++, x += STEPS[i % 6]) {
    const amplitude = x < taperStart ? 1 : Math.max(0, (end - 10 - x) / (taper - 10));
    const edge = i % 2 ? height - PAD - BOTTOM_JITTER[i % 6] : PAD + TOP_JITTER[i % 6];
    const y = mid + (edge - mid) * amplitude;
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  // Remate: línea casi horizontal, con una ligera curva, hasta el borde derecho.
  d += ` Q${(end - 6).toFixed(1)} ${(mid - 1.5).toFixed(1)} ${end.toFixed(1)} ${(mid - 1).toFixed(1)}`;
  return d;
}

// Garabato de rotulador del botón. Se dibuja a la medida exacta del botón (por eso es de
// cliente) y expone su longitud en --scribble-length para la animación de globals.css.
export default function Scribble() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    // En el <svg>: ahí es donde globals.css resuelve stroke-dasharray / stroke-dashoffset.
    const path = pathRef.current;
    if (!path || !size) return;
    svgRef.current?.style.setProperty("--scribble-length", `${Math.ceil(path.getTotalLength()) + 1}px`);
  }, [size]);

  // Degradado del trazo: con el tema por defecto los dos colores son azul cielo (color liso).
  // (useId puede incluir caracteres no válidos en url(#…): se limpian)
  const gradientId = `scribble-${useId().replace(/[^\w-]/g, "")}`;

  return (
    <svg ref={svgRef} aria-hidden className="bp-button__scribble">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          {/* var() solo funciona en style, no en atributos SVG */}
          <stop offset="0" style={{ stopColor: "var(--scribble-from)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--scribble-to)" }} />
          <stop offset="1" style={{ stopColor: "var(--scribble-from)" }} />
        </linearGradient>
      </defs>
      {size && size.width > 0 && (
        <path ref={pathRef} d={buildPath(size.width, size.height)} stroke={`url(#${gradientId})`} />
      )}
    </svg>
  );
}
