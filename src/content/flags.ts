// Interruptores de contenido compartidos por cv.es.ts y cv.en.ts.

import type { ExternalLink } from "@/types/cv";

// NITS sigue publicada en App Store y Google Play.
// ~Octubre 2027 (cuando se retire de las tiendas): poner a false. Los textos pasan a
// "fue publicada" / "was published" en los dos idiomas y desaparecen los enlaces.
export const NITS_PUBLISHED = true;

// Enlaces de NITS en las tiendas (solo mientras esté publicada).
export const NITS_LINKS: ExternalLink[] = NITS_PUBLISHED
  ? [
      { label: "App Store", href: "https://apps.apple.com/es/app/nits-la-noche-en-tus-manos/id6755615789" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.fastparty.androidapp" },
    ]
  : [];
