import type { ReactNode } from "react";

export type TitleBlockField = {
  label: string;
  value: ReactNode;
};

type Props = {
  fields: TitleBlockField[];
  className?: string;
};

// Cajetín de plano: rejilla de celdas con etiqueta y valor (autor, nº de plano, escala...).
export default function TitleBlock({ fields, className = "" }: Props) {
  return (
    <dl
      className={`grid grid-cols-2 border-t border-l border-stroke sm:grid-cols-3 lg:grid-cols-6 ${className}`}
    >
      {fields.map((field) => (
        <div key={field.label} className="border-r border-b border-stroke px-3 py-2">
          <dt className="label-mono text-ink-muted">{field.label}</dt>
          <dd className="mt-1 font-mono text-sm">{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}
