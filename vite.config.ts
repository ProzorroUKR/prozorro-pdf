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
    sourcemap: false,
    outDir: "./dist",
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "ProzorroPdf",
      formats: ["es", "cjs"],
      fileName: format => (format === "es" ? "prozorro-pdf.es.js" : "prozorro-pdf.cjs"),
    },
    rollupOptions: {
      external: [/^@prozorro\/prozorro-eds/, /^pdfmake/, /^lodash/, /^decimal\.js/, /^qs/, /^yaml/],
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
