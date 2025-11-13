import isBoolean from "lodash/isBoolean";

import { STRING } from "@/constants/string";
import type { PQattribute } from "@/widgets/pq/types/PQTypes";

import { BooleanSpeller } from "@/utils/BooleanSpeller.ts";

export class AttributesValueStrategy {
  /**
   *  IMPORTANT: може бути лише одне з цих значень `values`, `value`
   * Або не прийти взагалі
   */
  format({ values, value }: PQattribute): string | number {
    if (values?.length) {
      return values.map(value => this.translate(value)).join(STRING.DELIMITER.NEW_LINE);
    }

    return this.translate(value);
  }

  translate(value?: string | boolean | number): string | number {
    if (isBoolean(value)) {
      return BooleanSpeller.parse(value);
    }

    return value ?? STRING.EMPTY;
  }
}
