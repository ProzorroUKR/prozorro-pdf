/// <reference types="vitest" />
import { resolve } from "path";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  base: "./",
  plugins: [
    dtsPlugin({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    sourcemap: true,
    outDir: "./dist",
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
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
      "@": resolve(__dirname, "src"),
    },
  },
});
