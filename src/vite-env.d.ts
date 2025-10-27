/// <reference types="vite/client" />
import { TCreatedPdf } from "pdfmake/build/pdfmake";

declare class Pdfmake {
  createPdf(data: Record<string, any>): TCreatedPdf;
}

declare interface Window {
  signToDoc: import("@/services/PDF/PDFInterface").PDFInterface;
  signToDocErrorExceptionInterface: import("@/widgets/ErrorExceptionCore/ErrorExceptionCore").IErrorExceptionCore;
}
