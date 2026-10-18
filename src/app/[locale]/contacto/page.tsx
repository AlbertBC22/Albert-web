import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations();

  return (
    <>
      <h1>{t("ContactPage.title")}</h1>
      <p>{t("Placeholder.notice")}</p>
    </>
  );
}
