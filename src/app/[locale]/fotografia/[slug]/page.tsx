import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import AlbumGallery from "@/components/gallery/AlbumGallery";
import PageHeader from "@/components/sections/PageHeader";
import { Link } from "@/i18n/navigation";
import { getGalleryAlbum } from "@/lib/data/gallery";

type Props = PageProps<"/[locale]/fotografia/[slug]">;

// El slug solo se conoce al pedir la página: se renderiza dentro de Suspense
// (requisito de cacheComponents). El hueco evita que el pie salte cuando llega el contenido.
export default function AlbumPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <AlbumDetail params={params} />
    </Suspense>
  );
}

async function AlbumDetail({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  const t = await getTranslations("Gallery");
  const album = await getGalleryAlbum(slug, await getLocale());
  if (!album) notFound();

  return (
    <>
      <PageHeader
        label={t("albumLabel")}
        title={album.title}
        intro={album.description ?? undefined}
        scale={t("photoCount", { count: album.photos.length })}
      />
      <div className="mx-auto max-w-6xl space-y-8 px-4 pt-8 pb-24 sm:px-8">
        <AlbumGallery photos={album.photos} />
        <Link href="/fotografia" className="label-mono inline-block text-ink-muted transition-colors hover:text-ink">
          ← {t("back")}
        </Link>
      </div>
    </>
  );
}
