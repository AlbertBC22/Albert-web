import { getLocale, getTranslations } from "next-intl/server";
import AcademicEducation from "@/components/sections/AcademicEducation";
import Certifications from "@/components/sections/Certifications";
import PageHeader from "@/components/sections/PageHeader";
import PlannedEducation from "@/components/sections/PlannedEducation";
import { getCv } from "@/content";
import { SHOW_PLANNED_EDUCATION } from "@/content/flags";

// Plano AB-01: formación académica, certificaciones y (si está activa) formación prevista.
export default async function EducationPage() {
  const t = await getTranslations("Education");
  const cv = getCv(await getLocale());

  return (
    <>
      <PageHeader label={t("label")} title={t("title")} intro={t("intro")} scale="AB-01" />
      <AcademicEducation cv={cv} />
      <Certifications cv={cv} />
      {SHOW_PLANNED_EDUCATION && <PlannedEducation cv={cv} />}
    </>
  );
}
