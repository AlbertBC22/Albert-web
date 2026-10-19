import { getLocale } from "next-intl/server";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Profile from "@/components/sections/Profile";
import { getCv } from "@/content";

// Página principal: el CV como un plano que se recorre con el scroll.
export default async function HomePage() {
  const cv = getCv(await getLocale());

  return (
    <>
      <Hero cv={cv} />
      <Profile cv={cv} />
      <Experience cv={cv} />
    </>
  );
}
