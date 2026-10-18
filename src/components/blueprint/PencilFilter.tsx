// Filtro SVG "trazo a lápiz": leve temblor (desplazamiento) + grano de grafito.
// Se monta una vez en el layout y se aplica con la utilidad CSS `pencil`. Solo para líneas, nunca para texto.
export default function PencilFilter() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <filter id="bp-pencil" x="-20%" y="-50%" width="140%" height="200%">
        {/* Temblor de la mano */}
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="4" result="wobble" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="wobble"
          scale="2.2"
          xChannelSelector="R"
          yChannelSelector="G"
          result="drawn"
        />
        {/* Grano del grafito: recorta la opacidad del trazo con ruido fino */}
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="9" result="grain" />
        <feColorMatrix
          in="grain"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.45"
          result="grainAlpha"
        />
        <feComposite in="drawn" in2="grainAlpha" operator="in" />
      </filter>
    </svg>
  );
}
