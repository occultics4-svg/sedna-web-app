import type { MetadataRoute } from "next";

/**
 * Web App Manifest — declares SEDNA as an installable PWA.
 * Served at /manifest.webmanifest. Linked from the root layout via
 * Next.js's automatic <link rel="manifest"> injection.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SEDNA",
    short_name: "SEDNA",
    description:
      "Energetic charge release technique — a 10-minute web practice.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d2540",
    theme_color: "#0d2540",
    orientation: "portrait",
    categories: ["lifestyle", "health", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
