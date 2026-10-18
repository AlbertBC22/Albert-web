import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

// Nota de plano con punto y línea guía: ●——— texto
export default function Annotation({ children, className = "" }: Props) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <span aria-hidden className="mt-[0.45rem] flex shrink-0 items-center">
        <span className="size-1.5 rounded-full bg-sky" />
        <span className="h-px w-10 bg-sky" />
      </span>
      <p className="label-mono text-ink-muted">{children}</p>
    </div>
  );
}
