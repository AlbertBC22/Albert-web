"use client";

import { usePathname } from "@/i18n/navigation";

// Nº de plano de cada página. Los detalles (proyecto, álbum) comparten número con su índice.
const SHEETS: [prefix: string, sheet: string][] = [
  ["/formacion", "AB-01"],
  ["/proyectos", "AB-02"],
  ["/fotografia", "AB-03"],
  ["/contacto", "AB-04"],
  ["/_plano", "AB-99"],
];

export default function SheetNumber() {
  const pathname = usePathname();
  const match = SHEETS.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return <>{match ? match[1] : "AB-00"}</>;
}
