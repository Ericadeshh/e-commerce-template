import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/products": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.error("Proxy error:", err);
          });
          proxy.on("proxyReq", (_proxyReq, req) => {
            console.log("Proxying request:", req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("Received response:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
