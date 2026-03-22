import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/app/routeTree.gen.ts",
    }),
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
