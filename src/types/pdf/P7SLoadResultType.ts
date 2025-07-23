import { ENCODING } from "@/constants/encoding";
import type { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";

export type P7SLoadResultType = {
  file: string;
  type: PdfTemplateTypes;
  encoding?: ENCODING;
  url?: string;
};
