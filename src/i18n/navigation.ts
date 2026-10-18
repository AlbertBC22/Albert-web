import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Versiones de Link, redirect, usePathname y useRouter que entienden las rutas localizadas.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
