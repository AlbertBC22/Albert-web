"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

// Índice de planos: [00] Inicio, [01] Formación...
const ITEMS = [
  { href: "/", key: "home" },
  { href: "/formacion", key: "education" },
  { href: "/proyectos", key: "projects" },
  { href: "/fotografia", key: "photography" },
  { href: "/contacto", key: "contact" },
] as const;

export default function HeaderNav() {
  const t = useTranslations("Nav");
  const tHeader = useTranslations("Header");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex items-center gap-6">
      <nav aria-label={t("label")}>
        {/* En móvil el índice se despliega bajo la cabecera */}
        <button
          type="button"
          className="label-mono py-2 md:hidden"
          aria-expanded={open}
          aria-controls="site-nav-list"
          onClick={() => setOpen(!open)}
        >
          [ {open ? tHeader("close") : tHeader("menu")} ]
        </button>
        <ul
          id="site-nav-list"
          className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col gap-1 border-b border-line bg-paper px-4 py-4 sm:px-8 md:static md:flex md:flex-row md:gap-6 md:border-0 md:bg-transparent md:p-0`}
        >
          {ITEMS.map((item, index) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="label-mono flex gap-2 py-2 text-ink-muted transition-colors hover:text-ink aria-[current=page]:text-ink md:py-0"
              >
                <span className="text-sky-ink">[{String(index).padStart(2, "0")}]</span>
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <LocaleSwitcher />
    </div>
  );
}
