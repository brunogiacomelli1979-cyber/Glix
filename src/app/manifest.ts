import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/dashboard",
    name: "Glix",
    short_name: "Glix",
    description: "Diário simples e seguro para acompanhamento pessoal de glicemia.",
    scope: "/",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#eef8fb",
    theme_color: "#0f6f8f",
    orientation: "portrait",
    categories: ["health", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/branding/glix-dashboard-preview.png",
        sizes: "1600x1200",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/branding/glix-splash-screen.png",
        sizes: "1290x2796",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  };
}
