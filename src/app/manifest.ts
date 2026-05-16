import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Glix",
    short_name: "Glix",
    description: "Diario simples e seguro para acompanhamento de glicemia.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f6faf8",
    theme_color: "#059669",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
