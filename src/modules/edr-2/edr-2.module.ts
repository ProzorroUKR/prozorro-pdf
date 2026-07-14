import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { Edr2Loader } from "@/modules/edr-2/loader/Edr2Loader";
import { Edr2DataMaker } from "@/modules/edr-2/document/Edr2DataMaker";

/**
 * EDR_2 (registerUSR) extract document. Loader fetches a YAML USR-register
 * document; the data maker renders the extended USR tables.
 */
export const edr2Module: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.EDR_2,
  loader: Edr2Loader,
  templates: [{ templateType: PdfTemplateTypes.EDR_2, documentMaker: Edr2DataMaker }],
};
