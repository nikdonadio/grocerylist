import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // In dev, proxy API calls to serverless-offline running on port 3000
    // So frontend calls /api/... and Vite forwards to http://localhost:3000
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/api/, "/dev"),
        changeOrigin: true,
      },
    },
  },
});
