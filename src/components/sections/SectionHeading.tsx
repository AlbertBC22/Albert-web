import SectionLabel from "@/components/blueprint/SectionLabel";

type Props = {
  index: string; // "01"
  label: string;
  title: string;
  id: string; // id del <h2>, para aria-labelledby de la sección
};

// Encabezado de sección: REF. 01 — PERFIL + título.
export default function SectionHeading({ index, label, title, id }: Props) {
  return (
    <div className="space-y-3">
      <SectionLabel index={index}>{label}</SectionLabel>
      <h2 id={id} className="text-h2 font-medium">
        {title}
      </h2>
    </div>
  );
}
