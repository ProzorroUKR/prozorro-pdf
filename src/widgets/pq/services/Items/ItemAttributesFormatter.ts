import type { PQattribute } from "@/widgets/pq/types/PQTypes";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { STRING } from "@/constants/string";
import { BooleanSpeller } from "@/utils/BooleanSpeller";

export class ItemAttributesFormatter {
  static formatAttribute(attributes?: PQattribute[]): string {
    return (attributes || []).reduce((accumulator: string, value) => {
      const field = DocumentExtractionService.getField<string>(value, "unit.name");
      const unitName = field ? `-${field}` : STRING.EMPTY;
      const attributeValues = String((value.values || []).map(val => BooleanSpeller.parse(val)));

      return accumulator.concat(
        value.name || STRING.EMPTY,
        STRING.MINUS,
        attributeValues,
        unitName,
        STRING.DELIMITER.NEW_LINE
      );
    }, STRING.EMPTY);
  }
}
