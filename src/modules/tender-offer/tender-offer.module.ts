import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { TenderOfferLoader } from "@/modules/tender-offer/loader/TenderOfferLoader";
import { TenderOfferDataMaker } from "@/modules/tender-offer/document/TenderOfferDataMaker";
import { tenderOfferDictionaries } from "@/modules/tender-offer/config/dictionaries";

/**
 * TENDER_OFFER (тендерна пропозиція) document. Loader fetches the signed offer;
 * the data maker renders the main-information and criteria tables (built via
 * the local criteria transformer / evidence formatter) with the offer
 * dictionaries.
 */
export const tenderOfferModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.TENDER_OFFER,
  loader: TenderOfferLoader,
  templates: [
    {
      templateType: PdfTemplateTypes.TENDER_OFFER_TEMPLATE,
      documentMaker: TenderOfferDataMaker,
      dictionaries: tenderOfferDictionaries,
    },
  ],
};
