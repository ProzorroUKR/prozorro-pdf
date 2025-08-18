import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import {
  FOOTER_COLUMN_MARGIN,
  FOOTER_MARGIN,
  FOOTER_QR_MARGIN,
  TABLE_COLUMN_RIGHT_MARGIN,
} from "@/config/pdf/announcementConstants";
import { ArrayHandler } from "@/utils/ArrayHandler";
import type { SignerType } from "@/types/sign/SignerType";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { NAZK_DOCUMENT_TYPE, NAZK_TITLE } from "@/constants/nazk";
import { LINE_LENGTH } from "@/constants/pdf/pdfHelperConstants";
import { NAZK_PAGE_MARGIN } from "@/config/pdf/nazkConstants";
import { NAZK_TEXTS_LISTS } from "@/config/pdf/texts/NAZK";
import { ANNOUNCEMENT_TEXTS_LIST } from "@/config/pdf/texts/ANNOUNCEMENT";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";

export class NazkDataMaker extends AbstractDocumentStrategy {
  public create(
    nazkReport: Record<any, any>,
    _config: PdfDocumentConfigType,
    _signers?: SignerType[],
    _dictionaries?: Map<string, Record<string, any>>,
    award?: Record<string, any>
  ): Record<string, any>[] {
    if (!award) {
      return [];
    }

    const currentDocuments = (award.documents as []).filter(
      (doc: Record<string, any>) => doc.title === NAZK_TITLE && doc.documentType === NAZK_DOCUMENT_TYPE
    );
    const document = ArrayHandler.getLastElement(currentDocuments);

    Assert.isDefined(document, ERROR_MESSAGES.VALIDATION_FAILED.undefinedDocumentTitle);

    return [
      {
        text: NAZK_TEXTS_LISTS.title,
        style: PDF_FILED_KEYS.HEADING,
      },
      PDFTablesHandler.createTableLayout(
        [
          PDFTablesHandler.createTableRow({
            head: NAZK_TEXTS_LISTS.ur_person,
            data:
              this.getField(award, "suppliers.[0].identifier.legalName") || this.getField(award, "suppliers.[0].name"),
          }),
          PDFTablesHandler.createTableRow({
            head: NAZK_TEXTS_LISTS.id_code,
            data: this.getField(award, "suppliers.[0].identifier.id"),
          }),
          PDFTablesHandler.createTableRow({
            head: NAZK_TEXTS_LISTS.criminal_mark,
            data: this.getField(nazkReport, "items") ? NAZK_TEXTS_LISTS.criminal_full : NAZK_TEXTS_LISTS.criminal_empty,
          }),
        ],
        true,
        FOOTER_COLUMN_MARGIN
      ),
      {
        text: `${NAZK_TEXTS_LISTS.formation_date} ${this.getDecisionDatePublished(this.getField(document, "dateModified"))}`,
        style: PDF_FILED_KEYS.TABLE_DATA,
      },
    ];
  }

  createFooter(_?: SignerType[], link?: string): Record<string, any>[] {
    return [
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: LINE_LENGTH, y2: 0, lineWidth: 1 }] },
      {
        margin: FOOTER_MARGIN,
        columns: [
          {
            width: 140,
            margin: FOOTER_QR_MARGIN,
            qr: link,
            fit: 110,
          },
          {
            width: 180,
            margin: TABLE_COLUMN_RIGHT_MARGIN,
            fontSize: 10,
            text: ANNOUNCEMENT_TEXTS_LIST.original_doc,
          },
          {},
          {},
        ],
      },
    ];
  }

  getPageMargins(): number[] {
    return NAZK_PAGE_MARGIN;
  }
}
