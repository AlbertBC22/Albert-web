"use client";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import CustomCursor from "@/components/blueprint/CustomCursor";
import DimensionLine from "@/components/blueprint/DimensionLine";
import SpecList from "@/components/blueprint/SpecList";
import type { GalleryPhoto } from "@/lib/data/gallery";
import { PHOTOS_BUCKET, publicStorageUrl } from "@/lib/supabase/storage";

type Props = {
  photos: GalleryPhoto[];
  index: number;
  onNavigate: (step: 1 | -1) => void;
  onClose: () => void;
};

const SWIPE_PX = 50;
const NAV_BUTTON = "label-mono min-h-11 min-w-11 whitespace-nowrap px-1.5 text-ink-muted transition-colors hover:text-ink sm:px-3";

// Visor a pantalla completa con <dialog> nativo, que ya atrapa el foco y cierra con Esc.
// Flechas del teclado y deslizar para navegar; ficha técnica al lado (debajo en móvil).
export default function Lightbox({ photos, index, onNavigate, onClose }: Props) {
  const t = useTranslations("Gallery.lightbox");
  const format = useFormatter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const photo = photos[index];
  const ratio = photo.width / photo.height;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    // El fondo no se desplaza mientras el visor está abierto
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") onNavigate(1);
    if (event.key === "ArrowLeft") onNavigate(-1);
  }

  function onPointerDown(event: PointerEvent) {
    swipeStart.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: PointerEvent) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) onNavigate(dx < 0 ? 1 : -1);
  }

  const specs = [
    { label: t("camera"), value: photo.camera },
    { label: t("lens"), value: photo.lens },
    { label: t("focal"), value: photo.focalLengthMm && `${photo.focalLengthMm} mm` },
    { label: t("aperture"), value: photo.aperture && `f/${photo.aperture}` },
    { label: t("shutter"), value: photo.shutterSpeed },
    { label: t("iso"), value: photo.iso },
    { label: t("date"), value: photo.takenAt && format.dateTime(new Date(photo.takenAt), { dateStyle: "long" }) },
  ].filter((spec) => spec.value);

  return (
    <dialog
      ref={dialogRef}
      aria-label={photo.title ?? photo.alt}
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none overflow-y-auto bg-paper text-ink"
    >
      {/* El cursor de la página queda debajo del diálogo (capa superior del navegador) */}
      <CustomCursor nested />

      <div className="grid min-h-full grid-rows-[auto_1fr] lg:grid-cols-[minmax(0,1fr)_22rem]">
        <header className="flex items-center justify-between border-b border-line px-4 py-1 lg:col-span-2 sm:px-8">
          <p aria-live="polite" className="label-mono whitespace-nowrap text-ink-muted">
            {t("position", { current: index + 1, total: photos.length })}
          </p>
          <div className="flex items-center">
            <button type="button" onClick={() => onNavigate(-1)} aria-label={t("previous")} className={NAV_BUTTON}>
              [ ← ]
            </button>
            <button type="button" onClick={() => onNavigate(1)} aria-label={t("next")} className={NAV_BUTTON}>
              [ → ]
            </button>
            <button type="button" onClick={onClose} className={NAV_BUTTON}>
              [ {t("close")} ]
            </button>
          </div>
        </header>

        <div
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
          className="flex touch-pan-y items-center justify-center p-4 sm:p-8"
        >
          {/* Ancho máximo para que la foto y sus cotas quepan en la altura de la pantalla */}
          <div
            className="grid w-full grid-cols-[auto_minmax(0,1fr)] gap-2"
            style={{ maxWidth: `calc((100dvh - 10rem) * ${ratio} + 2rem)` }}
          >
            <span />
            <DimensionLine value={`${photo.width} PX`} animated={false} />
            <DimensionLine value={`${photo.height} PX`} orientation="vertical" animated={false} />
            <div className="relative border border-line bg-sky-soft/30" style={{ aspectRatio: ratio }}>
              {/* Sin eventos de puntero: sobre la foto abierta el cursor no debe decir "VER" */}
              <Image
                key={photo.id}
                src={publicStorageUrl(PHOTOS_BUCKET, photo.path)}
                alt={photo.alt}
                fill
                priority
                sizes="(min-width: 1024px) calc(100vw - 26rem), 100vw"
                className="pointer-events-none object-contain select-none"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-4 border-t border-line p-4 sm:px-8 lg:border-t-0 lg:border-l lg:py-8">
          {photo.title && <h2 className="text-h3 font-medium">{photo.title}</h2>}
          {specs.length > 0 && (
            <>
              <p className="label-mono text-ink-muted">{t("specs")}</p>
              <SpecList items={specs} />
            </>
          )}
        </aside>
      </div>
    </dialog>
  );
}
