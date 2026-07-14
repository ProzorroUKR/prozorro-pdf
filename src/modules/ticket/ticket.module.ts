import type { PdfFeatureModule } from "@/modules/types";
import { PROZORRO_PDF_TYPES } from "@/services/PDF/PdfTypes";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import { TicketLoader } from "@/modules/ticket/loader/TicketLoader";
import { XmlDataMaker } from "@/modules/ticket/document/XmlDataMaker";
import { KvtDataMaker } from "@/modules/ticket/document/KvtDataMaker";

/**
 * TICKET document. A single loader (`TicketLoader`) inspects the decoded file
 * and yields one of two templates — `XML` or `KVT` — each rendered by its own
 * data maker. Both templates are declared explicitly so registry lookup stays
 * branch-free.
 */
export const ticketModule: PdfFeatureModule = {
  documentType: PROZORRO_PDF_TYPES.TICKET,
  loader: TicketLoader,
  templates: [
    { templateType: PdfTemplateTypes.XML, documentMaker: XmlDataMaker },
    { templateType: PdfTemplateTypes.KVT, documentMaker: KvtDataMaker },
  ],
};
