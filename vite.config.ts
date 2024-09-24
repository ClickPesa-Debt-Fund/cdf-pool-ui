import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
// import legacy from "@vitejs/plugin-legacy";
import { resolve } from "path";
import EnvironmentPlugin from "vite-plugin-environment";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// @ts-ignore
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    root: "./",
    plugins: [
      react(),
      nodePolyfills(),
      EnvironmentPlugin("all"),
      // legacy({
      //   targets: ["defaults"],
      // }),
    ],
    build: {
      chunkSizeWarningLimit: 6000,
    },
    resolve: {
      alias: {
        "./runtimeConfig": "./runtimeConfig.browser",
        "@": resolve(__dirname, "./src"),
      },
    },
  });
};
