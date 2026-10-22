"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

// Botones pequeños del panel (mono, entre corchetes). Muestran "…" mientras el formulario envía.

const SMALL =
  "label-mono whitespace-nowrap px-1 py-1 text-ink-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40";

export function SubmitButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`${SMALL} ${className}`}>
      [ {pending ? "…" : children} ]
    </button>
  );
}

// Envío con confirmación (p. ej. borrar). Si se cancela el diálogo, no se envía.
export function ConfirmSubmit({ children, message }: { children: ReactNode; message: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className={`${SMALL} hover:text-red-700`}
    >
      [ {pending ? "…" : children} ]
    </button>
  );
}
