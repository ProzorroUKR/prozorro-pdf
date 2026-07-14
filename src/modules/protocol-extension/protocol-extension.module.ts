import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { ProtocolOnExtensionOfReviewPeriodLoader } from "@/modules/protocol-extension/loader/ProtocolOnExtensionOfReviewPeriodLoader";
import { ProtocolOnExtensionOfReviewPeriodDataMaker } from "@/modules/protocol-extension/document/ProtocolOnExtensionOfReviewPeriodDataMaker";
import { protocolOnExtensionOfReviewPeriodDictionaries } from "@/modules/protocol-extension/config/dictionaries";

/**
 * PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD (протокол продовження строку розгляду)
 * document. Loader fetches the signed protocol; the data maker renders it with
 * the review-period dictionaries.
 */
export const protocolExtensionModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD,
  loader: ProtocolOnExtensionOfReviewPeriodLoader,
  templates: [
    {
      templateType: PdfTemplateTypes.PROTOCOL_ON_EXTENSION_OF_REVIEW_PERIOD_TEMPLATE,
      documentMaker: ProtocolOnExtensionOfReviewPeriodDataMaker,
      dictionaries: protocolOnExtensionOfReviewPeriodDictionaries,
    },
  ],
};
