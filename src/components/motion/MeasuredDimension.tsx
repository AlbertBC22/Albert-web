"use client";

import { useFormatter } from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import DimensionLine from "@/components/blueprint/DimensionLine";

// Cota que mide su propio ancho en píxeles reales ("1.024 PX"). Colocada sobre un titular
// con el mismo ancho, "mide el titular". Se recalcula al cambiar el tamaño de la ventana.
export default function MeasuredDimension({ className = "" }: { className?: string }) {
  const format = useFormatter();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      <DimensionLine value={width === null ? "···· px" : `${format.number(width)} px`} animated={false} />
    </div>
  );
}
