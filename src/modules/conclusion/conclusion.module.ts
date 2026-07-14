import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { ConclusionLoader } from "@/modules/conclusion/loader/ConclusionLoader";
import { ConclusionOfMonitoringDataMaker } from "@/modules/conclusion/document/ConclusionOfMonitoringDataMaker";

/**
 * CONCLUSION (висновок про результати моніторингу) document. The loader yields
 * the `MONITORING` template, rendered by `ConclusionOfMonitoringDataMaker`.
 *
 * Note: monitoring date/margin constants, texts and `Monitoring/*` types stay
 * in shared (`@/config/pdf/conclusionOfMonitoringConstants`,
 * `@/types/Monitoring/*`) — they are reused by many other makers and by the
 * core `PdfObjectType`.
 */
export const conclusionModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.CONCLUSION,
  loader: ConclusionLoader,
  templates: [{ templateType: PdfTemplateTypes.MONITORING, documentMaker: ConclusionOfMonitoringDataMaker }],
};
