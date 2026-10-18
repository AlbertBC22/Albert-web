"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Fragment } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// ES / EN: enlaces a la misma página en el otro idioma (p. ej. /es/proyectos ↔ /en/projects).
export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const params = useParams();

  return (
    <nav aria-label={t("label")} className="label-mono flex items-center gap-2">
      {routing.locales.map((locale, index) => (
        <Fragment key={locale}>
          {index > 0 && <span aria-hidden className="text-line">/</span>}
          <Link
            // @ts-expect-error -- pathname y params siempre corresponden a la ruta actual, así que encajan.
            href={{ pathname, params }}
            locale={locale}
            lang={locale}
            aria-label={t(locale)}
            aria-current={locale === currentLocale ? "true" : undefined}
            className="py-2 text-ink-muted transition-colors hover:text-ink aria-[current=true]:text-ink"
          >
            {locale.toUpperCase()}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
}
