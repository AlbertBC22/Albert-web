import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// 404 traducido. La versión con estilo de plano llega en la Fase 10.
export default async function NotFoundPage() {
  const t = await getTranslations("NotFoundPage");

  return (
    <>
      <h1>{t("title")}</h1>
      <Link href="/">{t("back")}</Link>
    </>
  );
}
