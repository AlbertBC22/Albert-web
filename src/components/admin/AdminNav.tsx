"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Secciones del panel.
const ITEMS = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/albumes", label: "Álbumes y fotos" },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/mensajes", label: "Mensajes" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Secciones del panel">
      <ul className="space-y-1">
        {ITEMS.map((item, index) => {
          const index2 = `[${String(index).padStart(2, "0")}]`;
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="label-mono flex gap-2 py-2 text-ink-muted transition-colors hover:text-ink aria-[current=page]:text-ink"
              >
                <span className="text-sky-ink">{index2}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
