"use client";

import { useFormatter } from "next-intl";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MOTION_OK } from "@/lib/animations/motion";

type Props = {
  value: number;
  prefix?: string;
  delay?: number; // s, para encadenar contadores (p. ej. el embudo)
};

// Número que cuenta desde 0 al entrar en pantalla. El HTML ya trae el valor final (sin JS
// o con movimiento reducido se ve tal cual) y la caja reserva su ancho: no hay saltos.
export default function CountUp({ value, prefix = "", delay = 0 }: Props) {
  const format = useFormatter();
  const ref = useRef<HTMLSpanElement>(null);
  // "always": en español Intl no agrupa los números de 4 cifras (1500 → 1.500)
  const formatValue = (n: number) => format.number(n, { useGrouping: "always" });
  const finalText = `${prefix}${formatValue(value)}`;

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const counter = { value: 0 };
        gsap.to(counter, {
          value,
          duration: 1.6,
          delay,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
          onStart: () => {
            if (ref.current) ref.current.textContent = `${prefix}${formatValue(0)}`;
          },
          onUpdate: () => {
            if (ref.current) ref.current.textContent = `${prefix}${formatValue(Math.round(counter.value))}`;
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="inline-block tabular-nums" style={{ minWidth: `${finalText.length}ch` }}>
      {finalText}
    </span>
  );
}
