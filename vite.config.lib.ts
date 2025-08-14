/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  base: "./",
  plugins: [
    dtsPlugin({
      insertTypesEntry: true,
    }),
  ],
  build: {
    outDir: "./dist/lib",
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "ProzorroPdf",
      formats: ["es", "iife", "cjs", "umd"],
      fileName: format => `prozorro-pdf.${format}.js`,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
