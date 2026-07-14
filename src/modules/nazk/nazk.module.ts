import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { NazkLoader } from "@/modules/nazk/loader/NazkLoader";
import { NazkDataMaker } from "@/modules/nazk/document/NazkDataMaker";

/**
 * NAZK (НАЗК) corruption-register response document. Loader fetches the
 * register document; the data maker renders the corruption-mark table.
 */
export const nazkModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.NAZK,
  loader: NazkLoader,
  templates: [{ templateType: PdfTemplateTypes.NAZK, documentMaker: NazkDataMaker }],
};
