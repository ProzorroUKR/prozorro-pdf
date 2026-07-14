import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { DeterminingWinnerOfProcurementLoader } from "@/modules/determining-winner/loader/DeterminingWinnerOfProcurementLoader";
import { DeterminingWinnerOfProcurementDataMaker } from "@/modules/determining-winner/document/DeterminingWinnerOfProcurementDataMaker";
import { determiningWinnerOfProcurementDictionaries } from "@/modules/determining-winner/config/dictionaries";

/**
 * DETERMINING_WINNER_OF_PROCUREMENT (протокол визначення переможця) document.
 * Loader fetches the signed protocol; the data maker renders it with the
 * procurement dictionaries.
 */
export const determiningWinnerModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.DETERMINING_WINNER_OF_PROCUREMENT,
  loader: DeterminingWinnerOfProcurementLoader,
  templates: [
    {
      templateType: PdfTemplateTypes.DETERMINING_WINNER_OF_PROCUREMENT_TEMPLATE,
      documentMaker: DeterminingWinnerOfProcurementDataMaker,
      dictionaries: determiningWinnerOfProcurementDictionaries,
    },
  ],
};
