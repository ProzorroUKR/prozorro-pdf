import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { PQLoader } from "@/modules/pq/loader/PQLoader";
import { PQDataMaker } from "@/modules/pq/document/PQDataMaker";

/**
 * PQ (договір про закупівлю / qualification) document. The largest module: a
 * single loader and data maker drive a per-contract-template build system
 * (`templates/*`, `services/*`, `configs/*`) selected by `PROZORRO_TEMPLATE_CODES`.
 *
 * Shared leaves used by other modules / core live outside this module:
 * `@/types/pq/*`, `@/config/pdf/pqMargins`, `@/services/Common/ClassificationTransformer`,
 * `@/constants/pqMilestones`.
 */
export const pqModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.PQ,
  loader: PQLoader,
  templates: [{ templateType: PdfTemplateTypes.PQ, documentMaker: PQDataMaker }],
};
