import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionLabel from "@/components/blueprint/SectionLabel";
import AlbumForm from "@/components/admin/AlbumForm";
import { ConfirmSubmit } from "@/components/admin/buttons";
import PhotoCard from "@/components/admin/PhotoCard";
import PhotoUploader from "@/components/admin/PhotoUploader";
import { getAlbumAdmin, getPhotoUsage } from "@/lib/data/albums";
import { deleteAlbum, updateAlbum } from "../actions";

export const metadata: Metadata = { title: "Editar álbum" };

// Edición de un álbum: datos (ES/EN), subida de fotos, fichas de las fotos y borrado.
export default async function AlbumEditPage({ params }: PageProps<"/admin/albumes/[id]">) {
  const { id } = await params;
  const [album, usage] = await Promise.all([getAlbumAdmin(id), getPhotoUsage()]);
  if (!album) notFound();

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <Link href="/admin/albumes" className="label-mono text-ink-muted hover:text-ink">
          ← Álbumes
        </Link>
        <SectionLabel index="01">{album.is_published ? "Publicado" : "Borrador"}</SectionLabel>
        <h1 className="text-h2 font-medium">{album.title_es}</h1>
      </div>

      <section aria-labelledby="album-data" className="space-y-6">
        <h2 id="album-data" className="text-h3 font-medium">
          Datos del álbum
        </h2>
        <AlbumForm action={updateAlbum.bind(null, album.id)} album={album} submitLabel="Guardar cambios" />
      </section>

      <section aria-labelledby="album-photos" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="album-photos" className="text-h3 font-medium">
            Fotos ({album.photos.length})
          </h2>
          <p className="label-mono text-ink-muted">
            Total del sitio: <span className="text-ink">{usage.count} / {usage.limit}</span>
          </p>
        </div>
        <PhotoUploader
          albumId={album.id}
          albumTitle={{ es: album.title_es, en: album.title_en }}
          used={usage.count}
          limit={usage.limit}
        />
        {album.photos.length > 0 && (
          <ol className="space-y-4">
            {album.photos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isCover={album.cover_photo_id === photo.id}
                isFirst={index === 0}
                isLast={index === album.photos.length - 1}
              />
            ))}
          </ol>
        )}
      </section>

      <section aria-labelledby="danger" className="space-y-3 border-t border-line pt-6">
        <h2 id="danger" className="label-mono text-ink-muted">
          Zona de peligro
        </h2>
        <form action={deleteAlbum.bind(null, album.id)}>
          <ConfirmSubmit message={`¿Borrar el álbum «${album.title_es}» y sus ${album.photos.length} fotos? No se puede deshacer.`}>
            Borrar álbum
          </ConfirmSubmit>
        </form>
      </section>
    </div>
  );
}
