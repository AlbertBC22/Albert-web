import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import CustomCursor from "@/components/blueprint/CustomCursor";
import GridBackground from "@/components/blueprint/GridBackground";
import Loader from "@/components/layout/Loader";
import LoaderScript from "@/components/layout/LoaderScript";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { routing } from "@/i18n/routing";
import { plexMono, plexSans } from "../fonts";
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
    // suppressHydrationWarning: LoaderScript y el cursor añaden clases a <html> antes de hidratar
    <html lang={locale} className={`${plexSans.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <LoaderScript />
      </head>
      <body>
        <NextIntlClientProvider>
          <GridBackground />
          <Loader />
          <CustomCursor />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
