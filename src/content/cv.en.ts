import type { Cv } from "@/types/cv";
import { NITS_LINKS, NITS_PUBLISHED } from "./flags";

// CV content in English. Translation of cv.es.ts proposed by Claude, pending Albert's review.
export const cvEn: Cv = {
  name: { first: "Albert Batiste", last: "Castellet" },
  role: "Software Developer · .NET · Angular · SQL Server",
  location: "Barcelona, Catalonia",
  tagline:
    "A developer who goes beyond the code. Understands the business, talks to clients, organizes the team — and has already shown the nerve to start a company.",
  links: {
    linkedin: "https://linkedin.com/in/albertbat",
    github: "https://github.com/AlbertBC22",
  },

  profile: [
    "Software developer with more than two years of experience in .NET 8, Angular and SQL Server, working on several real-world products.",
    "On my projects I deal directly with the client, create the tasks and assign them within the team, and I'm steering my career towards the point where product and technology meet. I work daily in the Microsoft and Azure ecosystem.",
    `I co-founded Chimera Applications with two partners and built the NITS API from scratch — an app ${NITS_PUBLISHED ? "published" : "that was published"} on iOS and Android — while also handling the sales side.`,
  ],

  experience: [
    {
      id: "beondev",
      role: "Software Developer",
      company: "BeonDev",
      location: "Sabadell",
      mode: "Hybrid · part-time",
      start: "2024-09",
      end: null,
      highlights: [
        "Built APIs in .NET 8: endpoints and the authorization system.",
        "Frontend with Angular (versions 14 and 22) and DevExtreme, standardizing processes and UI components.",
        "SQL Server database design: tables, structures, relationships, stored procedures and queries.",
        "Worked on 6–7 projects; on most of them, dealing directly with the client and organizing and assigning tasks within the team.",
        "When a new project comes up, I volunteer to take it on, understand its scope and get it started.",
        "Daily work in the Microsoft and Azure ecosystem, managing tasks and repositories in Azure DevOps.",
        "Screen design in Figma for team projects.",
      ],
    },
    {
      id: "chimera",
      role: "Co-founder",
      company: "Chimera Applications",
      project: "NITS",
      start: "2025-05",
      end: "2026-10",
      highlights: [
        "Co-founded the company with two partners; for a year and a half we ran NITS, sharing the idea, development and client relations.",
        `Built the complete API (.NET 8) for the NITS app, ${NITS_PUBLISHED ? "published" : "which was published"} on the App Store and Google Play.`,
        "We reached around 1,500 users and more than 10,000 followers on social media.",
        "Sales strategy aimed at nightlife venues via email, Instagram and phone calls: we contacted many venues and met with 5 or 6 of them.",
        "Took part every day in the project's decisions and organization.",
        "Email automation with simple scenarios in Make, and HubSpot as our CRM.",
      ],
      note: {
        title: "Lesson learned",
        text: "The project closed in October 2026 without becoming established, but it taught me a great deal about what it means to be part of a team, to keep finding a way forward every day, and to understand the importance of every process in a project and the responsibilities that come with it.",
      },
      links: NITS_LINKS,
    },
    {
      id: "suited",
      role: "Software Developer",
      company: "Suited",
      location: "Sabadell",
      mode: "Hybrid · part-time",
      start: "2024-09",
      end: null,
      highlights: [
        "Development with the same stack as at BeonDev (.NET, Angular, SQL Server), on a more limited scope.",
        "Sales prospecting on LinkedIn for Keep, a CMMS for managing assets and fully controlling preventive, reactive and predictive maintenance: around 100 contacts, 5 qualified leads and 1 closed sale, now up and running.",
        "Calls with and assessment of potential clients.",
      ],
    },
    {
      id: "essistemas",
      role: "Web Developer",
      company: "ESSistemas",
      location: "Remote",
      start: "2023-10",
      end: "2024-04",
      highlights: ["Web development with React (JavaScript, HTML and CSS), working remotely."],
    },
    {
      id: "avannubo",
      role: "Software Developer (internship)",
      company: "Avannubo",
      location: "Barcelona",
      start: "2022-11",
      end: "2023-06",
      highlights: ["Built web pages connected to a Laravel (PHP) backend, following the MVC pattern."],
    },
  ],

  otherExperience: [
    "Basketball referee — Catalan Basketball Federation (Aug 2022 – Mar 2024).",
    "Internships: IT technician (Netland, 2021) and documentation writer (Euro-Funding, 2020).",
  ],

  stats: [
    { kind: "number", value: 1500, prefix: "~", label: "NITS users" },
    { kind: "number", value: 10000, prefix: "+", label: "NITS social media followers" },
    { kind: "range", from: 6, to: 7, label: "projects at BeonDev" },
    {
      kind: "funnel",
      steps: [
        { value: 100, label: "contacts" },
        { value: 5, label: "leads" },
        { value: 1, label: "sale" },
      ],
      label: "B2B sale for Keep",
    },
  ],

  stack: [
    { category: "Backend", items: ["C#", ".NET 8", "ASP.NET Core", "PHP / Laravel (MVC)"] },
    {
      category: "Frontend",
      items: ["Angular", "React", "JavaScript", "DevExtreme / DevExpress", "HTML & CSS"],
    },
    { category: "Data", items: ["SQL Server (stored procedures)", "MySQL", "Oracle SQL & PL/SQL"] },
    { category: "Design", items: ["Figma"] },
    {
      category: "Environment & tools",
      items: ["Visual Studio 2022", "Visual Studio Code", "Antigravity (Google's IDE)", "GitHub", "Azure DevOps"],
    },
    { category: "Management & collaboration", items: ["Microsoft 365", "Planner", "SharePoint"] },
    { category: "Automation & CRM", items: ["Make", "HubSpot"] },
  ],

  languages: [
    { name: "Catalan", level: "Native", scale: 1 },
    { name: "Spanish", level: "Native", scale: 1 },
    {
      name: "English",
      level: "Advanced",
      detail: "Fluent conversation, full comprehension",
      scale: 0.85,
    },
  ],

  interests: [
    {
      id: "photography",
      title: "Photography",
      text: "My great passion. A visual sensibility that helps me with design and product.",
    },
    {
      id: "cinema",
      title: "Cinema",
      text: "Another source of visual sensibility, useful for design and product.",
    },
    {
      id: "basketball",
      title: "Basketball",
      text: "Federated referee from 2022 to 2024: decisions under pressure, impartiality and communication.",
    },
  ],
  education: [
    {
      id: "daw",
      title: "Web Application Developer",
      center: "Monlau FP",
      start: 2023,
      end: 2024,
      award:
        "Best Project award in the Web Application Development (DAW) programme and, at the same time, the Marketing programme’s award: the project was developed jointly with Marketing students.",
    },
    {
      id: "dam",
      title: "Higher Vocational Diploma in Multiplatform Application Development (DAM)",
      center: "Monlau FP",
      start: 2020,
      end: 2023,
    },
    {
      id: "smr",
      title: "Vocational Diploma in Microcomputer Systems and Networks",
      center: "Salesians Sarrià",
      start: 2019,
      end: 2021,
    },
  ],

  certifications: [
    { title: "MTA: Software Development Fundamentals", issuer: "Microsoft", year: "2022" },
    { title: "MTA: Introduction to Programming using HTML and CSS", issuer: "Microsoft", year: "2022" },
    { title: "PL/SQL Programming 11g", issuer: "Oracle", year: "2020–2023" },
    { title: "SQL Fundamentals 11g", issuer: "Oracle", year: "2020–2023" },
    { title: "Java SE Fundamentals", year: "2020–2023" },
    { title: "Windows 10 Administration", year: "2020–2023" },
    { title: "Linux Operating System Administration", issuer: "LPI", year: "2020–2023" },
  ],
  certificationsNote: "Earned during the DAM Higher Vocational Diploma at Monlau FP (2020–2023).",

  // Only shown with SHOW_PLANNED_EDUCATION (flags.ts). Review when enabling it.
  plannedEducation: [{ title: "Management / Product Owner training", year: "2027" }],
};
