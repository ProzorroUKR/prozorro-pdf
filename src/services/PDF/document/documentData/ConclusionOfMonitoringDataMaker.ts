import { get } from "lodash";
import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import * as CONCLUSION_OF_MONITORING_CONST from "@/config/pdf/conclusionOfMonitoringConstants";
import type { SignerType } from "@/types/sign/SignerType";
import { STRING } from "@/constants/string";
import { ArrayHandler } from "@/utils/ArrayHandler";
import {
  CONCLUSION_INFO_ABOUT_DISCLOSURE,
  CONCLUSION_PROCURING_ENTITY_KEYS,
  CONCLUSION_SUBJECT_PURCHASE_KEYS,
} from "@/config/pdf/selectorsList";
import { DEFAULT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import { afterXDate, afterYDate, beforeXDate } from "@/config/pdf/conclusionOfMonitoringConstants";
import { CONCLUSION_OF_MONITORING_TEXTS_LIST } from "@/config/pdf/texts/CONCLUSION_OF_MONITORING";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import type { PdfDocumentConfigType } from "@/types/pdf/PdfDocumentConfigType";

export class ConclusionOfMonitoringDataMaker extends AbstractDocumentStrategy {
  createFooter(): Record<string, any>[] {
    return [PDF_HELPER_CONST.EMPTY_FIELD];
  }

  getPageMargins(): number[] {
    return DEFAULT_PAGE_MARGIN;
  }

  public create(
    { tender, monitoring }: Record<any, any>,
    _config: PdfDocumentConfigType,
    signers: SignerType[]
  ): Record<string, any>[] {
    const conclusionDateCreated = this.getField<string>(monitoring, "conclusion-date-created");
    const firstSigner: SignerType = ArrayHandler.getFirstElement(signers) as SignerType;
    const lastSigner: SignerType = ArrayHandler.getLastElement(signers) as SignerType;
    const signerPosition: Record<string, any> = {
      first: this.getField(monitoring, "author-position"),
      last: STRING.EMPTY,
    };

    if (get(monitoring, "positions")) {
      const { positions } = monitoring as { positions: string[] };
      signerPosition.first = ArrayHandler.getFirstElement(positions);
      signerPosition.last = ArrayHandler.getLastElement<string>(positions) || "";
    }

    return [
      {
        layout: PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS,
        table: {
          widths: [PDF_HELPER_CONST.ROW_WIDTH_270, PDF_HELPER_CONST.ROW_WIDTH_200, PDF_HELPER_CONST.MARGIN_50],
          body: [
            [
              PDF_HELPER_CONST.EMPTY_FIELD,
              {
                text: CONCLUSION_OF_MONITORING_TEXTS_LIST.approve,
                style: PDF_FILED_KEYS.FIELD_TEXT,
              },
              PDF_HELPER_CONST.EMPTY_FIELD,
            ],
            [
              PDF_HELPER_CONST.EMPTY_FIELD,
              {
                text: signerPosition.last,
                style: PDF_FILED_KEYS.FIELD_TEXT,
              },
              PDF_HELPER_CONST.EMPTY_FIELD,
            ],
            [
              PDF_HELPER_CONST.EMPTY_FIELD,
              {
                margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_BOTTOM_3,
                text: CONCLUSION_OF_MONITORING_TEXTS_LIST.underline_spaces,
                style: PDF_FILED_KEYS.UNDERLINE,
              },
              PDF_HELPER_CONST.EMPTY_FIELD,
            ],
            this.createTextDescriptionFieldRow(CONCLUSION_OF_MONITORING_TEXTS_LIST.position),
            this.createTextFieldRow({
              margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_10,
              text: firstSigner.subjectFullName,
            }),
            [
              PDF_HELPER_CONST.EMPTY_FIELD,
              {
                margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_BOTTOM_3,
                text: CONCLUSION_OF_MONITORING_TEXTS_LIST.underline_spaces,
                style: PDF_FILED_KEYS.UNDERLINE,
              },
              PDF_HELPER_CONST.EMPTY_FIELD,
            ],
            this.createTextDescriptionFieldRow(this.getCurrentKey("signFullName", conclusionDateCreated) as string),
            this.createTextFieldRow({
              margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_10,
              text: this.getSignerDate(firstSigner.time),
            }),
            [
              PDF_HELPER_CONST.EMPTY_FIELD,
              {
                margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_BOTTOM_3,
                text: CONCLUSION_OF_MONITORING_TEXTS_LIST.underline_spaces,
                style: PDF_FILED_KEYS.UNDERLINE,
              },
              PDF_HELPER_CONST.EMPTY_FIELD,
            ],
            this.createTextDescriptionFieldRow(CONCLUSION_OF_MONITORING_TEXTS_LIST.date),
          ],
        },
      },
      {
        text: CONCLUSION_OF_MONITORING_TEXTS_LIST.title,
        style: PDF_FILED_KEYS.HEADING_TITLE,
      },
      {
        margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_3,
        text: CONCLUSION_OF_MONITORING_TEXTS_LIST.result_text,
        style: this.getCurrentKey("resultText", conclusionDateCreated),
      },
      {
        text: `${this.getCurrentKey("human-id", conclusionDateCreated)}${this.getField(tender, "human-id")}`,
        style: PDF_FILED_KEYS.TITLE_MEDIUM,
      },
      this.createSubTitleRow(CONCLUSION_OF_MONITORING_TEXTS_LIST.title_introduction),
      this.createTableLayoutCurrent([
        PDFTablesHandler.createTableRow({
          head: this.getCurrentKey("customerInfo", conclusionDateCreated) as string,
          data: this.transformKeysListToSting(tender, CONCLUSION_PROCURING_ENTITY_KEYS),
          hasMargin: false,
        }),
        PDFTablesHandler.createTableRow({
          head: this.getCurrentKey("infoAboutSubject", conclusionDateCreated) as string,
          data: this.getSubjectPurchase(
            (tender as { item: Record<any, any>[] }).item,
            (tender as Record<any, any>).value
          ),
          marginTop: true,
        }),
        PDFTablesHandler.createTableRow({
          head: CONCLUSION_OF_MONITORING_TEXTS_LIST.info_about_disclosure,
          data: this.transformKeysListToSting(tender, CONCLUSION_INFO_ABOUT_DISCLOSURE),
          marginTop: true,
        }),
        PDFTablesHandler.createTableRow({
          head: CONCLUSION_OF_MONITORING_TEXTS_LIST.procurement_procedure,
          data: this.getField(tender, "procurement-method-type"),
          marginTop: true,
        }),
        PDFTablesHandler.createTableRow({
          head: CONCLUSION_OF_MONITORING_TEXTS_LIST.grounds_for_monitoring,
          data: this.getMonitoringReasonsList((monitoring as { reasons: string[] }).reasons),
          marginTop: true,
        }),
        PDFTablesHandler.createTableRow({
          head: CONCLUSION_OF_MONITORING_TEXTS_LIST.monitoring_start_date,
          data: this.getDecisionDatePublished(this.getField(monitoring, "decision-date-published")),
          marginTop: true,
        }),
      ]),
      this.createSubTitleRow(CONCLUSION_OF_MONITORING_TEXTS_LIST.title_concluding_part),
      this.createTableLayoutCurrent([
        PDFTablesHandler.createTableRow({
          head: CONCLUSION_OF_MONITORING_TEXTS_LIST.monitoring_end_date,
          data: this.getField(monitoring, "audit-finding"),
          hasMargin: false,
        }),
        PDFTablesHandler.createTableRow({
          head: this.getCurrentKey("conclusionOnPresence", conclusionDateCreated) as string,
          data: this.getField(monitoring, "description"),
          marginTop: true,
        }),
        PDFTablesHandler.createTableRow({
          head: CONCLUSION_OF_MONITORING_TEXTS_LIST.commitment,
          data: this.getField(monitoring, "strings-attached"),
          marginTop: true,
        }),
      ]),
      {
        layout: PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS,
        table: {
          widths: [PDF_HELPER_CONST.ROW_ALL_WIDTH, PDF_HELPER_CONST.ROW_WIDTH_180, PDF_HELPER_CONST.ROW_ALL_WIDTH],
          body: [
            [
              this.createTextFieldRow({
                margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_30,
                text: signerPosition.first,
              }),
              PDF_HELPER_CONST.EMPTY_FIELD,
              this.createTextFieldRow({
                margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_30,
                text: lastSigner.subjectFullName,
              }),
            ],
            [
              {
                margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_BOTTOM_3,
                text: CONCLUSION_OF_MONITORING_TEXTS_LIST.underline_spaces,
                style: PDF_FILED_KEYS.UNDERLINE,
              },
              this.getCurrentKey("signSpace", conclusionDateCreated),
              {
                margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_BOTTOM_3,
                text: CONCLUSION_OF_MONITORING_TEXTS_LIST.underline_spaces,
                style: PDF_FILED_KEYS.UNDERLINE,
              },
            ],
            [
              this.createTextDescriptionFieldRow(this.getCurrentKey("position2", conclusionDateCreated) as string),
              this.getCurrentKey("signTitle", conclusionDateCreated),
              this.createTextDescriptionFieldRow(this.getCurrentKey("fullName", conclusionDateCreated) as string),
            ],
          ],
        },
      },
      {
        text: this.getCurrentKey("afterText", conclusionDateCreated) as string,
        style: PDF_FILED_KEYS.ITALIC_TEXT,
        margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_10,
      },
    ];
  }
  private createTextFieldRow(config: Record<string, any>): Record<string, any>[] {
    return [
      PDF_HELPER_CONST.EMPTY_FIELD,
      Object.assign(config, CONCLUSION_OF_MONITORING_CONST.TEXT_FIELD),
      PDF_HELPER_CONST.EMPTY_FIELD,
    ];
  }

  private createTextDescriptionFieldRow(text: string): Record<string, any>[] {
    return [
      PDF_HELPER_CONST.EMPTY_FIELD,
      {
        text,
        style: PDF_FILED_KEYS.FIELD_DESCRIPTION_TEXT,
      },
      PDF_HELPER_CONST.EMPTY_FIELD,
    ];
  }

  private createSubTitleRow(text: string): Record<string, any> {
    return {
      text,
      style: PDF_FILED_KEYS.TITLE_LARGE,
      margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_30__BOTTOM_15,
    };
  }

  private createTableLayoutCurrent(body: Record<string, any>[][]): Record<string, any> {
    return {
      layout: PDF_HELPER_CONST.TABLE_LAYOUT_NO_BORDERS,
      table: {
        widths: [PDF_HELPER_CONST.ROW_WIDTH_200, PDF_HELPER_CONST.ROW_WIDTH_300],
        body,
      },
    };
  }

  private getSubjectPurchase(items: Record<string, string>[], value: { amount: number; currency: string }): string {
    return items
      .map(item => ({
        ...item,
        value: `${value.amount} ${value.currency}`,
      }))
      .map(item => `${this.transformKeysListToSting(item, CONCLUSION_SUBJECT_PURCHASE_KEYS)} \n`)
      .join(STRING.EMPTY);
  }

  private getMonitoringReasonsList(list?: string[]): string {
    return (list || []).map(item => `• ${item} \n`).join(STRING.EMPTY);
  }

  private transformKeysListToSting(data: Record<string, any>, keysList: string[]): string {
    return keysList
      .map((key, index) => {
        const field: string = this.getField(data, key);
        const hasComma = keysList.length !== index + 1 && field;
        const separator = hasComma ? STRING.DELIMITER.COMMA : STRING.EMPTY;

        return `${field}${separator}`;
      })
      .join(STRING.EMPTY);
  }

  private getCurrentKey(key: string, date: string): string | Record<string, any> {
    const dateSize = 10; // replace with date from tender
    const currentDate = date.slice(0, dateSize);

    if (currentDate > this.envVars.conclusion.yDate) {
      return afterYDate.get(key) || STRING.EMPTY;
    }

    return currentDate > this.envVars.conclusion.xDate
      ? afterXDate.get(key) || STRING.EMPTY
      : beforeXDate.get(key) || STRING.EMPTY;
  }
}
