import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "default" | "accent";

function buttonClass(variant: Variant, className = "") {
  return `bp-button ${variant === "accent" ? "bp-button--accent" : ""} ${className}`;
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

// Botón con estilo de plano (estilos en globals.css → .bp-button).
export function Button({ variant = "default", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

// Enlace interno (localizado) con aspecto de botón.
export function ButtonLink({ variant = "default", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
