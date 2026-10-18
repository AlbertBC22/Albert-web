import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "default" | "accent";

type OwnProps = {
  variant?: Variant;
  arrow?: boolean; // flecha que avanza al pasar el ratón
};

function buttonClass(variant: Variant, className = "") {
  return `bp-button ${variant === "accent" ? "bp-button--accent" : ""} ${className}`;
}

// Garabato en zigzag vertical que avanza de izquierda a derecha, como un solo trazo de
// rotulador. Se dibuja a escala real (1 unidad ≈ 1 px, 40 de alto) y más largo que
// cualquier botón: con preserveAspectRatio="xMinYMid slice" cada botón muestra solo el
// tramo que le cabe, así la separación entre pasadas es la misma en todos (~8 px).
// Los extremos y el avance varían un poco para que parezca hecho a mano.
const SCRIBBLE_WIDTH = 480;
const SCRIBBLE = (() => {
  const tops = [5, 3, 7, 4, 6, 3];
  const bottoms = [35, 37, 33, 36, 34, 37];
  const steps = [7, 9, 7.5, 8.5, 7, 8.5];
  let d = "M2 5";
  for (let i = 1, x = 8; x <= SCRIBBLE_WIDTH; i++, x += steps[i % 6]) {
    const y = i % 2 ? bottoms[i % 6] : tops[i % 6];
    d += ` L${x} ${y}`;
  }
  return d;
})();

// Contenido común: garabato (hover), cuatro líneas de construcción que se pasan
// de las esquinas y, opcionalmente, la flecha. Estilos en globals.css → .bp-button.
function ButtonContent({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <svg
        aria-hidden
        viewBox={`0 0 ${SCRIBBLE_WIDTH} 40`}
        preserveAspectRatio="xMinYMid slice"
        className="bp-button__scribble"
      >
        <path d={SCRIBBLE} />
      </svg>
      <svg aria-hidden className="bp-button__lines">
        <line x1="0" y1="8" x2="100%" y2="8" />
        <line x1="8" y1="0" x2="8" y2="100%" />
        <g transform="translate(0 -8)">
          <line x1="0" y1="100%" x2="100%" y2="100%" />
        </g>
        <g transform="translate(-8 0)">
          <line x1="100%" y1="0" x2="100%" y2="100%" />
        </g>
      </svg>
      <span>{children}</span>
      {arrow && (
        <svg aria-hidden viewBox="0 0 24 10" className="bp-button__arrow">
          <path d="M1 5h21M17.5 1 22 5l-4.5 4" />
        </svg>
      )}
    </>
  );
}

type ButtonProps = ComponentProps<"button"> & OwnProps;

// Botón con estilo de plano.
export function Button({ variant = "default", arrow, className, type = "button", children, ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, className)} {...props}>
      <ButtonContent arrow={arrow}>{children}</ButtonContent>
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & OwnProps;

// Enlace interno (localizado) con aspecto de botón.
export function ButtonLink({ variant = "default", arrow, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, className)} {...props}>
      <ButtonContent arrow={arrow}>{children}</ButtonContent>
    </Link>
  );
}
