// Retícula milimetrada de fondo: líneas finas cada 16 px y principales cada 80 px.
export default function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundImage: [
          "linear-gradient(to right, var(--grid) 1px, transparent 1px)",
          "linear-gradient(to bottom, var(--grid) 1px, transparent 1px)",
          "linear-gradient(to right, var(--grid-minor) 1px, transparent 1px)",
          "linear-gradient(to bottom, var(--grid-minor) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "80px 80px, 80px 80px, 16px 16px, 16px 16px",
      }}
    />
  );
}
