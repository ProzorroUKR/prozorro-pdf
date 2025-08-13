import { PdfTypes } from "@/services/PDF/PdfTypes";
import type { PdfConfigType } from "@/types/pdf/PdfConfigType";
import { TemplateCodesEnum } from "@/widgets/pq/types/TemplateCodes.enum";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";

export interface PDFInterface {
  TYPES: typeof PdfTypes;

  TEMPLATES: typeof TemplateCodesEnum;

  init(eds: any): void;

  setConfig(config: PdfConfigType): Promise<void | ErrorExceptionCore>;

  open(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;

  getIframe(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;

  save(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;
}
