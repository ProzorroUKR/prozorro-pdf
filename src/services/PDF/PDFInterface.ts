import type { PdfConfigType } from "@/types/pdf/PdfConfigType";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";

export interface PDFInterface {
  TYPES: {
    TICKET: string;
    CONCLUSION: string;
    ANNOUNCEMENT: string;
    NAZK: string;
    PQ: string;
    COMPLAINT: string;
    TENDER_OFFER: string;
    ANNUAL_PROCUREMENT_PLAN: string;
    TENDER_REJECTION_PROTOCOL: string;
    DETERMINING_WINNER_OF_PROCUREMENT: string;
    PURCHASE_CANCELLATION_PROTOCOL: string;
    PROTOCOL_CONSIDERATION_TENDER_OFFERS: string;
    PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD: string;
  };

  TEMPLATES: {
    FRUIT: string;
    GAS: string;
    PHARM: string;
    PHARM2: string;
    MEDICINE: string;
    COMPUTER: string;
    OTHER: string;
    GENERIC: string;
    FOOD: string;
  };

  init(eds: any): void;

  setConfig(config: PdfConfigType): Promise<void | ErrorExceptionCore>;

  open(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;

  getIframe(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;

  save(config: PdfDocumentConfigType): Promise<void | ErrorExceptionCore>;
}
