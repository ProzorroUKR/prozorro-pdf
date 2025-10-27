import { ProzorroPdf } from "@/services/PDF/PDF";
export * from "@/services/PDF/PDF";
export * from "@/services/PDF/PdfTypes";
export * from "@/widgets/pq/types/TemplateCodes.enum";
export * from "@/types/ProzorroPdfError.model";
export * from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
export * from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

const ProzorroPdfService = new ProzorroPdf();

if (typeof window !== "undefined") {
  (window as any).signToDoc = ProzorroPdfService;
}

export { ProzorroPdfService };
