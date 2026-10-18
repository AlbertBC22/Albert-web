import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import HeaderNav from "./HeaderNav";

// Cabecera: firma a la izquierda e índice de planos + idioma a la derecha.
export default async function SiteHeader() {
  const t = await getTranslations("Header");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-8">
        <Link href="/" className="label-mono leading-tight">
          <span className="block text-ink">Albert Batiste</span>
          <span className="block text-ink-muted">{t("role")}</span>
        </Link>
        {/* Suspense: en rutas dinámicas ([slug]) la URL solo se conoce al recibir la petición. */}
        <Suspense>
          <HeaderNav />
        </Suspense>
      </div>
    </header>
  );
}
