import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { XML_SELECTORS_LIST } from "@/config/pdf/selectorsList";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { REGEX } from "@/constants/regex";
import { StringHandler } from "@/utils/StringHandler";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { DEFAULT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import { XML_RESULT_TESTS_LIST, XML_TEXTS_LIST } from "@/config/pdf/texts/XML";
import { XMLParser } from "@/services/Dom/XMLParser";

export class XmlDataMaker extends AbstractDocumentStrategy {
  private readonly xmlParser = new XMLParser();

  private static calculateRowSpan(data: Record<string, string>, isIndividual: boolean): number {
    let quantity = PDF_HELPER_CONST.ROW_COUNT_10;

    if (isIndividual) {
      quantity -= PDF_HELPER_CONST.ROW_COUNT_6;
    }
    if (!data.R0202G1S) {
      quantity -= PDF_HELPER_CONST.ROW_COUNT_2;
    }
    if (!data.R0203G1S && !isIndividual) {
      quantity -= PDF_HELPER_CONST.ROW_COUNT_2;
    }
    if (!data.R0204G1S && !isIndividual) {
      quantity -= PDF_HELPER_CONST.ROW_COUNT_2;
    }

    return quantity;
  }

  create(file: string): Record<string, any>[] {
    const data: Record<string, string> = this.xmlParser.getData(file, XML_SELECTORS_LIST);
    const date = StringHandler.formatToDate(data.HFILL);
    const isIndividual: boolean = REGEX.NUMBER.EIGHT_SYMBOLS.test(data.R0201G1S);
    const rowSpan: number = XmlDataMaker.calculateRowSpan(data, isIndividual);
    const debtMark: string =
      data.R0301G1S === PDF_HELPER_CONST.REQUEST_RESULT_IS_INFORMATION_PROVIDED
        ? XML_RESULT_TESTS_LIST.R0401G1S[data.R0401G1S]
        : "";

    return [
      {
        style: PDF_FILED_KEYS.HEADING,
        text: XML_TEXTS_LIST.title,
      },
      {
        style: PDF_FILED_KEYS.HEADING,
        text: XML_TEXTS_LIST.subtitle,
      },
      {
        margin: [
          PDF_HELPER_CONST.MARGIN_0,
          PDF_HELPER_CONST.MARGIN_30,
          PDF_HELPER_CONST.MARGIN_0,
          PDF_HELPER_CONST.MARGIN_0,
        ],
        table: {
          widths: [PDF_HELPER_CONST.ROW_WIDTH_150, PDF_HELPER_CONST.ROW_AUTO_WIDTH, PDF_HELPER_CONST.ROW_ALL_WIDTH],
          body: [
            [
              {
                rowSpan: PDF_HELPER_CONST.ROW_COUNT_4,
                text: XML_TEXTS_LIST.group1,
              },
              {
                colSpan: PDF_HELPER_CONST.TWO_COLS,
                style: PDF_FILED_KEYS.CONTENT,
                text: data.HNAME,
              },
              PDF_HELPER_CONST.EMPTY_FIELD,
            ],
            [
              PDF_HELPER_CONST.EMPTY_FIELD,
              {
                colSpan: PDF_HELPER_CONST.TWO_COLS,
                style: PDF_FILED_KEYS.DESCRIPTION,
                text: XML_TEXTS_LIST.HNAME,
              },
              PDF_HELPER_CONST.EMPTY_FIELD,
            ],
            [
              PDF_HELPER_CONST.EMPTY_FIELD,
              {
                colSpan: PDF_HELPER_CONST.TWO_COLS,
                style: PDF_FILED_KEYS.CONTENT,
                text: data.HTIN,
              },
              PDF_HELPER_CONST.EMPTY_FIELD,
            ],
            [
              PDF_HELPER_CONST.EMPTY_FIELD,
              {
                colSpan: PDF_HELPER_CONST.TWO_COLS,
                style: PDF_FILED_KEYS.DESCRIPTION,
                text: XML_TEXTS_LIST.HTIN,
              },
              PDF_HELPER_CONST.EMPTY_FIELD,
            ],
            [
              {
                rowSpan: PDF_HELPER_CONST.TWO_COLS,
                text: XML_TEXTS_LIST.group2,
              },
              {
                style: PDF_FILED_KEYS.CONTENT,
                text: data.HKSTI,
              },
              {
                style: PDF_FILED_KEYS.CONTENT,
                text: data.HSTI,
              },
            ],
            [
              PDF_HELPER_CONST.EMPTY_FIELD,
              {
                colSpan: PDF_HELPER_CONST.TWO_COLS,
                style: PDF_FILED_KEYS.DESCRIPTION,
                text: XML_TEXTS_LIST.HKSTI_HSTI,
              },
              PDF_HELPER_CONST.EMPTY_FIELD,
            ],
          ],
        },
      },
      {
        margin: [
          PDF_HELPER_CONST.MARGIN_0,
          PDF_HELPER_CONST.MARGIN_10,
          PDF_HELPER_CONST.MARGIN_0,
          PDF_HELPER_CONST.MARGIN_0,
        ],
        table: {
          widths: [PDF_HELPER_CONST.ROW_WIDTH_150, PDF_HELPER_CONST.ROW_ALL_WIDTH],
          body: [
            [
              {
                rowSpan,
                text: XML_TEXTS_LIST.group3,
              },
              {
                style: PDF_FILED_KEYS.CONTENT,
                text: data.R0201G1S,
              },
            ],
            [
              PDF_HELPER_CONST.EMPTY_FIELD,
              {
                style: PDF_FILED_KEYS.DESCRIPTION,
                text: XML_TEXTS_LIST.R0201G1S,
              },
            ],
            ...(data.R0202G1S
              ? [
                  [
                    PDF_HELPER_CONST.EMPTY_FIELD,
                    {
                      style: PDF_FILED_KEYS.CONTENT,
                      text: data.R0202G1S,
                    },
                  ],
                ]
              : []),
            ...(data.R0202G1S
              ? [
                  [
                    PDF_HELPER_CONST.EMPTY_FIELD,
                    {
                      style: PDF_FILED_KEYS.DESCRIPTION,
                      text: XML_TEXTS_LIST.R0202G1S,
                    },
                  ],
                ]
              : []),
            ...(data.R0203G1S && !isIndividual
              ? [
                  [
                    PDF_HELPER_CONST.EMPTY_FIELD,
                    {
                      style: PDF_FILED_KEYS.CONTENT,
                      text: data.R0203G1S,
                    },
                  ],
                ]
              : []),
            ...(data.R0203G1S && !isIndividual
              ? [
                  [
                    PDF_HELPER_CONST.EMPTY_FIELD,
                    {
                      style: PDF_FILED_KEYS.DESCRIPTION,
                      text: XML_TEXTS_LIST.R0203G1S,
                    },
                  ],
                ]
              : []),
            ...(data.R0204G1S && !isIndividual
              ? [
                  [
                    PDF_HELPER_CONST.EMPTY_FIELD,
                    {
                      style: PDF_FILED_KEYS.CONTENT,
                      text: data.R0204G1S,
                    },
                  ],
                ]
              : []),
            ...(data.R0204G1S && !isIndividual
              ? [
                  [
                    PDF_HELPER_CONST.EMPTY_FIELD,
                    {
                      style: PDF_FILED_KEYS.DESCRIPTION,
                      text: XML_TEXTS_LIST.R0204G1S,
                    },
                  ],
                ]
              : []),
            ...(!isIndividual
              ? [
                  [
                    PDF_HELPER_CONST.EMPTY_FIELD,
                    {
                      style: PDF_FILED_KEYS.CONTENT,
                      text: data.R0201G1S,
                    },
                  ],
                ]
              : []),
            ...(!isIndividual
              ? [
                  [
                    PDF_HELPER_CONST.EMPTY_FIELD,
                    {
                      style: PDF_FILED_KEYS.DESCRIPTION,
                      text: XML_TEXTS_LIST.R0201G1S_2,
                    },
                  ],
                ]
              : []),
          ],
        },
      },
      {
        margin: [
          PDF_HELPER_CONST.MARGIN_0,
          PDF_HELPER_CONST.MARGIN_10,
          PDF_HELPER_CONST.MARGIN_0,
          PDF_HELPER_CONST.MARGIN_0,
        ],
        table: {
          widths: [PDF_HELPER_CONST.ROW_WIDTH_150, PDF_HELPER_CONST.ROW_ALL_WIDTH],
          body: [
            [
              XML_TEXTS_LIST.R0301G1S,
              {
                style: PDF_FILED_KEYS.CONTENT,
                text: XML_RESULT_TESTS_LIST.R0301G1S[data.R0301G1S],
              },
            ],
          ],
        },
      },
      {
        margin: [
          PDF_HELPER_CONST.MARGIN_0,
          PDF_HELPER_CONST.MARGIN_10,
          PDF_HELPER_CONST.MARGIN_0,
          PDF_HELPER_CONST.MARGIN_0,
        ],
        table: {
          widths: [PDF_HELPER_CONST.ROW_WIDTH_150, PDF_HELPER_CONST.ROW_ALL_WIDTH],
          body: [
            [
              XML_TEXTS_LIST.R0401G1S,
              {
                style: PDF_FILED_KEYS.HEADING,
                text: debtMark,
              },
            ],
          ],
        },
      },
      {
        margin: [
          PDF_HELPER_CONST.MARGIN_0,
          PDF_HELPER_CONST.MARGIN_30,
          PDF_HELPER_CONST.MARGIN_0,
          PDF_HELPER_CONST.MARGIN_0,
        ],
        text: [
          XML_TEXTS_LIST.HFILL_HTIME + XML_TEXTS_LIST.SPACE_LARGE,
          {
            style: PDF_FILED_KEYS.DATE,
            text: date,
          },
          XML_TEXTS_LIST.SPACE_LARGE,
          {
            style: PDF_FILED_KEYS.DATE,
            text: data.HTIME,
          },
        ],
      },
    ];
  }

  createFooter(): Record<string, any>[] {
    return [PDF_HELPER_CONST.EMPTY_FIELD];
  }

  getPageMargins(): number[] {
    return DEFAULT_PAGE_MARGIN;
  }
}
