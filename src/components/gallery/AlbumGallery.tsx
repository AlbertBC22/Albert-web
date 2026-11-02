"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import ScanReveal from "@/components/motion/ScanReveal";
import type { GalleryPhoto } from "@/lib/data/gallery";
import { PHOTOS_BUCKET, publicStorageUrl } from "@/lib/supabase/storage";
import Lightbox from "./Lightbox";

// Altura aproximada de cada fila: decide cuántas fotos caben antes de saltar a la siguiente.
const ROW_HEIGHT_REM = 20;

// Filas justificadas solo con CSS: cada foto crece según su proporción, así que ninguna se
// recorta y se mantiene el orden del panel. El último hueco evita que una foto suelta en la
// última fila se estire a todo el ancho; si la fila ya está llena, salta a otra línea sin molestar.
export default function AlbumGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  // El foco vuelve a la foto que se estaba viendo. Hace falta que el diálogo ya no esté.
  function close() {
    const index = openIndex;
    flushSync(() => setOpenIndex(null));
    if (index !== null) triggers.current[index]?.focus();
  }

  return (
    <>
      <ol className="flex flex-wrap gap-3">
        {photos.map((photo, index) => {
          const ratio = photo.width / photo.height;
          return (
            <li key={photo.id} style={{ flexGrow: ratio, flexBasis: `${ratio * ROW_HEIGHT_REM}rem` }} className="min-w-0">
              <button
                ref={(element) => {
                  triggers.current[index] = element;
                }}
                type="button"
                onClick={() => setOpenIndex(index)}
                className="block w-full"
              >
                <ScanReveal className="border border-line bg-sky-soft/30" aspectRatio={ratio}>
                  <Image
                    src={publicStorageUrl(PHOTOS_BUCKET, photo.path)}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </ScanReveal>
              </button>
            </li>
          );
        })}
        <li aria-hidden className="grow-[1.5] basis-32" />
      </ol>

      {openIndex !== null && (
        <Lightbox
          photos={photos}
          index={openIndex}
          onNavigate={(step) => setOpenIndex((openIndex + step + photos.length) % photos.length)}
          onClose={close}
        />
      )}
    </>
  );
}
