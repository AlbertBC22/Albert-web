import DimensionLine from "@/components/blueprint/DimensionLine";
import SectionLabel from "@/components/blueprint/SectionLabel";

type Props = {
  label: string; // "Plano de formación"
  title: string;
  intro?: string;
  scale?: string; // valor de la cota, p. ej. "AB-01"
};

// Cabecera de las páginas interiores: REF. 00 — etiqueta, cota y título grande.
export default function PageHeader({ label, title, intro, scale = "1:1" }: Props) {
  return (
    <header className="mx-auto max-w-6xl space-y-8 px-4 pt-16 pb-8 sm:px-8 md:pt-24">
      <SectionLabel index="00">{label}</SectionLabel>
      <DimensionLine value={scale} />
      <h1 className="text-[clamp(2.75rem,7vw,6rem)] leading-none font-medium tracking-[-0.03em]">{title}</h1>
      {intro && <p className="max-w-2xl text-lead text-ink-muted">{intro}</p>}
    </header>
  );
}
