import { STRING } from "@/constants/string";

export class StringConversionHelper {
  // TODO add test
  static yesNoStringConversion(value: string | boolean | undefined | number): string {
    if (undefined === value) {
      return STRING.EMPTY;
    }

    switch (value.toString().toLowerCase()) {
      case "true":
        return "Так";
      case "false":
        return "Ні";
      default:
        return value.toString();
    }
  }
}
