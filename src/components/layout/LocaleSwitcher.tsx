"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Enlaces a la misma página en el otro idioma (p. ej. /es/proyectos ↔ /en/projects).
export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const params = useParams();

  return (
    <nav aria-label={t("label")}>
      <ul>
        {routing.locales.map((locale) => (
          <li key={locale}>
            <Link
              // @ts-expect-error -- pathname y params siempre corresponden a la ruta actual, así que encajan.
              href={{ pathname, params }}
              locale={locale}
              lang={locale}
              aria-current={locale === currentLocale ? "true" : undefined}
            >
              {t(locale)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
