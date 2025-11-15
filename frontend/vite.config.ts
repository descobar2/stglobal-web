import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { tr } from "date-fns/locale";

export default defineConfig({
  root: "client",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    fs: {
      allow: [
        path.resolve(__dirname, "client"),
        path.resolve(__dirname, "shared"),
        path.resolve(__dirname, "public"),
      ],
    },
  },
  publicDir: "public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client"),
      "@components": path.resolve(__dirname, "client/components"),
      "@pages": path.resolve(__dirname, "client/pages"),
      "@lib": path.resolve(__dirname, "client/lib"),
    },
  },
});
