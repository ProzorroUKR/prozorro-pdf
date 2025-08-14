import { PDF } from "@/services/PDF/PDF";
export * from "@/services/PDF/PDF";
export * from "@/services/PDF/PdfTypes";
export * from "@/services/PDF/PDFInterface";
export * from "@/widgets/pq/types/TemplateCodes.enum";

const signToDoc = new PDF();

if (typeof window !== "undefined") {
  (window as any).signToDoc = signToDoc;
}

export { signToDoc };
