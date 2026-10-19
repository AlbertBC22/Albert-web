type Props = {
  href: string;
  newTabLabel: string; // texto para lectores de pantalla: "(se abre en una pestaña nueva)"
  children: string;
};

// Enlace externo: se abre en otra pestaña, con flecha ↗ y aviso para lectores de pantalla.
export default function ExternalLink({ href, newTabLabel, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
    >
      {children} <span aria-hidden>↗</span>
      <span className="sr-only">{newTabLabel}</span>
    </a>
  );
}
