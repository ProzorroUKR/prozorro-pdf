import { STRING } from "@/constants/string";
import { EDR } from "@/config/pdf/texts/EDR";
import { DateHandler } from "@/utils/DateHandler";
import { PDF_STYLES } from "@/config/pdf/pdfStyles";
import type { SignerType } from "@/types/sign/SignerType";
import { StringHandler } from "@/utils/StringHandler";
import { ADDRESS_ORDER } from "@/config/pdf/addressOrder";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import type { ClassificationType } from "@/types/Tender/ClassificationType";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import type { EdrDataType, EdrFounderType, EdrType } from "@/types/Edr/EdrType";
import { MARGIN_TOP_10 } from "@/config/pdf/conclusionOfMonitoringConstants";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import { ErrorExceptionCore } from "@/widgets/ErrorExceptionCore/ErrorExceptionCore";
import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { LINE_LENGTH, ROW_ALL_WIDTH, ROW_WIDTH_100, ROW_WIDTH_150 } from "@/constants/pdf/pdfHelperConstants";
import { ClassificationTransformer } from "@/widgets/pq/services/Classification/ClassificationTransformer";
import {
  ANNOUNCEMENT_PAGE_MARGIN,
  FOOTER_COLUMN_MARGIN,
  FOOTER_MARGIN,
  FOOTER_QR_MARGIN,
} from "@/config/pdf/announcementConstants";
import { ANNOUNCEMENT_TEXTS_LIST } from "@/config/pdf/texts/ANNOUNCEMENT";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";
import { PROZORRO_PDF_ERROR_CODES } from "@/widgets/ErrorExceptionCore/constants/ERROR_CODES.enum.ts";

export class EdrDataMaker extends AbstractDocumentStrategy {
  private _metaSourceDate = "";

  create({ data, error, meta }: EdrType, _: PdfDocumentConfigType): Record<string, any>[] {
    this._metaSourceDate = meta.sourceDate;

    if (error || !data) {
      throw new ErrorExceptionCore({
        code: PROZORRO_PDF_ERROR_CODES.VALIDATION_FAILED,
        message: ERROR_MESSAGES.VALIDATION_FAILED.wrongEdrFile,
      });
    }

    return [
      {
        style: PDF_FILED_KEYS.HEADING_TITLE,
        text: EDR.title,
      },
      {
        style: PDF_FILED_KEYS.SECOND_HEADING_TITLE,
        text: EDR.subtitle,
      },
      this._getIdentificationTable(data),
      this._getFoundersTable(data.founders || []),
      this._getActivityKindTable(data),
    ];
  }

  createFooter(_?: SignerType[], link?: string): Record<string, any>[] {
    Assert.isDefined(link, ERROR_MESSAGES.INVALID_PARAMS.undefinedUrl, PROZORRO_PDF_ERROR_CODES.INVALID_PARAMS);

    return [
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: LINE_LENGTH, y2: 0, lineWidth: 1 }] },
      {
        margin: FOOTER_MARGIN,
        columns: [
          {
            width: 250,
            margin: FOOTER_COLUMN_MARGIN,
            fontSize: 10,
            text: `${EDR.current_on} ${DateHandler.formatISODate(this._metaSourceDate)}`,
          },
          {
            width: 190,
            margin: FOOTER_COLUMN_MARGIN,
            fontSize: 10,
            alignment: "right",
            text: ANNOUNCEMENT_TEXTS_LIST.original_doc,
          },
          {
            margin: FOOTER_QR_MARGIN,
            qr: link,
            version: 9,
            fit: 100,
          },
        ],
      },
    ];
  }

  getPageMargins(): number[] {
    return ANNOUNCEMENT_PAGE_MARGIN;
  }

  private _getIdentificationTable(data: EdrDataType): Record<string, any> {
    return {
      table: {
        widths: [ROW_WIDTH_150, ROW_ALL_WIDTH],
        body: [
          this._getIdentificationTableRow(EDR.legal_name, this.getField(data, "identification.legalName")),
          this._getIdentificationTableRow(EDR.scheme, this.getField(data, "identification.scheme")),
          this._getIdentificationTableRow(EDR.identification_id, this.getField(data, "identification.id", STRING.DASH)),
          this._getIdentificationTableRow(EDR.name, data.name || STRING.DASH),
          this._getIdentificationTableRow(EDR.registration_status, this.getField(data, "registrationStatusDetails")),
          this._getIdentificationTableRow(EDR.management, data.management || STRING.DASH),
          this._getIdentificationTableRow(
            EDR.address,
            StringHandler.customerLocation(this.getField(data, "address"), STRING.DASH, ADDRESS_ORDER.EDR_LOCATION)
          ),
        ],
      },
      margin: MARGIN_TOP_10,
    };
  }

  private _getFoundersTable(founders: EdrFounderType[]): Record<string, any> {
    const foundersColumnsList = (founders.length ? founders : [PDF_HELPER_CONST.EMPTY_FIELD]).map(founder => [
      this._getTableCell(this.getField(founder, "name", STRING.DASH)),
      this._getTableCell(this.getField(founder, "code", STRING.DASH)),
      this._getTableCell(this.getField(founder, "capital", STRING.DASH)),
      this._getTableCell(
        StringHandler.customerLocation(this.getField(founder, "address"), STRING.DASH, ADDRESS_ORDER.EDR_LOCATION)
      ),
    ]);

    return {
      margin: MARGIN_TOP_10,
      table: {
        widths: [ROW_WIDTH_150, ROW_WIDTH_100, ROW_WIDTH_100, ROW_ALL_WIDTH],
        body: [
          [
            {
              colSpan: 4,
              style: PDF_STYLES.pq_title,
              text: EDR.founders_title,
            },
            PDF_HELPER_CONST.EMPTY_FIELD,
            PDF_HELPER_CONST.EMPTY_FIELD,
            PDF_HELPER_CONST.EMPTY_FIELD,
          ],
          [
            this._getTableCell(EDR.founder_name, true),
            this._getTableCell(EDR.founder_code, true),
            this._getTableCell(EDR.founder_capital, true),
            this._getTableCell(EDR.founder_address, true),
          ],
          ...foundersColumnsList,
        ],
      },
    };
  }

  private _getActivityKindTable(data: EdrDataType): Record<string, any> {
    return {
      margin: MARGIN_TOP_10,
      table: {
        widths: [ROW_WIDTH_100, ROW_ALL_WIDTH],
        body: [
          [
            {
              colSpan: 2,
              style: PDF_STYLES.pq_title,
              text: EDR.kind_title,
            },
            PDF_HELPER_CONST.EMPTY_FIELD,
          ],
          [this._getTableCell(EDR.main_kind, true), this._getTableCell(this._getFormatedKind(data.activityKind))],
          ...this._getAdditionalActivityKindRows(data.additionalActivityKinds),
        ],
      },
    };
  }

  private _getIdentificationTableRow(
    left: string,
    right: string | Record<string, any>,
    leftBold = true
  ): Record<string, any>[] {
    return [this._getTableCell(left, leftBold), this._getTableCell(right)];
  }

  private _getTableCell(text: string | Record<string, any>, bold = false): Record<string, any> {
    return {
      style: bold ? PDF_STYLES.table_head : PDF_STYLES.table_data,
      text,
    };
  }

  private _getAdditionalActivityKindRows(kinds?: ClassificationType[]): Record<string, any>[][] {
    const list: Array<ClassificationType | undefined> = kinds?.length ? kinds : [undefined];
    return list.map((kind: ClassificationType | undefined, index: number) => [
      index
        ? PDF_HELPER_CONST.EMPTY_FIELD
        : {
            style: PDF_STYLES.table_head,
            text: EDR.additional_kind,
            rowSpan: kinds?.length || 1,
          },
      this._getTableCell(this._getFormatedKind(kind)),
    ]);
  }

  private _getFormatedKind(kind?: ClassificationType): string {
    return kind ? ClassificationTransformer.formatClassification(kind) : STRING.DASH;
  }
}
