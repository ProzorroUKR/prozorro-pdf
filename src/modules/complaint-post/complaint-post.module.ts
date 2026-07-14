import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { ComplaintPostLoader } from "@/modules/complaint-post/loader/ComplaintPostLoader";
import { ComplaintPostDataMaker } from "@/modules/complaint-post/document/ComplaintPostDataMaker";
import { complaintPostCustomFooter } from "@/modules/complaint-post/services/ComplaintPostCustomFooter";

/**
 * COMPLAINT_POST document. Renders a complaint post; uses a custom per-page
 * footer (formation date + page number) instead of the default signer/QR
 * footer — declared via `customFooter` so the core pipeline needs no
 * document-type conditional.
 */
export const complaintPostModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.COMPLAINT_POST,
  loader: ComplaintPostLoader,
  templates: [
    {
      templateType: PdfTemplateTypes.COMPLAINT_POST,
      documentMaker: ComplaintPostDataMaker,
      customFooter: complaintPostCustomFooter,
    },
  ],
};
