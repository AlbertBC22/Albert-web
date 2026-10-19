import { getLocale } from "next-intl/server";
import ContactCta from "@/components/sections/ContactCta";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Interests from "@/components/sections/Interests";
import Languages from "@/components/sections/Languages";
import Profile from "@/components/sections/Profile";
import Stack from "@/components/sections/Stack";
import Stats from "@/components/sections/Stats";
import { getCv } from "@/content";

// Página principal: el CV como un plano que se recorre con el scroll.
export default async function HomePage() {
  const cv = getCv(await getLocale());

  return (
    <>
      <Hero cv={cv} />
      <Profile cv={cv} />
      <Experience cv={cv} />
      <Stats cv={cv} />
      <Stack cv={cv} />
      <Languages cv={cv} />
      <Interests cv={cv} />
      <ContactCta />
    </>
  );
}
