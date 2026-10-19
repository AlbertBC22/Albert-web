import type { Locale } from "next-intl";
import type { Cv } from "@/types/cv";
import { cvEn } from "./cv.en";
import { cvEs } from "./cv.es";

// Contenido del CV según el idioma.
export function getCv(locale: Locale): Cv {
  return locale === "en" ? cvEn : cvEs;
}
