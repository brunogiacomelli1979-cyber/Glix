import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Glix",
    short_name: "Glix",
    description: "Diário simples e seguro para acompanhamento pessoal de glicemia.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#eef8fb",
    theme_color: "#0f6f8f",
    orientation: "portrait",
    icons: [
      {
        src: "/branding/glix-app-icon.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  };
}
