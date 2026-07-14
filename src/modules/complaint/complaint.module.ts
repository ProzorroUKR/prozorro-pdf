import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { ComplaintLoader } from "@/modules/complaint/loader/ComplaintLoader";
import { ComplaintDataMaker } from "@/modules/complaint/document/ComplaintDataMaker";
import { complaintDictionaries } from "@/modules/complaint/config/dictionaries";

/**
 * COMPLAINT (скарга) document. Loader fetches the signed complaint; the data
 * maker renders arguments / objections / evidence / requested-remedy sections
 * with the complaint dictionaries.
 */
export const complaintModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.COMPLAINT,
  loader: ComplaintLoader,
  templates: [
    {
      templateType: PdfTemplateTypes.COMPLAINT,
      documentMaker: ComplaintDataMaker,
      dictionaries: complaintDictionaries,
    },
  ],
};
