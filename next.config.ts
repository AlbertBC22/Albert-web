import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Usa src/i18n/request.ts como configuración de next-intl.
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Imágenes públicas de Supabase Storage (buckets photos y projects).
    remotePatterns: [
      new URL("https://vavygglppyhueqpywjxt.supabase.co/storage/v1/object/public/**"),
    ],
  },
};

export default withNextIntl(nextConfig);
