import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import TitleBlock from "@/components/blueprint/TitleBlock";
import SheetNumber from "./SheetNumber";

// Pie de página: el cajetín del plano.
export default async function SiteFooter() {
  const t = await getTranslations("Footer");
  const locale = await getLocale();

  return (
    <footer aria-label={t("label")} className="mx-auto mt-24 max-w-6xl px-4 pb-8 sm:px-8">
      <TitleBlock
        fields={[
          { label: t("author"), value: "Albert Batiste Castellet" },
          { label: t("project"), value: "Albert-web" },
          {
            label: t("sheet"),
            value: (
              <Suspense fallback="AB-—">
                <SheetNumber />
              </Suspense>
            ),
          },
          { label: t("scale"), value: "1:1" },
          // Fecha del build (next.config.ts): se actualiza sola en cada despliegue
          { label: t("revision"), value: process.env.NEXT_PUBLIC_BUILD_DATE },
          { label: t("language"), value: locale.toUpperCase() },
        ]}
      />
    </footer>
  );
}
