import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  children: string;
  newTabLabel: string; // texto para lectores de pantalla: "(se abre en una pestaña nueva)"
};

// Descripción de un proyecto en markdown. react-markdown ignora el HTML incrustado y los
// enlaces peligrosos (javascript:…). Las imágenes no se muestran; los títulos empiezan en h2
// porque el h1 de la página es el título del proyecto.
export default function Markdown({ children, newTabLabel }: Props) {
  const components: ComponentProps<typeof ReactMarkdown>["components"] = {
    h1: ({ children }) => <h2 className="text-h3 font-medium">{children}</h2>,
    h2: ({ children }) => <h2 className="text-h3 font-medium">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-medium">{children}</h3>,
    h4: ({ children }) => <h3 className="text-lg font-medium">{children}</h3>,
    h5: ({ children }) => <h3 className="text-lg font-medium">{children}</h3>,
    h6: ({ children }) => <h3 className="text-lg font-medium">{children}</h3>,
    ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
    blockquote: ({ children }) => <blockquote className="space-y-4 border-l border-sky pl-4 text-ink-muted">{children}</blockquote>,
    code: ({ children }) => <code className="bg-sky-soft/50 px-1 font-mono text-[0.9em]">{children}</code>,
    pre: ({ children }) => <pre className="overflow-x-auto border border-line p-4 text-sm [&_code]:bg-transparent [&_code]:p-0">{children}</pre>,
    hr: () => <hr className="border-line" />,
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sky-ink underline underline-offset-4"
      >
        {children}
        <span className="sr-only"> {newTabLabel}</span>
      </a>
    ),
  };

  return (
    <div className="space-y-4">
      <ReactMarkdown components={components} disallowedElements={["img"]} unwrapDisallowed>
        {children}
      </ReactMarkdown>
    </div>
  );
}
