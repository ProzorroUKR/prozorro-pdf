import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import { STRING } from "@/constants/string";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { StringHandler } from "@/utils/StringHandler";
import { BooleanSpeller } from "@/utils/BooleanSpeller";
import { ClassificationHandler } from "@/utils/ClassificationHandler";
import { CriteriaRequirementDataSchema } from "@/utils/CriteriaRequirementDataSchema";
import { DateHandler } from "@/utils/DateHandler";
import { TERMINATION_REPORT_TEXT } from "@/modules/termination-report/config/texts";
import { PRODUCT_LINK_BASE } from "@/modules/termination-report/constants/terminationReport";
import type {
  TerminationAttribute,
  TerminationContract,
  TerminationDictionaries,
  TerminationItem,
} from "@/modules/termination-report/types";

export class ItemsTableBuilder {
  private readonly _schema: CriteriaRequirementDataSchema;
  private readonly _recommended: Record<string, { name?: string }>;

  constructor(
    private readonly contract: TerminationContract,
    dictionaries: TerminationDictionaries
  ) {
    this._schema = new CriteriaRequirementDataSchema(dictionaries);
    this._recommended = dictionaries.get("recommended") || {};
  }

  build(): Record<string, any> {
    const items: TerminationItem[] = Array.isArray(this.contract.items) ? this.contract.items : [];

    if (!items.length) {
      return PDF_HELPER_CONST.EMPTY_FIELD;
    }

    const body: Record<string, any>[][] = [this._header()];

    items.forEach((item, index) => {
      body.push(this._mainRow(item, index));
      (item.attributes ?? []).forEach(attribute => body.push(this._attributeRow(attribute)));
    });

    return {
      headerRows: 1,
      style: PDF_FILED_KEYS.TABLE_DATA,
      margin: PDF_HELPER_CONST.TABLE_TOP_MARGIN,
      table: {
        dontBreakRows: false,
        widths: [
          PDF_HELPER_CONST.ROW_WIDTH_30,
          PDF_HELPER_CONST.ROW_WIDTH_90,
          PDF_HELPER_CONST.ROW_WIDTH_100,
          PDF_HELPER_CONST.ROW_WIDTH_70,
          PDF_HELPER_CONST.ROW_AUTO_WIDTH,
          PDF_HELPER_CONST.ROW_WIDTH_90,
        ],
        body,
      },
    };
  }

  private _header(): Record<string, any>[] {
    return [
      TERMINATION_REPORT_TEXT.tableNo,
      TERMINATION_REPORT_TEXT.tableName,
      TERMINATION_REPORT_TEXT.tableCode,
      TERMINATION_REPORT_TEXT.tableQuantity,
      TERMINATION_REPORT_TEXT.tablePlace,
      TERMINATION_REPORT_TEXT.tableTerm,
    ].map(text => ({ text, style: PDF_FILED_KEYS.TABLE_HEAD }));
  }

  private _mainRow(item: TerminationItem, index: number): Record<string, any>[] {
    const description = item.description || STRING.DASH;
    const nameCell = item.product
      ? { text: description, link: `${PRODUCT_LINK_BASE}${item.product}`, style: PDF_FILED_KEYS.TABLE_DATA_BLUE }
      : { text: description, style: PDF_FILED_KEYS.TABLE_DATA };

    return [
      { text: String(index + 1), style: PDF_FILED_KEYS.TABLE_DATA },
      nameCell,
      { text: this._classifications(item), style: PDF_FILED_KEYS.TABLE_DATA },
      { text: this._quantity(item), style: PDF_FILED_KEYS.TABLE_DATA },
      {
        text: StringHandler.customerLocation(item.deliveryAddress, STRING.DASH),
        style: PDF_FILED_KEYS.TABLE_DATA,
      },
      {
        text: DateHandler.fullDateRange(item.deliveryDate?.startDate, item.deliveryDate?.endDate),
        style: PDF_FILED_KEYS.TABLE_DATA,
      },
    ];
  }

  // Blank line between the main classification and the additional classifications (per template).
  private _classifications(item: TerminationItem): string {
    const main = ClassificationHandler.format(item.classification);
    const additional = ClassificationHandler.format(undefined, item.additionalClassifications);
    const separator = main.length && additional.length ? [STRING.EMPTY] : [];

    return [...main, ...separator, ...additional].join(STRING.DELIMITER.NEW_LINE);
  }

  private _attributeRow(attribute: TerminationAttribute): Record<string, any>[] {
    return [
      { text: attribute.name || STRING.EMPTY, colSpan: 3, style: PDF_FILED_KEYS.TABLE_DATA },
      {},
      {},
      { text: this._attributeValue(attribute), colSpan: 3, style: PDF_FILED_KEYS.TABLE_DATA },
      {},
      {},
    ];
  }

  private _quantity(item: TerminationItem): string {
    const quantity = item.quantity;
    const unit = item.unit;
    const unitName = unit?.name || this._unitName(unit?.code);
    const quantityDefined = isNumber(quantity) || (typeof quantity === "string" && quantity.trim() !== "");

    if (!quantityDefined && !unitName && !unit?.code) {
      return STRING.DASH;
    }

    const quantityString = quantityDefined ? String(quantity) : STRING.EMPTY;
    return [quantityString, unitName].filter(Boolean).join(STRING.WHITESPACE) || STRING.DASH;
  }

  private _attributeValue(attribute: TerminationAttribute): string {
    const raw: (string | number | boolean)[] = attribute.values?.length
      ? attribute.values
      : attribute.value !== undefined && attribute.value !== null
        ? [attribute.value]
        : [];

    const translated = this._schema
      .translateValues(raw, attribute.dataSchema)
      .map(value => (isBoolean(value) ? BooleanSpeller.spell(value) : value));

    const valueString = translated.join(STRING.DELIMITER.NEW_LINE);
    const unitName = attribute.unit?.name || this._unitName(attribute.unit?.code);

    return [valueString, unitName].filter(Boolean).join(STRING.WHITESPACE);
  }

  private _unitName(code?: string): string {
    if (!code) {
      return STRING.EMPTY;
    }
    return this._recommended[code]?.name || STRING.EMPTY;
  }
}
