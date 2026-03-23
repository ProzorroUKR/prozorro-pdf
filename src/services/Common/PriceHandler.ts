import Decimal from "decimal.js";
import { PRICE_DECIMAL_PRECISION } from "@/constants/pdf/pdfHelperConstants";
import { NumbersSpeller } from "@/utils/numbersSpeller/NumbersSpeller";
import { UnitHelper } from "@/services/Common/UnitHelper";
import type { WordCaseModel } from "@/utils/numbersSpeller/models/WordCase.model";
import { STRING } from "@/constants/string";
import type { PQvalue } from "@/widgets/pq/types/PQTypes";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { FloatFormatter } from "@/utils/ObjectToString/FloatFormatter";
import { isNumber } from "lodash";

export class PriceHandler {
  private static readonly _numberSpeller = new NumbersSpeller();

  static getPrice({ amount = 0, valueAddedTaxIncluded }: PQvalue, quantity = 1): number {
    const price = valueAddedTaxIncluded ? this.amountRemoveTax(amount) : amount;
    return new Decimal(price).mul(quantity).toNumber();
  }

  static addCurrency(price: number, currency = ""): string {
    return Number.isFinite(price) || price === 0
      ? `${UnitHelper.currencyFormatting(FloatFormatter.format(price, PDF_HELPER_CONST.PRICE_DECIMAL_PRECISION))} ${currency}`
      : STRING.EXTRA_LONG_DASH;
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

  /**
   * 123456.5 => "123 456,50 UAH"
   */
  static currencyFormat(value?: number, currency: string = "UAH", defaultValue: string = "—"): string {
    if (!isNumber(value)) {
      return defaultValue;
    }

    const price = new Intl.NumberFormat("uk-UK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 7,
      roundingMode: "floor",
    } as any).format(value);

    return `${price} ${currency}`;
  }
}
