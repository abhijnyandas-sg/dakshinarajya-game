import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The shared engine ships as CommonJS in dist; let Vite pre-bundle it.
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@dakshina/shared"],
  },
  build: {
    commonjsOptions: {
      include: [/shared/, /node_modules/],
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
