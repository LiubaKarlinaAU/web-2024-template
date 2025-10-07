import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/web-2024-template/",
  plugins: [react()],
  server: {
    host: true, // Listen on all interfaces
    port: 5173,
  },
});
