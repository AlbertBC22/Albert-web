import { LOADER_STORAGE_KEY } from "@/lib/loader";

// Se ejecuta en el <head> antes de pintar:
// - añade la clase "js" (los estados iniciales de las animaciones solo se aplican con JS);
// - si el loader ya se vio en esta sesión, si el usuario pide movimiento reducido o si no hay
//   sessionStorage, lo oculta (clase loader-off) para que no parpadee.
// Sin JavaScript, <noscript> oculta el loader igualmente.
const script = `document.documentElement.classList.add("js");try{if(sessionStorage.getItem("${LOADER_STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("loader-off")}catch(e){document.documentElement.classList.add("loader-off")}`;

export default function LoaderScript() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <noscript>
        <style>{".bp-loader{display:none}"}</style>
      </noscript>
    </>
  );
}
