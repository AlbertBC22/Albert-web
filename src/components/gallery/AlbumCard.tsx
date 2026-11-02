import Image from "next/image";
import { getTranslations } from "next-intl/server";
import BlueprintFrame from "@/components/blueprint/BlueprintFrame";
import SpecList from "@/components/blueprint/SpecList";
import ScanReveal from "@/components/motion/ScanReveal";
import { Link } from "@/i18n/navigation";
import type { GalleryAlbumCard } from "@/lib/data/gallery";
import { PHOTOS_BUCKET, publicStorageUrl } from "@/lib/supabase/storage";

type Props = {
  album: GalleryAlbumCard;
  index: number;
};

// Lámina de un álbum en el índice: portada, título, nº de fotos y año.
export default async function AlbumCard({ album, index }: Props) {
  const t = await getTranslations("Gallery");

  return (
    <li>
      <BlueprintFrame className="h-full">
        <Link href={{ pathname: "/fotografia/[slug]", params: { slug: album.slug } }} className="group block space-y-5">
          <ScanReveal className="aspect-[3/2] border border-line bg-sky-soft/30">
            <Image
              src={publicStorageUrl(PHOTOS_BUCKET, album.coverPath)}
              alt={album.coverAlt}
              fill
              sizes="(min-width: 1152px) 480px, (min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </ScanReveal>
          <h2 className="flex items-baseline gap-3 text-h3 font-medium underline-offset-4 group-hover:underline">
            <span className="label-mono text-sky-ink">[{String(index + 1).padStart(2, "0")}]</span>
            {album.title}
          </h2>
        </Link>
        <SpecList
          className="mt-4"
          items={[
            { label: t("photosLabel"), value: album.photoCount },
            ...(album.year ? [{ label: t("yearLabel"), value: album.year }] : []),
          ]}
        />
      </BlueprintFrame>
    </li>
  );
}
