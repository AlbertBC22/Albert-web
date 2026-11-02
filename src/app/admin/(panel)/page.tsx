import SectionLabel from "@/components/blueprint/SectionLabel";
import { getDashboardCounts } from "@/lib/data/admin";

// Portada del panel: resumen de lo que hay en la base de datos.
export default async function AdminHomePage() {
  const counts = await getDashboardCounts();

  const cards = [
    { label: "Álbumes", value: String(counts.albums) },
    { label: "Fotos", value: `${counts.photos} / ${counts.photoLimit}` },
    { label: "Proyectos", value: String(counts.projects) },
    { label: "Mensajes sin leer", value: String(counts.unread) },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <SectionLabel index="00">Inicio</SectionLabel>
        <h1 className="text-h2 font-medium">Resumen</h1>
      </div>
      <dl className="grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="space-y-2 border-r border-b border-line bg-paper/70 p-5">
            <dt className="label-mono text-ink-muted">{card.label}</dt>
            <dd className="text-h2 font-light tabular-nums">{card.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
