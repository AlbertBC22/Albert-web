import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <>
      <h1>{t("HomePage.title")}</h1>
      <p>{t("Placeholder.notice")}</p>
    </>
  );
}
