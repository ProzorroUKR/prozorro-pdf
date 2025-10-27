import { STRING } from "@/constants/string";

export class BooleanSpeller {
  private static readonly TRUE_VALUES = ["true", "yes", "y", "1"];
  private static readonly FALSE_VALUES = ["false", "no", "n", "0"];

  static spell(value: boolean): string {
    return value ? "Так" : "Ні";
  }

  static parse(value: string | number | boolean | undefined): string {
    const lowerValue = value?.toString().toLowerCase() ?? STRING.EMPTY;

    if (BooleanSpeller.TRUE_VALUES.includes(lowerValue)) {
      return BooleanSpeller.spell(true);
    }

    if (BooleanSpeller.FALSE_VALUES.includes(lowerValue)) {
      return BooleanSpeller.spell(false);
    }

    return String(value);
  }
}
