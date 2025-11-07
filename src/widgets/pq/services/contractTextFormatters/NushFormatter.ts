import { pqBase } from "@/widgets/pq/configs/pqTexts";
import { DEFAULT_TEXT_FIELDS } from "@/constants/string";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";
import type { PQContractType, PQsupplier } from "@/widgets/pq/types/PQTypes";
import { pqNushTexts } from "@/widgets/pq/templates/nush/configs/pqNushTexts";
import { pqGenericBase } from "@/widgets/pq/templates/generic/configs/pqGenericTexts";
import { PQFormattingService } from "@/widgets/pq/services/Formating/PQFormattingService";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { PQ_GENERIC_HEADER_START_MARGIN, PQ_PARAGRAPH_MARGIN } from "@/widgets/pq/configs/margins";

export class NushFormatter {
  static createHeader(contractObject: PQContractType, tender: TenderOfferType): Record<string, any>[] {
    const buyer: PQsupplier = DocumentExtractionService.getField(contractObject, "buyer");
    const supplier: PQsupplier = DocumentExtractionService.getField(contractObject, "suppliers[0]");

    const paragraphBuyer = PQFormattingService.createTextUnit(
      [
        pqGenericBase.buyer,
        DocumentExtractionService.getField(buyer, "name", DEFAULT_TEXT_FIELDS.UNDERSCORES_40),
        pqNushTexts.edrpou,
        DocumentExtractionService.getField(buyer, "identifier.id", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
        pqGenericBase.representedBy,
        DocumentExtractionService.getField(buyer, "signerInfo.name", DEFAULT_TEXT_FIELDS.UNDERSCORES_68),
        pqBase.basisOf,
        DocumentExtractionService.getField(
          buyer,
          "signerInfo.authorizedBy",
          DocumentExtractionService.getField(buyer, "signerInfo.basisOf", DEFAULT_TEXT_FIELDS.UNDERSCORES_32)
        ),
        `${pqGenericBase.onOneSide} `,
        pqGenericBase.and,
      ],
      PQ_GENERIC_HEADER_START_MARGIN,
      PDF_FILED_KEYS.HEADER_DATA
    );

    const paragraphSupplier = PQFormattingService.createTextUnit(
      [
        pqGenericBase.supplier,
        DocumentExtractionService.getField(supplier, "name", DEFAULT_TEXT_FIELDS.UNDERSCORES_40),
        pqNushTexts.edrpou,
        DocumentExtractionService.getField(supplier, "identifier.id", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
        pqGenericBase.representedBy,
        DocumentExtractionService.getField(supplier, "signerInfo.name", DEFAULT_TEXT_FIELDS.UNDERSCORES_68),
        pqBase.basisOf,
        DocumentExtractionService.getField(
          supplier,
          "signerInfo.authorizedBy",
          DocumentExtractionService.getField(supplier, "signerInfo.basisOf", DEFAULT_TEXT_FIELDS.UNDERSCORES_32)
        ),
        `${pqGenericBase.onOtherSide} `,
        pqGenericBase.togetherNext,
      ],
      PQ_PARAGRAPH_MARGIN,
      PDF_FILED_KEYS.HEADER_DATA
    );

    const paragraphLaw = PQFormattingService.createTextUnit(
      [
        pqNushTexts.withRequestResult,
        DocumentExtractionService.getField(tender, "tenderID", DEFAULT_TEXT_FIELDS.UNDERSCORES_16),
      ],
      PQ_PARAGRAPH_MARGIN,
      PDF_FILED_KEYS.HEADER_DATA
    );

    return [
      paragraphBuyer,
      paragraphSupplier,
      paragraphLaw,
      {
        text: [
          { text: pqNushTexts.guidedByLaw1 },
          {
            text: pqNushTexts.frameworkAgreement,
            style: PDF_FILED_KEYS.ITALIC_TEXT,
          },
          { text: pqNushTexts.guidedByLaw2 },
          {
            text: pqNushTexts.frameworkAgreement,
            style: PDF_FILED_KEYS.ITALIC_TEXT,
          },
          { text: pqNushTexts.guidedByLaw3 },
          {
            text: pqNushTexts.frameworkAgreement,
            style: PDF_FILED_KEYS.ITALIC_TEXT,
          },
          { text: pqNushTexts.guidedByLaw4 },
        ],
      },
    ];
  }
}
