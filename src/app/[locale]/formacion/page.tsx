import { getTranslations } from "next-intl/server";

export default async function EducationPage() {
  const t = await getTranslations();

  return (
    <>
      <h1>{t("EducationPage.title")}</h1>
      <p>{t("Placeholder.notice")}</p>
    </>
  );
}
