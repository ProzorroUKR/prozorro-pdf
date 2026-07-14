import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { ProtocolConsiderationTenderOffersLoader } from "@/modules/protocol-consideration/loader/ProtocolConsiderationTenderOffersLoader";
import { ProtocolConsiderationTenderOffersDataMaker } from "@/modules/protocol-consideration/document/ProtocolConsiderationTenderOffersDataMaker";
import { protocolConsiderationTenderOffersDictionaries } from "@/modules/protocol-consideration/config/dictionaries";

/**
 * PROTOCOL_CONSIDERATION_TENDER_OFFERS (протокол розгляду тендерних пропозицій)
 * document. Loader fetches the signed protocol; the data maker renders the
 * qualification / bids tables with the consideration dictionaries.
 */
export const protocolConsiderationModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.PROTOCOL_CONSIDERATION_TENDER_OFFERS,
  loader: ProtocolConsiderationTenderOffersLoader,
  templates: [
    {
      templateType: PdfTemplateTypes.PROTOCOL_CONSIDERATION_TENDER_OFFERS_TEMPLATE,
      documentMaker: ProtocolConsiderationTenderOffersDataMaker,
      dictionaries: protocolConsiderationTenderOffersDictionaries,
    },
  ],
};
