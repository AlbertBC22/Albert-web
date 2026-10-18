import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

// Navegación mínima provisional. El diseño definitivo llega en la Fase 2.
export default async function SiteNav() {
  const t = await getTranslations("Nav");

  return (
    <header>
      <nav aria-label={t("label")}>
        <ul>
          <li><Link href="/">{t("home")}</Link></li>
          <li><Link href="/formacion">{t("education")}</Link></li>
          <li><Link href="/proyectos">{t("projects")}</Link></li>
          <li><Link href="/fotografia">{t("photography")}</Link></li>
          <li><Link href="/contacto">{t("contact")}</Link></li>
        </ul>
      </nav>
      {/* Suspense: en rutas dinámicas ([slug]) la URL solo se conoce al recibir la petición. */}
      <Suspense>
        <LocaleSwitcher />
      </Suspense>
    </header>
  );
}
