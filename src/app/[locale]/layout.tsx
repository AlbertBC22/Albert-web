import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import SiteNav from "@/components/layout/SiteNav";
import { routing } from "@/i18n/routing";
import "../globals.css";

// Pre-renderiza la web en todos los idiomas.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return { title: t("title"), description: t("description") };
}

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <SiteNav />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
