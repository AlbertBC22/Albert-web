import type { z } from "zod";

// Utilidades de las Server Actions del panel (van aparte porque un archivo "use server"
// solo puede exportar funciones asíncronas).

export type FormState = { error: string | null; ok?: boolean };

export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// "Viaje a Islandia 2024" → "viaje-a-islandia-2024"
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "Revisa los datos del formulario.";
}

export function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export function textOrNull(formData: FormData, name: string) {
  return text(formData, name) || null;
}

// Vacío → null; si no es un número → NaN, que zod rechaza.
export function numberOrNull(formData: FormData, name: string) {
  const value = text(formData, name);
  return value ? Number(value) : null;
}
