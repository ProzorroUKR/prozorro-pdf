import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { TerminationReportLoader } from "@/modules/termination-report/loader/TerminationReportLoader";
import { TerminationReportMaker } from "@/modules/termination-report/document/TerminationReportMaker";
import { terminationReportDictionaries } from "@/modules/termination-report/config/dictionaries";

/**
 * TERMINATION_REPORT (Звіт про виконання публічного договору). The loader finds
 * the `terminationReport` signature in the contract's `terminationDetails.documents`,
 * decodes it into the termination decision (`data`) + contract snapshot
 * (`context.contract`); the data maker renders the report with the organisation,
 * main-procurement-category, units (`recommended`) and countries dictionaries.
 */
export const terminationReportModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.TERMINATION_REPORT,
  loader: TerminationReportLoader,
  templates: [
    {
      templateType: PdfTemplateTypes.TERMINATION_REPORT,
      documentMaker: TerminationReportMaker,
      dictionaries: terminationReportDictionaries,
    },
  ],
};
