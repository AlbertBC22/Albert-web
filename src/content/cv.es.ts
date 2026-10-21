import type { Cv } from "@/types/cv";
import { NITS_LINKS, NITS_PUBLISHED } from "./flags";

// Contenido del CV en español. Fuente: docs/CONTENIDO.md.
export const cvEs: Cv = {
  name: { first: "Albert Batiste", last: "Castellet" },
  role: "Software Developer · .NET · Angular · SQL Server",
  location: "Barcelona, Cataluña",
  tagline:
    "Técnico que no se queda en el código. Entiende el negocio, habla con el cliente y organiza al equipo, y ya ha demostrado que se atreve a emprender.",
  links: {
    linkedin: "https://linkedin.com/in/albertbat",
    github: "https://github.com/AlbertBC22",
  },

  profile: [
    "Desarrollador de software con más de dos años de experiencia en .NET 8, Angular y SQL Server, trabajando en varios productos reales.",
    "En mis proyectos hablo directamente con el cliente, creo las tareas y las reparto en el equipo, y estoy orientando mi carrera hacia el punto donde se juntan producto y tecnología. Trabajo a diario en el entorno Microsoft y Azure.",
    `Cofundé Chimera Applications con dos socios y construí desde cero la API de NITS, una app ${NITS_PUBLISHED ? "publicada" : "que fue publicada"} en iOS y Android, además de ocuparme de la parte comercial.`,
  ],

  experience: [
    {
      id: "beondev",
      role: "Software Developer",
      company: "BeonDev",
      location: "Sabadell",
      mode: "Híbrido · media jornada",
      start: "2024-09",
      end: null,
      highlights: [
        "Desarrollo de APIs en .NET 8: creación de endpoints y sistema de autorizaciones.",
        "Frontend con Angular (versiones 14 y 22) y DevExtreme, estandarizando procesos y componentes de interfaz.",
        "Diseño de bases de datos SQL Server: tablas, estructuras, relaciones, procedimientos almacenados y consultas.",
        "Participación en 6 o 7 proyectos; en la mayoría, contacto directo con el cliente y organización y reparto de tareas dentro del equipo.",
        "Cuando se abre un proyecto nuevo, me ofrezco a asumirlo, entender su alcance y arrancarlo.",
        "Trabajo habitual en el entorno Microsoft y Azure, con gestión de tareas y repositorios en Azure DevOps.",
        "Diseño de pantallas en Figma para proyectos del equipo.",
      ],
    },
    {
      id: "chimera",
      role: "Cofundador",
      company: "Chimera Applications",
      project: "NITS",
      start: "2025-05",
      end: "2026-10",
      highlights: [
        "Cofundador junto a dos socios; durante año y medio dirigimos NITS, repartiéndonos idea, desarrollo y relación con clientes.",
        `Desarrollo completo de la API (.NET 8) de la app NITS, ${NITS_PUBLISHED ? "publicada" : "que fue publicada"} en App Store y Google Play.`,
        "Llegamos a unos 1.500 usuarios y más de 10.000 seguidores en redes sociales.",
        "Estrategia comercial hacia locales de ocio nocturno por correo, Instagram y llamadas: contactamos con muchos locales y llegamos a reunirnos con 5 o 6.",
        "Participación diaria en las decisiones y la organización del proyecto.",
        "Automatización de correos con escenarios sencillos en Make y uso de HubSpot como CRM.",
      ],
      note: {
        title: "Aprendizaje",
        text: "El proyecto cerró en octubre de 2026 sin llegar a consolidarse, pero me enseñó muchísimo sobre lo que significa formar parte de un equipo, buscarse la vida de forma continua y entender la importancia de cada proceso de un proyecto y de las responsabilidades que conlleva.",
      },
      links: NITS_LINKS,
    },
    {
      id: "suited",
      role: "Software Developer",
      company: "Suited",
      location: "Sabadell",
      mode: "Híbrido · media jornada",
      start: "2024-09",
      end: null,
      highlights: [
        "Desarrollo con el mismo stack que en BeonDev (.NET, Angular, SQL Server), en una parte más limitada.",
        "Prospección comercial por LinkedIn para Keep, un GMAO para gestionar activos y controlar por completo el mantenimiento preventivo, reactivo y predictivo: unos 100 contactos, 5 leads completados y 1 venta cerrada y en funcionamiento.",
        "Llamadas y valoración de clientes potenciales.",
      ],
    },
    {
      id: "essistemas",
      role: "Desarrollador web",
      company: "ESSistemas",
      location: "Remoto",
      start: "2023-10",
      end: "2024-04",
      highlights: ["Desarrollo web con React (JavaScript, HTML y CSS), en remoto."],
    },
    {
      id: "avannubo",
      role: "Programador software (prácticas)",
      company: "Avannubo",
      location: "Barcelona",
      start: "2022-11",
      end: "2023-06",
      highlights: [
        "Desarrollo de páginas web con conexión al backend mediante Laravel (PHP), siguiendo el patrón MVC.",
      ],
    },
  ],

  otherExperience: [
    "Árbitro de baloncesto — Federació Catalana de Basquetbol (ago. 2022 – mar. 2024).",
    "Prácticas: técnico informático (Netland, 2021) y redactor de documentación (Euro-Funding, 2020).",
  ],

  stats: [
    { kind: "number", value: 1500, prefix: "~", label: "usuarios en NITS" },
    { kind: "number", value: 10000, prefix: "+", label: "seguidores en redes de NITS" },
    { kind: "range", from: 6, to: 7, label: "proyectos en BeonDev" },
    {
      kind: "funnel",
      steps: [
        { value: 100, label: "contactos" },
        { value: 5, label: "leads" },
        { value: 1, label: "venta" },
      ],
      label: "venta B2B de Keep",
    },
  ],

  stack: [
    { category: "Backend", items: ["C#", ".NET 8", "ASP.NET Core", "PHP / Laravel (MVC)"] },
    {
      category: "Frontend",
      items: ["Angular", "React", "JavaScript", "DevExtreme / DevExpress", "HTML y CSS"],
    },
    {
      category: "Datos",
      items: ["SQL Server (procedimientos almacenados)", "MySQL", "Oracle SQL y PL/SQL"],
    },
    { category: "Diseño", items: ["Figma"] },
    {
      category: "Entorno y herramientas",
      items: ["Visual Studio 2022", "Visual Studio Code", "Antigravity (IDE de Google)", "GitHub", "Azure DevOps"],
    },
    { category: "Gestión y colaboración", items: ["Microsoft 365", "Planner", "SharePoint"] },
    { category: "Automatización y CRM", items: ["Make", "HubSpot"] },
  ],

  languages: [
    { name: "Catalán", level: "Nativo", scale: 1 },
    { name: "Castellano", level: "Nativo", scale: 1 },
    {
      name: "Inglés",
      level: "Nivel alto",
      detail: "Conversación fluida, comprensión completa",
      scale: 0.85,
    },
  ],

  interests: [
    {
      id: "photography",
      title: "Fotografía",
      text: "Mi gran afición. Sensibilidad visual que me sirve para el diseño y el producto.",
    },
    {
      id: "cinema",
      title: "Cine",
      text: "Otra fuente de sensibilidad visual, útil para el diseño y el producto.",
    },
    {
      id: "basketball",
      title: "Baloncesto",
      text: "Árbitro federado entre 2022 y 2024: decisiones bajo presión, imparcialidad y comunicación.",
    },
  ],
  education: [
    {
      id: "daw",
      title: "Desarrollador de aplicaciones web",
      center: "Monlau FP",
      start: 2023,
      end: 2024,
      award:
        "Premio al mejor proyecto de DAW y, a la vez, premio del ciclo de Marketing con Spotted, desarrollado junto a estudiantes de Marketing: la primera versión de lo que acabaría siendo NITS.",
    },
    {
      id: "dam",
      title: "Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)",
      center: "Monlau FP",
      start: 2020,
      end: 2023,
    },
    { id: "smr", title: "Sistemas microinformáticos y redes", center: "Salesians Sarrià", start: 2019, end: 2021 },
  ],

  certifications: [
    { title: "MTA: Software Development Fundamentals", issuer: "Microsoft", year: "2022" },
    { title: "MTA: Introduction to Programming using HTML and CSS", issuer: "Microsoft", year: "2022" },
    { title: "Programación PL/SQL 11g", issuer: "Oracle", year: "2020–2023" },
    { title: "Conceptos fundamentales SQL 11g", issuer: "Oracle", year: "2020–2023" },
    { title: "Java SE Fundamentals", year: "2020–2023" },
    { title: "Administración de Windows 10", year: "2020–2023" },
    { title: "Administración de sistemas operativos Linux", issuer: "LPI", year: "2020–2023" },
  ],
  certificationsNote: "Obtenidas durante el Grado Superior DAM en Monlau FP (2020–2023).",

  // Solo se muestra con SHOW_PLANNED_EDUCATION (flags.ts). Revisar al activarla.
  plannedEducation: [{ title: "Formación en gestión / Product Owner", year: "2027" }],
};
