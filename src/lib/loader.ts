// Utilidades de la pantalla de carga. En un módulo normal (no "use client") para poder
// usarlas desde servidor y cliente.

// Clave de sessionStorage que marca que la pantalla de carga ya se vio en esta sesión.
export const LOADER_STORAGE_KEY = "ab-loader-seen";

// Evento que lanza el loader cuando el plano empieza a abrirse y la web queda a la vista.
export const LOADER_REVEAL_EVENT = "loader:reveal";

// Ejecuta `callback` cuando la web queda a la vista: al momento si no hay pantalla de carga
// (clase loader-off) o ya se está abriendo; si no, cuando el loader avisa. Failsafe a los 6 s.
// Devuelve la función de limpieza. Solo en el navegador.
export function onLoaderReveal(callback: () => void) {
  const html = document.documentElement;
  if (html.classList.contains("loader-off") || html.classList.contains("loader-revealing")) {
    callback();
    return () => {};
  }

  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    callback();
  };
  window.addEventListener(LOADER_REVEAL_EVENT, run, { once: true });
  const failsafe = window.setTimeout(run, 6000);
  return () => {
    window.removeEventListener(LOADER_REVEAL_EVENT, run);
    window.clearTimeout(failsafe);
  };
}
