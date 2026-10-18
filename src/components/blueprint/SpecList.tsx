import type { ReactNode } from "react";

export type SpecItem = {
  label: string;
  value: ReactNode;
};

type Props = {
  items: SpecItem[];
  className?: string;
};

// Ficha clave–valor: ROL : Software Developer
export default function SpecList({ items, className = "" }: Props) {
  return (
    <dl className={`border-y border-line ${className}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-[minmax(7rem,max-content)_auto_1fr] items-baseline gap-x-3 border-b border-line py-2 last:border-b-0"
        >
          <dt className="label-mono text-ink-muted">{item.label}</dt>
          <span aria-hidden className="label-mono text-ink-muted">:</span>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
