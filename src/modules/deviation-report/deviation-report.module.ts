import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { DeviationReportLoader } from "@/modules/deviation-report/loader/DeviationReportLoader";
import { DeviationReportMaker } from "@/modules/deviation-report/document/DeviationReportMaker";
import { deviationReportDictionaries } from "@/modules/deviation-report/config/dictionaries";

/**
 * DEVIATION_REPORT (звіт про договір про закупівлю) document. Loader fetches the
 * decoded report; the data maker renders it with the help of
 * `MainInformationBuilder` and the organisation / procurement-method dictionaries.
 */
export const deviationReportModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.DEVIATION_REPORT,
  loader: DeviationReportLoader,
  templates: [
    {
      templateType: PdfTemplateTypes.DEVIATION_REPORT,
      documentMaker: DeviationReportMaker,
      dictionaries: deviationReportDictionaries,
    },
  ],
};
