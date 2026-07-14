import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { PurchaseCancellationProtocolLoader } from "@/modules/purchase-cancellation/loader/PurchaseCancellationProtocolLoader";
import { PurchaseCancellationProtocolDataMaker } from "@/modules/purchase-cancellation/document/PurchaseCancellationProtocolDataMaker";
import { purchaseCancellationProtocolDictionaries } from "@/modules/purchase-cancellation/config/dictionaries";

/**
 * PURCHASE_CANCELLATION_PROTOCOL (протокол скасування закупівлі) document.
 * Loader fetches the signed protocol; the data maker renders it with the
 * cancellation-reason dictionaries.
 */
export const purchaseCancellationModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.PURCHASE_CANCELLATION_PROTOCOL,
  loader: PurchaseCancellationProtocolLoader,
  templates: [
    {
      templateType: PdfTemplateTypes.PURCHASE_CANCELLATION_PROTOCOL_TEMPLATE,
      documentMaker: PurchaseCancellationProtocolDataMaker,
      dictionaries: purchaseCancellationProtocolDictionaries,
    },
  ],
};
