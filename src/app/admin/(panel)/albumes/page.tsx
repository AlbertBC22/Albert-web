import type { Metadata } from "next";
import Link from "next/link";
import SectionLabel from "@/components/blueprint/SectionLabel";
import AlbumForm from "@/components/admin/AlbumForm";
import { SubmitButton } from "@/components/admin/buttons";
import { getPhotoUsage, listAlbumsAdmin } from "@/lib/data/albums";
import { createAlbum, moveAlbum, setAlbumPublished } from "./actions";

export const metadata: Metadata = { title: "Álbumes" };

// Lista de álbumes: orden, estado, nº de fotos y alta de álbumes nuevos.
export default async function AlbumsPage() {
  const [albums, usage] = await Promise.all([listAlbumsAdmin(), getPhotoUsage()]);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <SectionLabel index="01">Álbumes y fotos</SectionLabel>
          <h1 className="text-h2 font-medium">Álbumes</h1>
        </div>
        <p className="label-mono text-ink-muted">
          Fotos: <span className="text-ink">{usage.count} / {usage.limit}</span>
        </p>
      </div>

      {albums.length === 0 ? (
        <p className="text-ink-muted">Todavía no hay álbumes.</p>
      ) : (
        <ol className="divide-y divide-line border-y border-line">
          {albums.map((album, index) => (
            <li key={album.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
              <span className="label-mono w-8 text-sky-ink">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/albumes/${album.id}`} className="font-medium underline-offset-4 hover:underline">
                  {album.title_es}
                </Link>
                <p className="label-mono text-ink-muted normal-case">
                  /{album.slug} · {album.photoCount} {album.photoCount === 1 ? "foto" : "fotos"}
                </p>
              </div>
              <span className={`label-mono ${album.is_published ? "text-sky-ink" : "text-ink-muted"}`}>
                {album.is_published ? "Publicado" : "Borrador"}
              </span>
              <div className="flex items-center">
                <form action={setAlbumPublished.bind(null, album.id, !album.is_published)}>
                  <SubmitButton>{album.is_published ? "Despublicar" : "Publicar"}</SubmitButton>
                </form>
                <form action={moveAlbum.bind(null, album.id, "up")}>
                  <SubmitButton className={index === 0 ? "invisible" : ""}>↑</SubmitButton>
                </form>
                <form action={moveAlbum.bind(null, album.id, "down")}>
                  <SubmitButton className={index === albums.length - 1 ? "invisible" : ""}>↓</SubmitButton>
                </form>
              </div>
            </li>
          ))}
        </ol>
      )}

      <section aria-labelledby="new-album" className="space-y-6 border border-line bg-paper/70 p-6">
        <h2 id="new-album" className="text-h3 font-medium">
          Nuevo álbum
        </h2>
        <AlbumForm action={createAlbum} submitLabel="Crear álbum" />
      </section>
    </div>
  );
}
