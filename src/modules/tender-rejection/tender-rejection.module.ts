import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { TenderRejectionProtocolLoader } from "@/modules/tender-rejection/loader/TenderRejectionProtocolLoader";
import { TenderRejectionProtocolDataMaker } from "@/modules/tender-rejection/document/TenderRejectionProtocolDataMaker";
import { tenderRejectionProtocolDictionaries } from "@/modules/tender-rejection/config/dictionaries";

/**
 * TENDER_REJECTION_PROTOCOL (протокол відхилення тендерної пропозиції) document.
 * Loader fetches the signed protocol; the data maker renders it with the
 * rejection dictionaries.
 */
export const tenderRejectionModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.TENDER_REJECTION_PROTOCOL,
  loader: TenderRejectionProtocolLoader,
  templates: [
    {
      templateType: PdfTemplateTypes.TENDER_REJECTION_PROTOCOL_TEMPLATE,
      documentMaker: TenderRejectionProtocolDataMaker,
      dictionaries: tenderRejectionProtocolDictionaries,
    },
  ],
};
