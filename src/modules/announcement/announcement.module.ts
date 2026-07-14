import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { AnnouncementLoader } from "@/modules/announcement/loader/AnnouncementLoader";
import { AnnouncementDataMaker } from "@/modules/announcement/document/AnnouncementDataMaker";
import { announcementDictionaries } from "@/modules/announcement/config/dictionaries";

/**
 * ANNOUNCEMENT (оголошення про проведення закупівлі) document. Loader fetches
 * the tender announcement; the data maker renders the main-information,
 * criteria and conditions sections with the announcement dictionaries.
 */
export const announcementModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.ANNOUNCEMENT,
  loader: AnnouncementLoader,
  templates: [
    {
      templateType: PdfTemplateTypes.ANNOUNCEMENT,
      documentMaker: AnnouncementDataMaker,
      dictionaries: announcementDictionaries,
    },
  ],
};
