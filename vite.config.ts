import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png"],
      manifest: {
        name: "Decidr — a decision cockpit",
        short_name: "Decidr",
        description: "Describe a decision, get back the mental models that apply to it.",
        theme_color: "#0a0a0b",
        background_color: "#0a0a0b",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "/pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Saved decisions live in localStorage; cache the app shell + fonts so
        // History/Library/Home stay reviewable offline (product plan §9).
        globPatterns: ["**/*.{js,css,html,otf}"],
        runtimeCaching: [
          {
            urlPattern: /\/fonts\/.*\.otf$/,
            handler: "CacheFirst",
            options: { cacheName: "decidr-fonts", expiration: { maxEntries: 12 } },
          },
        ],
      },
    }),
  ],
});
