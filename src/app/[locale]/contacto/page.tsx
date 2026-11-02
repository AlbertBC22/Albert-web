import { getLocale, getTranslations } from "next-intl/server";
import ExternalLink from "@/components/blueprint/ExternalLink";
import SpecList from "@/components/blueprint/SpecList";
import ContactForm from "@/components/contact/ContactForm";
import PageHeader from "@/components/sections/PageHeader";
import { getCv } from "@/content";

// Plano AB-04: formulario de contacto y otras vías (sin email ni teléfono públicos).
export default async function ContactPage() {
  const t = await getTranslations("Contact");
  const tCommon = await getTranslations("Common");
  const cv = getCv(await getLocale());

  return (
    <>
      <PageHeader label={t("label")} title={t("title")} intro={t("intro")} scale="AB-04" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-8 pb-24 sm:px-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ContactForm />
        <aside>
          <SpecList
            items={[
              { label: t("location"), value: cv.location },
              {
                label: t("links"),
                value: (
                  <span className="flex flex-wrap gap-x-4">
                    <ExternalLink href={cv.links.linkedin} newTabLabel={tCommon("newTab")}>LinkedIn</ExternalLink>
                    <ExternalLink href={cv.links.github} newTabLabel={tCommon("newTab")}>GitHub</ExternalLink>
                  </span>
                ),
              },
            ]}
          />
        </aside>
      </div>
    </>
  );
}
