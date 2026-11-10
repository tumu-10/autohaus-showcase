import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({ server: { entry: "server" } }),
    netlify({
      dev: {
        edgeFunctions: { enabled: false },
      },
    }),
    react(),
    tailwindcss(),
  ],
});
