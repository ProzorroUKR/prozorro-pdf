import { PRICE_DECIMAL_PRECISION } from "@/constants/pdf/pdfHelperConstants";
import { NumbersSpeller } from "@/utils/numbersSpeller/NumbersSpeller";
import { UnitHelper } from "@/services/Common/UnitHelper";
import type { WordCaseModel } from "@/utils/numbersSpeller/models/WordCase.model";
import { STRING } from "@/constants/string";
import type { PQContractType, PQItem, PQvalue } from "@/widgets/pq/types/PQTypes";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { FloatFormatter } from "@/utils/ObjectToString/FloatFormatter";

export class PriceHandler {
  private static readonly _numberSpeller = new NumbersSpeller();

  static getPrice({ amount = 0, valueAddedTaxIncluded }: PQvalue, quantity = 1): number {
    const price = valueAddedTaxIncluded ? this.amountRemoveTax(amount) : amount;

    return price * quantity;
  }

  static addCurrency(price: number, currency = ""): string {
    return Number.isFinite(price) || price === 0
      ? `${UnitHelper.currencyFormatting(FloatFormatter.format(price, PDF_HELPER_CONST.PRICE_DECIMAL_PRECISION))} ${currency}`
      : STRING.EMPTY;
  }

  static getTotalPriceNoTax(contractObject: PQContractType | Record<any, any>): number {
    const price = DocumentExtractionService.getField<PQItem[]>(contractObject, "items", []).reduce(
      (totalAmount, item) => {
        const itemsAmount = PriceHandler.getPrice(
          DocumentExtractionService.getField(item, "unit.value", {
            amount: 0,
            currency: "uah",
          }),
          DocumentExtractionService.getField(item, "quantity", 0)
        );

        return totalAmount + itemsAmount;
      },
      0
    );

    return PriceHandler.roundPriceToCoins(price);
  }

  static amountRemoveTax(amount: number): number {
    const fullPrice = 6;
    const realPricePart = 5;

    return PriceHandler.roundPriceToCoins((realPricePart * Number(amount)) / fullPrice);
  }

  static formatPriceWithSpelling(price: number | string | undefined, currency: WordCaseModel): string {
    if (!price && price !== 0) {
      return STRING.EMPTY;
    }

    const preparedPrice = PriceHandler.roundPriceToCoins(Number(price));

    return `${UnitHelper.currencyFormatting(preparedPrice)} ${NumbersSpeller.getCurrencyForm(preparedPrice, currency)} (${PriceHandler._numberSpeller.priceToWords(preparedPrice)})`;
  }

  static roundPriceToCoins(price: number): number {
    return Number(price.toFixed(PRICE_DECIMAL_PRECISION));
  }
}
