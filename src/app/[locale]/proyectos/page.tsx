import { getTranslations } from "next-intl/server";

export default async function ProjectsPage() {
  const t = await getTranslations();

  return (
    <>
      <h1>{t("ProjectsPage.title")}</h1>
      <p>{t("Placeholder.notice")}</p>
    </>
  );
}
