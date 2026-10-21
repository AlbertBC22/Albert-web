import type { Metadata } from "next";
import type { ReactNode } from "react";
import GridBackground from "@/components/blueprint/GridBackground";
import { plexMono, plexSans } from "../fonts";
import "../globals.css";

// Layout raíz del panel de administración: solo español, fuera de [locale], sin indexar.
export const metadata: Metadata = {
  title: { default: "Panel · Albert-web", template: "%s · Panel · Albert-web" },
  robots: { index: false, follow: false },
};

// El panel lee la sesión en cada petición: se resuelve en el servidor (no hay "shell" estático
// que pre-renderizar en un panel privado). Ver docs de Next: instant-navigation#opting-out.
export const instant = false;

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <GridBackground />
        {children}
      </body>
    </html>
  );
}
