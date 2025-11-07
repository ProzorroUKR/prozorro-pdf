import { AbstractDocumentStrategy } from "@/services/PDF/document/AbstractDocumentStrategy";
import type { MoneyType } from "@/types/Tender/MoneyType";
import { STRING } from "@/constants/string";
import type { AwardType } from "@/types/Tender/AwardType";
import { UnitHelper } from "@/services/Common/UnitHelper";

export class AwardHelper {
  private readonly strategy: AbstractDocumentStrategy;

  constructor(strategy: AbstractDocumentStrategy) {
    this.strategy = strategy;
  }

  public showAwardPerformance(
    currencyBlock: MoneyType,
    mainText: string,
    withTaxText: string,
    showDefaultIfNotAvailable = true
  ): Record<string, any> {
    if (!currencyBlock.hasOwnProperty("amountPerformance")) {
      return !showDefaultIfNotAvailable
        ? this.strategy.showIfAvailable("", "", false)
        : this.strategy.showWithDefault(STRING.DASH, mainText);
    }

    let currency: string | undefined = this.strategy.getField(currencyBlock, "amountPerformance");
    if (!currency) {
      return !showDefaultIfNotAvailable
        ? this.strategy.showIfAvailable("", "", false)
        : this.strategy.showWithDefault(STRING.DASH, mainText);
    }
    currency = UnitHelper.currencyFormatting(currency);
    let text = `${currency} ${this.strategy.getField(currencyBlock, "currency")}`;
    const hasTax = this.strategy.getField(currencyBlock, "valueAddedTaxIncluded");
    if (text.length && true === hasTax) {
      text += ` ${withTaxText}`;
    }
    return !showDefaultIfNotAvailable
      ? this.strategy.showIfAvailable(text, mainText, text.length > 0)
      : this.strategy.showWithDefault(text, mainText);
  }

  public showAwardWithTax(award: AwardType, fieldName: string, withTaxText: string): string {
    const realFieldName = fieldName === "amountPerformance" || fieldName === "value" ? "value" : `${fieldName}`;
    const amountSelector = fieldName !== "amountPerformance" ? `${fieldName}.amount` : "value.amountPerformance";
    const currencySelector = `${realFieldName}.currency`;
    let amountValue: string | undefined = this.strategy.getField(award, amountSelector);
    if (!amountValue) {
      return STRING.EMPTY;
    }
    amountValue = UnitHelper.currencyFormatting(amountValue);
    let text = `${amountValue} ${this.strategy.getField(award, currencySelector)}`;
    const hasTax = this.strategy.getField(award, `${realFieldName}.valueAddedTaxIncluded`);
    if (true === hasTax) {
      text += ` ${withTaxText}`;
    }
    return text;
  }
}
