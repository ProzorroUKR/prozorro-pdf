import type { PQattribute, PQItem } from "@/widgets/pq/types/PQTypes";
import type { PDFTableBodyType } from "@/widgets/pq/types/TextConfigType";
import { STRING } from "@/constants/string";
import { BooleanSpeller } from "@/utils/BooleanSpeller";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";

export class ProductAttributesHandler {
  static createTableAttributesBody(items: PQItem[]): PDFTableBodyType {
    return items.reduce((accumulator: PDFTableBodyType, item: PQItem, index: number) => {
      accumulator.push([
        {
          text: `${index + 1}) ${item.description}`,
          colSpan: 2,
          border: [false, false, false, false],
          style: PDF_FILED_KEYS.TABLE_HEAD,
        },
        {},
      ]);

      accumulator.push(...ProductAttributesHandler.formatAttributeRows(item.attributes));

      accumulator.push([
        {
          text: STRING.DOT,
          colSpan: 2,
          border: [false, false, false, false],
          style: PDF_FILED_KEYS.HIDDEN_DATA,
        },
        {},
      ]);

      return accumulator;
    }, []);
  }

  static formatAttributeRows(attributes?: PQattribute[]): PDFTableBodyType {
    return (attributes || []).map(value => {
      const unitField = DocumentExtractionService.getField<string>(value, "unit.name");
      const unitName = unitField ? ` (${unitField})` : STRING.EMPTY;
      const attributeValues = String((value.values || []).map(val => BooleanSpeller.parse(val)));

      return [`${value.name || STRING.EMPTY}${unitName}`, attributeValues];
    });
  }
}
