import Decimal from "decimal.js";
import isNumber from "lodash/isNumber";
import { STRING } from "@/constants/string";
import { PriceHandler } from "@/services/Common/PriceHandler";
import { TERMINATION_REPORT_TEXT } from "@/modules/termination-report/config/texts";
import type { TerminationValue } from "@/modules/termination-report/types";

/**
 * Formats a Prozorro `value`-shaped object the way the portal does:
 * `30 000,00 UAH (в тому числі ПДВ 425,00 UAH)`.
 *
 * - the VAT clause is appended only when `valueAddedTaxIncluded === true`;
 * - VAT = `amount - amountNet` (money math via decimal.js);
 * - `0` is rendered as `0`;
 * - when neither `amount` nor `amountNet` is a number → long dash.
 */
export class TerminationPrice {
  static format(value?: TerminationValue): string {
    if (!value || (!isNumber(value.amount) && !isNumber(value.amountNet))) {
      return STRING.DASH;
    }

    const currency: string = value.currency ?? STRING.EMPTY;
    const amountString = PriceHandler.currencyFormat(value.amount, currency, STRING.DASH);

    if (value.valueAddedTaxIncluded !== true || !isNumber(value.amount) || !isNumber(value.amountNet)) {
      return amountString;
    }

    const vat = new Decimal(value.amount).minus(value.amountNet).toNumber();
    const vatString = PriceHandler.currencyFormat(vat, currency, STRING.DASH);

    return `${amountString} (${TERMINATION_REPORT_TEXT.vatIncluded} ${vatString})`;
  }
}
