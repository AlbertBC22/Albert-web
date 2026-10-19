// Tipos del contenido del CV (src/content/cv.es.ts y cv.en.ts).

/** Año y mes, p. ej. "2024-09". */
export type YearMonth = `${number}-${number}`;

export type ExternalLink = {
  label: string;
  href: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  project?: string; // p. ej. "NITS"
  location?: string;
  mode?: string; // p. ej. "Híbrido · media jornada"
  start: YearMonth;
  end: YearMonth | null; // null = actualidad
  highlights: string[];
  note?: { title: string; text: string }; // anotación destacada (aprendizaje)
  links?: ExternalLink[]; // p. ej. NITS en las tiendas
};

export type Stat =
  | { kind: "number"; value: number; prefix?: string; label: string }
  | { kind: "range"; from: number; to: number; label: string }
  | { kind: "funnel"; steps: { value: number; label: string }[]; label: string };

export type StackGroup = {
  category: string;
  items: string[];
};

export type Language = {
  name: string;
  level: string;
  detail?: string;
  scale: number; // 0–1, para la escala gráfica
};

export type Interest = {
  id: "photography" | "cinema" | "basketball";
  title: string;
  text: string;
};

export type Education = {
  id: string;
  title: string;
  center: string;
  start: number; // año
  end: number;
};

export type Certification = {
  title: string;
  issuer?: string; // sin emisor conocido → "—"
  year: string; // "2022" o un periodo, "2020–2023"
};

export type PlannedEducation = {
  title: string;
  year: string;
};

export type Cv = {
  name: { first: string; last: string };
  role: string;
  location: string;
  tagline: string;
  links: { linkedin: string; github: string };
  profile: string[];
  experience: Experience[];
  otherExperience: string[];
  stats: Stat[];
  stack: StackGroup[];
  languages: Language[];
  interests: Interest[];
  // Página /formacion
  education: Education[];
  certifications: Certification[];
  certificationsNote: string;
  plannedEducation: PlannedEducation[];
};
