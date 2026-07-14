import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { AnnualProcurementPlan } from "@/modules/annual-procurement-plan/loader/AnnualProcurementPlanLoader";
import { AnnualProcurementPlanDataMaker } from "@/modules/annual-procurement-plan/document/AnnualProcurementPlanDataMaker";
import { annualProcurementPlanDictionaries } from "@/modules/annual-procurement-plan/config/dictionaries";

/**
 * ANNUAL_PROCUREMENT_PLAN (річний план закупівель) document. Loader fetches the
 * signed plan; the data maker renders the plan items with the procurement
 * dictionaries.
 */
export const annualProcurementPlanModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.ANNUAL_PROCUREMENT_PLAN,
  loader: AnnualProcurementPlan,
  templates: [
    {
      templateType: PdfTemplateTypes.ANNUAL_PROCUREMENT_PLAN,
      documentMaker: AnnualProcurementPlanDataMaker,
      dictionaries: annualProcurementPlanDictionaries,
    },
  ],
};
