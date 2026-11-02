import exifr from "exifr";

// Procesado de una foto en el navegador antes de subirla:
// 1. Lee el EXIF permitido (cámara, objetivo, focal, apertura, velocidad, ISO, fecha). Nunca GPS.
// 2. Redimensiona a 2.500 px como máximo en el lado largo, respetando la orientación EXIF.
// 3. Re-codifica con canvas (WebP o, si el navegador no sabe, JPEG; calidad 0,85). El archivo
//    resultante NO lleva ningún metadato: ni GPS ni nada del EXIF original.

const MAX_SIDE = 2500;
const QUALITY = 0.85;

export type PhotoExif = {
  camera_make: string | null;
  camera_model: string | null;
  lens: string | null;
  focal_length_mm: number | null;
  aperture: number | null;
  shutter_speed: string | null;
  iso: number | null;
  taken_at: string | null; // ISO 8601
};

export type ProcessedPhoto = {
  blob: Blob;
  extension: "webp" | "jpg";
  width: number;
  height: number;
  exif: PhotoExif;
};

export async function processPhoto(file: File): Promise<ProcessedPhoto> {
  const exif = await readExif(file);

  // imageOrientation: "from-image" aplica la rotación del EXIF antes de dibujar
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("El navegador no permite procesar imágenes.");
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Safari no codifica WebP con canvas (devuelve PNG): en ese caso, JPEG.
  let blob = await canvasToBlob(canvas, "image/webp");
  let extension: ProcessedPhoto["extension"] = "webp";
  if (blob.type !== "image/webp") {
    blob = await canvasToBlob(canvas, "image/jpeg");
    extension = "jpg";
  }

  return { blob, extension, width, height, exif };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("No se ha podido codificar la imagen."))), type, QUALITY),
  );
}

const EMPTY_EXIF: PhotoExif = {
  camera_make: null,
  camera_model: null,
  lens: null,
  focal_length_mm: null,
  aperture: null,
  shutter_speed: null,
  iso: null,
  taken_at: null,
};

async function readExif(file: File): Promise<PhotoExif> {
  try {
    const tags = await exifr.parse(file, {
      gps: false, // nunca leer la ubicación
      pick: ["Make", "Model", "LensModel", "FocalLength", "FNumber", "ExposureTime", "ISO", "DateTimeOriginal"],
    });
    if (!tags) return EMPTY_EXIF;

    return {
      camera_make: text(tags.Make, 80),
      camera_model: text(tags.Model, 80),
      lens: text(tags.LensModel, 120),
      focal_length_mm: positive(tags.FocalLength, 1),
      aperture: positive(tags.FNumber, 1),
      shutter_speed: formatShutter(tags.ExposureTime),
      iso: typeof tags.ISO === "number" && tags.ISO > 0 ? Math.round(tags.ISO) : null,
      taken_at: tags.DateTimeOriginal instanceof Date && !Number.isNaN(tags.DateTimeOriginal.getTime())
        ? tags.DateTimeOriginal.toISOString()
        : null,
    };
  } catch {
    return EMPTY_EXIF; // sin EXIF o ilegible: la foto se sube igual
  }
}

function text(value: unknown, max: number) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;
}

function positive(value: unknown, decimals: number) {
  if (typeof value !== "number" || !(value > 0)) return null;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

// 0.004 → "1/250"; 2 → "2s"
function formatShutter(value: unknown) {
  if (typeof value !== "number" || !(value > 0)) return null;
  if (value >= 1) return `${Math.round(value * 10) / 10}s`;
  return `1/${Math.round(1 / value)}`;
}
