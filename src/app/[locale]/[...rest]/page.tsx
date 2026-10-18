import { notFound } from "next/navigation";

// Cualquier ruta desconocida dentro de un idioma (p. ej. /es/xyz) muestra el 404 traducido.
export default function CatchAllPage() {
  notFound();
}
