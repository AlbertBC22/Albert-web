import { getTranslations } from "next-intl/server";

export default async function PhotographyPage() {
  const t = await getTranslations();

  return (
    <>
      <h1>{t("PhotographyPage.title")}</h1>
      <p>{t("Placeholder.notice")}</p>
    </>
  );
}
