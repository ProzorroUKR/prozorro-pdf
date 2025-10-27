import { ENCODING } from "@/constants/encoding";

export type PdfDocumentConfigType = {
  title: string;
  date?: string;
  encoding?: ENCODING;
  tender?: string;
  contractTemplateName?: string; // PROZORRO_TEMPLATE_CODES
};
