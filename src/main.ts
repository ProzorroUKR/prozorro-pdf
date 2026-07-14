import { ProzorroPdf } from "@/services/PDF/PDF";
export * from "@/services/PDF/PDF";
export * from "@/services/PDF/PdfDocument";
export * from "@/services/PDF/PdfTypes";
export * from "@/types/ProzorroPdfError.model";
export * from "@/constants/ENVIRONMENT_MODE.enum";
export * from "@/types/pq/TemplateCodes.enum";
export * from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
export * from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum";

const ProzorroPdfService = new ProzorroPdf();

if (typeof window !== "undefined") {
  window.ProzorroPdf = ProzorroPdfService;
}

export { ProzorroPdfService };
