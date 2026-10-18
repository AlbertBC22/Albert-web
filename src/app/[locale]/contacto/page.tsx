import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-16 sm:px-8">
      <h1>{t("ContactPage.title")}</h1>
      <p>{t("Placeholder.notice")}</p>
    </div>
  );
}
