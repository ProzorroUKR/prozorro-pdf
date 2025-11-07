import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import { STRING } from "@/constants/string";
import type { AnnouncementItem } from "@/types/Announcement/AnnouncementTypes";

export class UnitHelper {
  private readonly strategy: AbstractDocumentStrategy;

  constructor(strategy: AbstractDocumentStrategy) {
    this.strategy = strategy;
  }

  // 483500 -> 483 500,00
  static currencyFormatting(currency: string | number): string {
    const [full = STRING.EMPTY, decimal = STRING.EMPTY] = currency.toString().split(STRING.DOT);
    const decimal_part = UnitHelper.coinsFormatting(decimal);

    return [full.replace(/\B(?=(\d{3})+(?!\d))/g, STRING.WHITESPACE), decimal_part].join(STRING.COMMA);
  }

  static coinsFormatting(decimal: string): string {
    switch (true) {
      case decimal.length > 1:
        return decimal;

      case decimal.length === 1:
        return `${decimal}0`;

      default:
        return "00";
    }
  }

  public prepareUnitName(item: AnnouncementItem, recommendedDictionary: Record<string, any> | undefined): string {
    if (!this.strategy.emptyChecker.isEmptyString(this.strategy.getField(item, "unit.name"))) {
      return this.strategy.getField(item, "unit.name");
    }
    if (recommendedDictionary === undefined) {
      return STRING.DASH;
    }
    const unitDictionaryName = this.strategy.getField(
      recommendedDictionary,
      `${this.strategy.getField(item, "unit.code", "")}.name`,
      ""
    );
    return this.strategy.emptyChecker.isEmptyString(unitDictionaryName) ? STRING.DASH : unitDictionaryName;
  }
}
