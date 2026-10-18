import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

// Nota de plano con punto y línea guía: ●——— texto
export default function Annotation({ children, className = "" }: Props) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <span aria-hidden className="pencil mt-[0.2rem] flex shrink-0 items-center text-sky">
        <span className="size-1.5 rounded-full bg-current" />
        <span className="pencil-line-x w-10" />
      </span>
      <p className="label-mono text-ink-muted">{children}</p>
    </div>
  );
}
