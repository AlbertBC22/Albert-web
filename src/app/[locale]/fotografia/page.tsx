import { getLocale, getTranslations } from "next-intl/server";
import BlueprintFrame from "@/components/blueprint/BlueprintFrame";
import AlbumCard from "@/components/gallery/AlbumCard";
import PageHeader from "@/components/sections/PageHeader";
import { listGalleryAlbums } from "@/lib/data/gallery";

// Plano AB-03: índice de álbumes publicados.
export default async function PhotographyPage() {
  const t = await getTranslations("Gallery");
  const albums = await listGalleryAlbums(await getLocale());

  return (
    <>
      <PageHeader label={t("label")} title={t("title")} intro={t("intro")} scale="AB-03" />
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-24 sm:px-8">
        {albums.length === 0 ? (
          <BlueprintFrame className="space-y-3 text-center">
            <h2 className="text-h3 font-medium">{t("emptyTitle")}</h2>
            <p className="text-ink-muted">{t("emptyText")}</p>
          </BlueprintFrame>
        ) : (
          <ol className="grid gap-8 md:grid-cols-2">
            {albums.map((album, index) => (
              <AlbumCard key={album.slug} album={album} index={index} />
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
