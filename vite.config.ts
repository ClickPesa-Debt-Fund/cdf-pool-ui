import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";
import { resolve } from "path";
import EnvironmentPlugin from "vite-plugin-environment";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  root: "./",
  plugins: [
    react(),
    nodePolyfills(),
    EnvironmentPlugin("all"),
    legacy({
      targets: ["defaults"],
    }),
  ],
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
      "@": resolve(__dirname, "./src"),
    },
  },
});
