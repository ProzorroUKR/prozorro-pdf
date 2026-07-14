import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { EdrLoader } from "@/modules/edr/loader/EdrLoader";
import { EdrDataMaker } from "@/modules/edr/document/EdrDataMaker";

/**
 * EDR (Єдиний державний реєстр) extract document. Loader fetches a YAML
 * register-extract document; the data maker renders the identification,
 * founders and activity-kind tables.
 */
export const edrModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.EDR,
  loader: EdrLoader,
  templates: [{ templateType: PdfTemplateTypes.EDR, documentMaker: EdrDataMaker }],
};
