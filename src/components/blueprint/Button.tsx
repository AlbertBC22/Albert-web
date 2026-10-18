import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import Scribble from "./Scribble";

type Variant = "default" | "accent";

type OwnProps = {
  variant?: Variant;
  arrow?: boolean; // flecha que avanza al pasar el ratón
};

function buttonClass(variant: Variant, className = "") {
  return `bp-button ${variant === "accent" ? "bp-button--accent" : ""} ${className}`;
}

// Contenido común: garabato de rotulador (hover, ver Scribble.tsx), cuatro líneas de
// construcción que se pasan de las esquinas y, opcionalmente, la flecha.
// Estilos en globals.css → .bp-button.
function ButtonContent({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <Scribble />
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
