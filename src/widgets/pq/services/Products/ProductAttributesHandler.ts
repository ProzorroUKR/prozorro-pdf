import { STRING } from "@/constants/string";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import type { PQattribute, PQItem } from "@/widgets/pq/types/PQTypes";
import type { PDFTableBodyType } from "@/widgets/pq/types/TextConfigType";
import { AttributesValueStrategy } from "@/widgets/pq/services/Products/AttributesValue.strategy";

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

      accumulator.push(...ProductAttributesHandler.formatAttributeRows(item.attributes || []));

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

  static formatAttributeRows(attributes: PQattribute[]): PDFTableBodyType {
    const formatValueStrategy = new AttributesValueStrategy();

    return attributes.map(attr => {
      const label = attr.unit ? `${attr.name}, ${attr?.unit?.name || attr?.unit?.code}` : attr.name;
      return [label, formatValueStrategy.format(attr) as string];
    });
  }
}
