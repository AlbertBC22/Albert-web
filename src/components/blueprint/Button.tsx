import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "default" | "accent";

type OwnProps = {
  variant?: Variant;
  arrow?: boolean; // flecha dibujada a mano que avanza al pasar el ratón
};

function buttonClass(variant: Variant, className = "") {
  return `bp-button ${variant === "accent" ? "bp-button--accent" : ""} ${className}`;
}

// Contenido común: rayado de sección (hover), cuatro líneas de construcción que se
// pasan de las esquinas y, opcionalmente, la flecha. Estilos en globals.css → .bp-button.
function ButtonContent({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span aria-hidden className="bp-button__hatch pencil" />
      <svg aria-hidden className="bp-button__lines pencil">
        <line x1="0" y1="8" x2="100%" y2="7.4" pathLength={1} />
        <line x1="8.4" y1="0" x2="8" y2="100%" pathLength={1} />
        <g transform="translate(0 -8)">
          <line x1="0" y1="100%" x2="100%" y2="100%" pathLength={1} />
        </g>
        <g transform="translate(-8 0)">
          <line x1="100%" y1="0" x2="100%" y2="100%" pathLength={1} />
        </g>
      </svg>
      <span>{children}</span>
      {arrow && (
        <svg aria-hidden viewBox="0 0 24 10" className="bp-button__arrow pencil">
          <path d="M1 5.4C7 4.8 15 5.3 22 5M17.6 1.6 22 5l-4.3 3.5" />
        </svg>
      )}
    </>
  );
}

type ButtonProps = ComponentProps<"button"> & OwnProps;

// Botón con estilo de plano dibujado a mano.
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
