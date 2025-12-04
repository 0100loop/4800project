import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),

      // ⭐ Fix MarkerCluster imports for Vite
      "leaflet.markercluster":
        path.resolve(
          __dirname,
          "node_modules/leaflet.markercluster/dist/leaflet.markercluster.js"
        ),
      "leaflet.markercluster.css":
        path.resolve(
          __dirname,
          "node_modules/leaflet.markercluster/dist/MarkerCluster.css"
        ),
      "leaflet.markercluster.default.css":
        path.resolve(
          __dirname,
          "node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css"
        ),
    },
  },

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
