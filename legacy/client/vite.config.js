import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Environment variable for the API URL
const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/graphql": {
        target: apiURL,
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
