import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

// Resalte con el degradado azul cielo. Solo para elementos destacados (cifras, rol actual, CTA).
export default function AccentHighlight({ children, className = "" }: Props) {
  return (
    <span
      className={`-mx-1 px-1 box-decoration-clone ${className}`}
      style={{ backgroundImage: "var(--gradient-accent)" }}
    >
      {children}
    </span>
  );
}
