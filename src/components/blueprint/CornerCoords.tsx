type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type Props = {
  x: number;
  y: number;
  corner?: Corner;
};

// A la altura de la marca de esquina, desplazadas hacia dentro para no pisarla.
const POSITIONS: Record<Corner, string> = {
  "top-left": "-top-1.5 left-7",
  "top-right": "-top-1.5 right-7",
  "bottom-left": "-bottom-1.5 left-7",
  "bottom-right": "-bottom-1.5 right-7",
};

// Coordenadas decorativas en una esquina: [0,246]. El contenedor debe ser `relative`.
export default function CornerCoords({ x, y, corner = "top-left" }: Props) {
  return (
    <span aria-hidden className={`label-mono absolute text-ink-muted ${POSITIONS[corner]}`}>
      [{x},{y}]
    </span>
  );
}
