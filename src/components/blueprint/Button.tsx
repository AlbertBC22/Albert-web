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

// Garabato en zigzag de arriba abajo. Con preserveAspectRatio="none" se adapta a cualquier
// tamaño de botón. El grosor va en unidades del viewBox (los botones apenas se estiran en
// vertical, así que el trazo horizontal mantiene su grosor). No usar vector-effect aquí:
// rompe el cálculo de pathLength y el garabato se queda a medias.
const SCRIBBLE =
  "M4 6C30 3 70 4 96 5Q99 5.5 96 8C70 11 30 10 5 13Q1 14 5 16C30 18 70 17 95 19Q99 20 95 22C70 25 30 24 5 26Q1 27 5 29C30 31 70 30 96 33";

// Contenido común: garabato (hover), cuatro líneas de construcción que se pasan
// de las esquinas y, opcionalmente, la flecha. Estilos en globals.css → .bp-button.
function ButtonContent({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <svg aria-hidden viewBox="0 0 100 38" preserveAspectRatio="none" className="bp-button__scribble">
        <path d={SCRIBBLE} pathLength={1} />
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
