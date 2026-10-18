type Props = {
  index: string; // "02"
  children: string; // "Experiencia"
  className?: string;
};

// Etiqueta de sección: REF. 02 — EXPERIENCIA
export default function SectionLabel({ index, children, className = "" }: Props) {
  return (
    <p className={`label-mono flex items-center gap-3 text-ink-muted ${className}`}>
      <span className="text-sky-ink">REF. {index}</span>
      <span aria-hidden className="pencil pencil-line-x w-8 text-ink" />
      <span>{children}</span>
    </p>
  );
}
