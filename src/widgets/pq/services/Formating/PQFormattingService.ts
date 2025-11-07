import { TypeChecker } from "@/utils/checker/TypeChecker";
import type {
  CompoundTextType,
  OlConfigType,
  OlFromConfigAccumulatorType,
  OlPdfType,
  TableBodyConfigType,
} from "@/widgets/pq/types/TextConfigType";
import { PdfItemEnum } from "@/widgets/pq/types/TextConfigType";
import { STRING } from "@/constants/string";
import { PQ_LIST_HEADING_MARGIN, PQ_PARAGRAPH_MARGIN } from "@/widgets/pq/configs/margins";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { CompoundTextAdapter } from "@/widgets/pq/services/Formating/CompoundTextAdapter";
import { TemplateToPqTitlesMap } from "@/widgets/pq/configs/TemplateToPqTitles.map";
import { generalTitlesConfig } from "@/widgets/pq/configs/pqTitles";
import { pqBase } from "@/widgets/pq/configs/pqTexts";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import { LINE_HEIGHT_20 } from "@/constants/pdf/pdfHelperConstants";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";

export class PQFormattingService {
  static getLocationTitle(contractTemplateParam: PROZORRO_TEMPLATE_CODES): Record<string, any> {
    const titles = TemplateToPqTitlesMap.get(contractTemplateParam) || generalTitlesConfig;
    const index = Object.keys(titles).length;

    return {
      margin: PQ_LIST_HEADING_MARGIN,
      text: `${index + 1}. ${pqBase.location}`,
      style: PDF_FILED_KEYS.HEADING,
    };
  }

  static createTextUnit(
    text: string | OlConfigType,
    margin = PQ_PARAGRAPH_MARGIN,
    style = PDF_FILED_KEYS.REGULAR_CONTENT
  ): Record<string, any> {
    return {
      text,
      style,
      margin,
    };
  }

  static createUnitHeader(
    title: string,
    index: number,
    style = PDF_FILED_KEYS.HEADING,
    margin = PQ_LIST_HEADING_MARGIN
  ): Record<string, any> {
    return {
      text: `${index + 1}. ${title}`,
      style,
      margin,
    };
  }

  static formatOlItem(
    text: string,
    listIndex = -1,
    itemIndex = 1,
    indexReducer = 0,
    margin = PQ_PARAGRAPH_MARGIN
  ): OlPdfType {
    const separatorPrefix = listIndex < 0 ? STRING.EMPTY : `${listIndex + 1}.`;

    return {
      separator: [separatorPrefix, STRING.DOT],
      start: itemIndex + 1 - indexReducer,
      ol: [
        {
          text,
          style: PDF_FILED_KEYS.REGULAR_CONTENT,
          margin,
        },
      ],
    };
  }

  static formatTable(
    { header = [], text, paths, defaults, widths }: CompoundTextType,
    dataObject: Record<string, any> = {},
    acc: OlFromConfigAccumulatorType,
    consecutiveNoMarkerText: number
  ): OlFromConfigAccumulatorType {
    const columnsAmount = header.length || 1;
    consecutiveNoMarkerText += 1;

    const tableRows: string[][] = text.reduce((tableRowsAccum, textItem, index) => {
      if (index % columnsAmount === 0) {
        tableRowsAccum.push([]);
      }

      const rowIndex = Math.floor(index / columnsAmount);
      tableRowsAccum[rowIndex].push(
        `${textItem} ${DocumentExtractionService.getField(dataObject, paths[index], defaults[index])}`
      );

      return tableRowsAccum;
    }, [] as string[][]);

    const table: TableBodyConfigType = {
      body: [[...header], ...tableRows],
      heights: LINE_HEIGHT_20,
    };

    if (Array.isArray(widths) && widths.length === columnsAmount) {
      table.widths = widths;
    }

    return {
      listText: [
        ...acc.listText,
        {
          table,
          margin: PQ_PARAGRAPH_MARGIN,
        },
      ],
      consecutiveNoMarkerText,
    };
  }

  static createCompoundItemFromConfig(
    textsConfig: OlConfigType[],
    dataObject: Record<string, any>,
    listIndex = -1,
    tender: TenderOfferType | Record<string, any> = {}
  ): Record<string, any>[] {
    return textsConfig.reduce(
      (acc: OlFromConfigAccumulatorType, olItem, itemIndex) => {
        const { consecutiveNoMarkerText } = acc;

        if (TypeChecker.isCompoundTextType(olItem)) {
          return this.formatCompoundTextItem(
            acc,
            olItem,
            itemIndex,
            consecutiveNoMarkerText,
            dataObject,
            listIndex,
            tender
          );
        }

        if (Array.isArray(olItem)) {
          this.formatOlArray(
            olItem,
            listIndex,
            itemIndex,
            dataObject,
            consecutiveNoMarkerText,
            PQ_PARAGRAPH_MARGIN,
            tender
          ).forEach(oli => acc.listText.push(oli));

          return acc;
        }

        acc.listText.push(this.formatOlItem(olItem as string, listIndex, itemIndex, consecutiveNoMarkerText));

        return { listText: acc.listText, consecutiveNoMarkerText };
      },
      { listText: [] as Record<string, any>[], consecutiveNoMarkerText: 0 }
    ).listText;
  }

  static formatCompoundTextItem(
    acc: OlFromConfigAccumulatorType,
    olItem: OlConfigType,
    itemIndex: number,
    consecutiveNoMarkerText: number,
    dataObject: Record<string, any>,
    listIndex: number,
    tender: TenderOfferType | Record<string, any>
  ): OlFromConfigAccumulatorType {
    if ((olItem as CompoundTextType).pdfType === PdfItemEnum.TEXT) {
      acc.listText.push(this.handleOlConfigNode(olItem as CompoundTextType, dataObject, tender));
      consecutiveNoMarkerText += 1;

      return { listText: acc.listText, consecutiveNoMarkerText };
    }
    if ((olItem as CompoundTextType).pdfType === PdfItemEnum.LIST_ITEM) {
      acc.listText.push(
        this.formatOlItem(
          this.handleOlConfigNode(olItem as CompoundTextType, dataObject, tender).text,
          listIndex,
          itemIndex,
          consecutiveNoMarkerText
        )
      );

      return acc;
    }

    if ((olItem as CompoundTextType).pdfType === PdfItemEnum.TABLE) {
      return this.formatTable(olItem as CompoundTextType, dataObject, acc, consecutiveNoMarkerText);
    }
    return acc;
  }

  static handleOlConfigNode(
    item: OlConfigType,
    dataObject: Record<string, any>,
    tender?: TenderOfferType | Record<string, any>
  ): Record<string, any> {
    return TypeChecker.isCompoundTextType(item)
      ? this.formatNoMarkerText(item as CompoundTextType, dataObject, tender)
      : this.createTextUnit(item);
  }

  /*
   * convert CompoundTextType to pdfMaker formatted ol element
   */
  static formatNoMarkerText(
    { text, paths, defaults, functionName }: CompoundTextType,
    dataObject: Record<string, any>,
    tender?: TenderOfferType | Record<string, any>
  ): Record<string, any> {
    const typeChecker = new TypeChecker();
    const preparedText = text.reduce((accum: string, item) => {
      if (typeChecker.isNumber(item)) {
        const index = Number(item);
        const itemValue =
          functionName && functionName[index]
            ? CompoundTextAdapter.convertToText(
                paths[index],
                functionName[index],
                dataObject,
                defaults[index],
                tender as TenderOfferType | undefined
              )
            : DocumentExtractionService.getField(dataObject, paths[index], defaults[index]);

        return accum.concat(itemValue);
      }

      return accum.concat(item as string);
    }, STRING.EMPTY);

    return PQFormattingService.createTextUnit(preparedText);
  }

  /**
   * форматування вкладеного списку (з третім числом в маркувальній нумерації)
   **/
  static formatOlArray(
    list: (string | CompoundTextType)[],
    listIndex = -1,
    itemIndex = 0,
    dataObject: Record<string, any>,
    indexReducer = 0,
    margin = PQ_PARAGRAPH_MARGIN,
    additionalData: Record<string, any> = {}
  ): OlPdfType[] {
    const separatorPrefix = listIndex < 0 ? STRING.EMPTY : `${listIndex + 1}.`;
    const [first, ...args] = list.map(item => this.handleOlConfigNode(item, dataObject, additionalData));
    const innerIndex: number = itemIndex + 1 - indexReducer;

    return [
      {
        start: innerIndex,
        separator: [separatorPrefix, STRING.DOT],
        ol: [
          {
            text: first,
            style: PDF_FILED_KEYS.REGULAR_CONTENT,
            margin,
          },
        ],
      },
      {
        start: 1,
        separator: [`${separatorPrefix}${innerIndex}.`, STRING.DOT],
        ol: args,
      },
    ];
  }
}
