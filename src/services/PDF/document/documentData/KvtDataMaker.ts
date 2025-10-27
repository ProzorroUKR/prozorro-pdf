import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { KVT_SELECTORS_LIST } from "@/config/pdf/selectorsList";
import { StringHandler } from "@/utils/StringHandler";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { MARGIN_50, MARGIN_0 } from "@/constants/pdf/pdfHelperConstants";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { DEFAULT_PAGE_MARGIN } from "@/config/pdf/announcementConstants";
import { KVT_TEXTS_LIST } from "@/config/pdf/texts/KVT";
import { XMLParser } from "@/services/Dom/XMLParser";

export class KvtDataMaker extends AbstractDocumentStrategy {
  private readonly xmlParser = new XMLParser();

  createFooter(): Record<string, any>[] {
    return [PDF_HELPER_CONST.EMPTY_FIELD];
  }

  getPageMargins(): number[] {
    return DEFAULT_PAGE_MARGIN;
  }

  create(file: string): Record<string, any>[] {
    const data: Record<string, string> = this.xmlParser.getData(file, KVT_SELECTORS_LIST);
    const date: string = StringHandler.formatToDate(data.HDATE);

    return [
      {
        style: PDF_FILED_KEYS.HEADING,
        text: data.HDOCNAME,
      },
      {
        margin: [MARGIN_0, MARGIN_50],
        text: KVT_TEXTS_LIST.HRESULT + KVT_TEXTS_LIST.SPACE_LARGE + data.HRESULT,
      },
      {
        text: [
          KVT_TEXTS_LIST.HDATE_HTIME + KVT_TEXTS_LIST.SPACE_LARGE,
          {
            style: PDF_FILED_KEYS.DATE,
            text: date,
          },
          KVT_TEXTS_LIST.SPACE_LARGE,
          {
            style: PDF_FILED_KEYS.DATE,
            text: data.HTIME,
          },
        ],
      },
    ];
  }
}
