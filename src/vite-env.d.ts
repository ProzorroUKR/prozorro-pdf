/// <reference types="vite/client" />
import { TCreatedPdf } from "pdfmake/build/pdfmake";

declare class Pdfmake {
  createPdf(data: Record<string, any>): TCreatedPdf;
}

declare global {
  interface Window {
    ProzorroPdf: import("@/services/PDF/PDF").IProzorroPdf;
  }
}
