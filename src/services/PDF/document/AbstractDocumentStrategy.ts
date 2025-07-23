import type { XMLParserInterface } from "@/services/Dom/XMLParserInterface";
import type { DocumentStrategyInterface } from "@/services/PDF/document/DocumentStrategyInterface";
import type { SignerType } from "@/types/sign/SignerType";
import { get } from "lodash";
import type { TimeType } from "types/sign/TimeType";
import { Assert } from "@/widgets/ErrorExceptionCore/Assert";
import { ERROR_MESSAGES } from "@/widgets/ErrorExceptionCore/configs/messages";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { LINE_LENGTH } from "@/constants/pdf/pdfHelperConstants";
import { FOOTER_COLUMN_MARGIN, FOOTER_MARGIN, FOOTER_QR_MARGIN } from "@/config/pdf/announcementConstants";
import { MONTHS_LIST } from "@/constants/monthList";
import { ANNOUNCEMENT_TEXTS_LIST } from "@/config/pdf/texts/ANNOUNCEMENT";
import { STRING } from "@/constants/string";
import { TypeChecker } from "@/utils/checker/TypeChecker";
import { EmptyChecker } from "@/utils/checker/EmptyChecker";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import { DEFAULT_QR_LINK } from "@/constants/env.ts";

export abstract class AbstractDocumentStrategy implements DocumentStrategyInterface {
  readonly typeChecker = new TypeChecker();
  readonly emptyChecker = new EmptyChecker();
  constructor(protected readonly xmlParser: XMLParserInterface) {}

  getSignerDate({ day, month, year }: TimeType): string {
    const leadingZeroMonth = month.toString().length > 1 ? `${month}` : `0${month}`;
    return `${day}.${leadingZeroMonth}.${year}`;
  }

  createFooter(signers?: SignerType[], link?: string): Record<string, any>[] {
    if (!signers) {
      Assert.isDefined(signers, ERROR_MESSAGES.VALIDATION_FAILED.signersObjectUnavailable);
      return [PDF_HELPER_CONST.EMPTY_FIELD];
    }

    const [{ subjectFullName, time }] = signers.slice(0, 1);

    return [
      {
        canvas: [{ type: "line", x1: 0, y1: 0, x2: LINE_LENGTH, y2: 0, lineWidth: 1 }],
      },
      {
        margin: FOOTER_MARGIN,
        columns: [
          {
            width: 250,
            margin: FOOTER_COLUMN_MARGIN,
            fontSize: 10,
            text: `${ANNOUNCEMENT_TEXTS_LIST.signer} ${subjectFullName}\n ${ANNOUNCEMENT_TEXTS_LIST.sign_date} ${this.getSignerDate(time)}`,
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
            qr: link || DEFAULT_QR_LINK,
            version: 9,
            fit: 100,
          },
        ],
      },
    ];
  }

  getDecisionDatePublished(dateStr: string, showMinutes = true, zeroDate = false): string {
    if (dateStr === ANNOUNCEMENT_TEXTS_LIST.missing_she) {
      return ANNOUNCEMENT_TEXTS_LIST.missing_she;
    }
    const date = new Date(dateStr);
    const twoDigit = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${zeroDate && !(date.getDate().toString().length > 1) ? "0" : ""}${date.getDate()} ${MONTHS_LIST[date.getMonth()]} ${date.getFullYear()} ${showMinutes ? twoDigit : ""}`;
  }

  getField<T>(object: Record<string, any>, path: string, defaultValue: T = "" as any): T {
    return (get(object, path) as T) || defaultValue;
  }

  getCustomerCategory(
    procuringEntity: Record<string, any>,
    organisationDictionary: Record<string, any> | undefined,
    title: string
  ): Record<string, any> {
    if (organisationDictionary === undefined) {
      return [PDF_HELPER_CONST.EMPTY_FIELD_DASH];
    }
    const entityKindTranslated = this.getField(
      organisationDictionary,
      `${this.getField(procuringEntity, "kind")}.title`,
      ""
    );

    return entityKindTranslated
      ? PDFTablesHandler.createTableLayout([
          PDFTablesHandler.createTableRow({
            head: title,
            data: entityKindTranslated,
          }),
        ])
      : this.showWithDefault("", title);
  }

  showIfAvailable(value: string, title: string, conditional = true): Record<string, any> {
    return conditional && value
      ? PDFTablesHandler.createTableLayout([
          PDFTablesHandler.createTableRow({
            head: title,
            data: value,
          }),
        ])
      : PDF_HELPER_CONST.EMPTY_FIELD;
  }

  showWithDefault(value: string, title: string, conditional = true): Record<string, any> {
    return PDFTablesHandler.createTableLayout([
      PDFTablesHandler.createTableRow({
        head: title,
        data: conditional && value ? value : STRING.DASH,
      }),
    ]);
  }

  getQuantity(obj: Record<string, any>, key: string): string {
    if (obj[key] === undefined) {
      return STRING.EMPTY;
    }
    if (0 === obj[key] || "0" === obj[key]) {
      return "0";
    }
    return this.getField(obj, key, STRING.EMPTY);
  }

  pageBreakBefore(): (
    currentNode?: Record<string, any>,
    followingNodesOnPage?: Record<string, any>,
    nodesOnNextPage?: Record<string, any>,
    previousNodesOnPage?: Record<string, any>
  ) => boolean | undefined {
    return function () {
      return undefined;
    };
  }

  /**
   * Якщо таблиця розміром більше ніж 1 листок,
   * то може появлятись лінія на футері,
   * що перекреслює контент в футері
   */
  resolveTableBug(table: Record<string, any>, title: Record<string, any>): Record<string, any> {
    return {
      layout: {
        hLineColor: (): string => "white",
        vLineColor: (): string => "white",
        defaultBorder: false,
      },
      headlineLevel: 1,
      table: {
        headerRows: 0,
        dontBreakRows: false,
        body: [[title], [table]],
        widths: [PDF_HELPER_CONST.ROW_ALL_WIDTH],
      },
    };
  }

  // checkup for different input data from api for response with data and without data inside general object
  unwrapTender<DataType>(file: string, getData = false): Record<string, any> | DataType {
    const rawData = JSON.parse(JSON.stringify(JSON.parse(file)).replace(STRING.EXTRA_LONG_DASH, STRING.DASH));

    if (rawData.hasOwnProperty("context") && !getData) {
      return rawData?.context?.tender as Record<string, any>;
    }

    if (rawData.hasOwnProperty("data")) {
      return rawData?.data as Record<string, any>;
    }

    return rawData;
  }

  abstract create(
    file: string,
    signers?: SignerType[],
    dictionaries?: Map<string, Record<string, any>>,
    tender?: Record<string, any>
  ): Record<string, any>[];

  abstract getPageMargins(): number[];
}
