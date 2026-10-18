// Media query para gsap.matchMedia(): las animaciones solo se crean si el usuario no pide movimiento reducido.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

// Para lógica fuera de GSAP (cursor, pantalla de carga). Solo en el navegador.
export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
