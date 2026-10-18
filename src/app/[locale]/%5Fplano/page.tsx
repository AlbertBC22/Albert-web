import type { Metadata } from "next";
import type { ReactNode } from "react";
import AccentHighlight from "@/components/blueprint/AccentHighlight";
import Annotation from "@/components/blueprint/Annotation";
import BlueprintFrame from "@/components/blueprint/BlueprintFrame";
import { Button, ButtonLink } from "@/components/blueprint/Button";
import CornerCoords from "@/components/blueprint/CornerCoords";
import DimensionLine from "@/components/blueprint/DimensionLine";
import SectionLabel from "@/components/blueprint/SectionLabel";
import SpecList from "@/components/blueprint/SpecList";
import TitleBlock from "@/components/blueprint/TitleBlock";

// Página interna para revisar el sistema de diseño. No se indexa ni aparece en el menú.
// La carpeta se llama %5Fplano porque las carpetas con "_" son privadas en Next.js.
export const metadata: Metadata = {
  title: "Plano — sistema de diseño",
  robots: { index: false, follow: false },
};

const COLORS = [
  { token: "--paper", hex: "#FFFFFF", use: "Fondo" },
  { token: "--ink", hex: "#0A0A0A", use: "Texto y líneas" },
  { token: "--ink-muted", hex: "#5A5A5A", use: "Texto secundario" },
  { token: "--line", hex: "rgba(10,10,10,.14)", use: "Separadores" },
  { token: "--grid", hex: "rgba(56,189,248,.10)", use: "Retícula" },
  { token: "--sky", hex: "#38BDF8", use: "Acento gráfico" },
  { token: "--sky-soft", hex: "#E0F2FE", use: "Fondos de resalte" },
  { token: "--sky-ink", hex: "#0369A1", use: "Texto azul" },
];

const TYPE_SCALE = [
  { name: "display", className: "text-display font-light", sample: "2+" },
  { name: "h1", className: "text-h1 font-medium", sample: "Albert Batiste" },
  { name: "h2", className: "text-h2 font-medium", sample: "Experiencia" },
  { name: "h3", className: "text-h3 font-medium", sample: "Software Developer — BeonDev" },
  { name: "lead", className: "text-lead", sample: "Técnico que no se queda en el código." },
  { name: "body", className: "text-base", sample: "Desarrollo de APIs en .NET 8, frontend con Angular y bases de datos SQL Server." },
  { name: "label", className: "label-mono", sample: "REF. 02 — Experiencia" },
];

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-24 px-4 py-16 sm:px-8">

      <header className="space-y-4">
        <SectionLabel index="00">Sistema de diseño</SectionLabel>
        <h1 className="text-h1 font-medium">Plano técnico</h1>
        <p className="max-w-2xl text-lead text-ink-muted">
          Página interna para revisar tokens y componentes. Haz scroll: los marcos y las cotas se
          trazan al entrar en pantalla.
        </p>
      </header>

      <Section index="01" title="Color">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {COLORS.map((color) => (
            <div key={color.token} className="border border-line bg-paper">
              <div className="h-16 border-b border-line" style={{ background: `var(${color.token})` }} />
              <div className="p-3">
                <p className="font-mono text-sm">{color.token}</p>
                <p className="label-mono text-ink-muted">{color.hex}</p>
                <p className="mt-1 text-sm">{color.use}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6">
          Degradado de acento: <AccentHighlight>rol actual o cifra destacada</AccentHighlight>.
        </p>
      </Section>

      <Section index="02" title="Tipografía">
        <div className="divide-y divide-line border-y border-line">
          {TYPE_SCALE.map((item) => (
            <div key={item.name} className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr] sm:items-baseline">
              <p className="label-mono text-ink-muted">{item.name}</p>
              <p className={item.className}>{item.sample}</p>
            </div>
          ))}
        </div>
        <Annotation className="mt-6">IBM Plex Sans (texto) · IBM Plex Mono (etiquetas, cotas y datos)</Annotation>
      </Section>

      <Section index="03" title="Marco y coordenadas">
        <BlueprintFrame className="bg-paper/60">
          <CornerCoords x={0} y={246} corner="top-right" />
          <CornerCoords x={1280} y={0} corner="bottom-left" />
          <div className="py-12 text-center">
            <p className="label-mono text-ink-muted">Lámina</p>
            <p className="text-h2 font-medium">Contenido enmarcado</p>
          </div>
        </BlueprintFrame>
      </Section>

      <Section index="04" title="Cotas">
        <div className="space-y-10">
          <DimensionLine value="2.500 px" />
          <div className="flex h-64 gap-8">
            <DimensionLine value="1:1" orientation="vertical" />
            <div className="flex flex-1 items-center justify-center border border-dashed border-line">
              <p className="label-mono text-ink-muted">Bloque acotado</p>
            </div>
          </div>
        </div>
      </Section>

      <Section index="05" title="Ficha y anotaciones">
        <div className="grid gap-10 md:grid-cols-2">
          <SpecList
            items={[
              { label: "Rol", value: <AccentHighlight>Software Developer</AccentHighlight> },
              { label: "Stack", value: ".NET 8 · Angular · SQL Server" },
              { label: "Ubicación", value: "Barcelona" },
              { label: "Estado", value: "Activo" },
            ]}
          />
          <div className="space-y-4">
            <Annotation>Cofundador de Chimera Applications</Annotation>
            <Annotation>API de NITS construida desde cero</Annotation>
            <Annotation>App publicada en iOS y Android</Annotation>
          </div>
        </div>
      </Section>

      <Section index="06" title="Botones">
        <div className="flex flex-wrap gap-6">
          <ButtonLink href="/proyectos" arrow>Ver proyectos</ButtonLink>
          <ButtonLink href="/contacto" variant="accent" arrow>Contactar</ButtonLink>
          <Button>Botón</Button>
        </div>
      </Section>

      <Section index="07" title="Cajetín">
        <TitleBlock
          fields={[
            { label: "Autor", value: "Albert Batiste Castellet" },
            { label: "Proyecto", value: "Albert-web" },
            { label: "Nº plano", value: "AB-99" },
            { label: "Escala", value: "1:1" },
            { label: "Revisión", value: "2026-10-18" },
            { label: "Idioma", value: "ES" },
          ]}
        />
      </Section>
    </div>
  );
}

function Section({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <SectionLabel index={index}>{title}</SectionLabel>
        <h2 className="text-h2 font-medium">{title}</h2>
      </div>
      {children}
    </section>
  );
}
