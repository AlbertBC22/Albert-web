import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

type Props = PageProps<"/[locale]/fotografia/[slug]">;

// El slug solo se conoce al pedir la página: se renderiza dentro de Suspense
// (requisito de cacheComponents). En la Fase 7 vendrá de Supabase.
export default function AlbumPage({ params }: Props) {
  return (
    <Suspense>
      <AlbumDetail params={params} />
    </Suspense>
  );
}

async function AlbumDetail({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-16 sm:px-8">
      <h1>{t("AlbumPage.title", { slug })}</h1>
      <p>{t("Placeholder.notice")}</p>
    </div>
  );
}
