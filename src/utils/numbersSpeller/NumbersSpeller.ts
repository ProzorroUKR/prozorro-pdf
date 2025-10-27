import type { NumbersSpellerInterface } from "@/utils/numbersSpeller/NumbersSpellerInterface";
import { NUMBER_CONSTANTS } from "@/utils/numbersSpeller/constants/NUMBER_CONSTANTS";
import {
  NUMBERS_VOCABULARY,
  NUMBERS_FEMININES,
  ZERO,
  unitIndexToNumberGrades,
} from "@/utils/numbersSpeller/constants/NUMBERS_VOCABULARY";
import { STRING } from "@/constants/string";
import { CURRENCY_VOCABULARY } from "@/utils/numbersSpeller/config/CURRENCY_VOCABULARY";
import { UnitHelper } from "@/services/Common/UnitHelper";
import type { WordCaseModel } from "@/utils/numbersSpeller/models/WordCase.model";
import type { MilestoneDurationType } from "@/types/Announcement/AnnouncementTypes";
import { MILESTONES_DURATION_TYPE } from "@/widgets/pq/services/PQpaymentDetails/constants/milestones";

export class NumbersSpeller implements NumbersSpellerInterface {
  private readonly belowTwenty: string[];
  private readonly tens: string[];
  private readonly hundreds: string[];

  constructor() {
    this.belowTwenty = NUMBERS_VOCABULARY.BELOW_TWENTY;
    this.tens = NUMBERS_VOCABULARY.TENS;
    this.hundreds = NUMBERS_VOCABULARY.HUNDREDS;
  }
  // get correct grammar form of currency depending on number
  static getCurrencyForm(num: number, currency: WordCaseModel = CURRENCY_VOCABULARY.UAH): string {
    const lastDigit = num % NUMBER_CONSTANTS.TEN;
    const lastTwoDigits = num % NUMBER_CONSTANTS.HUNDRED;

    if (lastDigit === 1 && lastTwoDigits !== NUMBER_CONSTANTS.ELEVEN) {
      return currency.ONE;
    }

    if (
      lastDigit >= NUMBER_CONSTANTS.TWO &&
      lastDigit <= NUMBER_CONSTANTS.FOUR &&
      (lastTwoDigits < NUMBER_CONSTANTS.TEN || lastTwoDigits >= NUMBER_CONSTANTS.TWENTY)
    ) {
      return currency.SOME;
    }

    return currency.MANY;
  }

  static getBankDaysForm({ days, type }: MilestoneDurationType): string {
    const lastDigit = days % NUMBER_CONSTANTS.TEN;
    const lastTwoDigits = days % NUMBER_CONSTANTS.HUNDRED;

    if (lastDigit === 1 && lastTwoDigits !== NUMBER_CONSTANTS.ELEVEN) {
      return `${days} ${MILESTONES_DURATION_TYPE["single"][type]}`;
    }

    return `${days} ${MILESTONES_DURATION_TYPE["few"][type]}`;
  }

  // convert price to words in Ukrainian with currency
  public priceToWords(input: string | number, defaults = ""): string {
    const result: string[] = [];
    const [integerPart = STRING.EMPTY, decimalPart = STRING.EMPTY] = String(
      Number(input) >= 0 ? input : STRING.EMPTY
    ).split(STRING.DOT);

    result.push(this.convertToWords(integerPart, defaults, true)); // convert integer part to words
    result.push(NumbersSpeller.getCurrencyForm(parseInt(integerPart, NUMBER_CONSTANTS.TEN), CURRENCY_VOCABULARY.UAH)); // add currency form for integer part

    if (decimalPart) {
      result.push(this.convertToWords(UnitHelper.coinsFormatting(decimalPart), ZERO, true)); // convert decimal part to cents format and convert it to words
      result.push(
        NumbersSpeller.getCurrencyForm(parseInt(UnitHelper.coinsFormatting(decimalPart), 10), CURRENCY_VOCABULARY.COINS)
      ); // add currency form for decimal part
    }

    return result.length ? result.join(STRING.WHITESPACE) : defaults;
  }

  // convert number to words in Ukrainian
  public convertToWords(input: string, defaults = "", useFeminine = false): string {
    const parts = String(input).match(/\d+|\D+/g); // Split into numeric and non-numeric parts
    if (!parts) {
      return defaults;
    }

    return parts
      .map(part => {
        if (/\d/.test(part)) {
          // Convert numeric parts to words
          return this.numberSpeller(parseInt(part, NUMBER_CONSTANTS.TEN), useFeminine);
        }

        // Return non-numeric parts (symbols) as they are
        return part;
      })
      .join(STRING.EMPTY); // Join everything back together
  }

  private numberSpeller(num: number, useFeminine = false): string {
    if (num === 0) {
      return ZERO;
    }

    let result = "";
    let unitIndex = 0;

    while (num > 0) {
      const belowThousandRemainder = num % NUMBER_CONSTANTS.THOUSAND;
      if (belowThousandRemainder !== 0) {
        result =
          this.belowThousandHandler(belowThousandRemainder, unitIndex, useFeminine) +
          this.getThousandForm(unitIndex, belowThousandRemainder) +
          STRING.WHITESPACE +
          result;
      }

      num = Math.floor(num / NUMBER_CONSTANTS.THOUSAND);
      unitIndex++;
      useFeminine = unitIndex < 1;
    }
    return result.trim();
  }

  // method to handle numbers below 1000
  private belowThousandHandler(num: number, unitIndex: number, useFeminine = false): string {
    if (num === 0) {
      return STRING.EMPTY;
    }

    if (num < NUMBER_CONSTANTS.TWENTY) {
      return this.getNumberForm(num, unitIndex, useFeminine) + STRING.WHITESPACE;
    }

    if (num < NUMBER_CONSTANTS.HUNDRED) {
      return (
        this.tens[Math.floor(num / NUMBER_CONSTANTS.TEN)] +
        STRING.WHITESPACE +
        this.getNumberForm(num % NUMBER_CONSTANTS.TEN, unitIndex, useFeminine) +
        STRING.WHITESPACE
      );
    }

    return (
      this.hundreds[Math.floor(num / NUMBER_CONSTANTS.HUNDRED)] +
      STRING.WHITESPACE +
      this.belowThousandHandler(num % NUMBER_CONSTANTS.HUNDRED, unitIndex, useFeminine)
    );
  }

  // Method to get correct form of number depending on unit (gender-specific for thousands)
  private getNumberForm(num: number, unitIndex: number, useFeminine = false): string {
    if (useFeminine || unitIndex === NUMBER_CONSTANTS.ONE) {
      // Special handling for thousands
      if (num === NUMBER_CONSTANTS.ONE) {
        // Feminine for one thousand
        return NUMBERS_FEMININES.ONE;
      }
      if (num === NUMBER_CONSTANTS.TWO) {
        // Feminine for two thousand
        return NUMBERS_FEMININES.TWO;
      }
    }
    return this.belowTwenty[num];
  }

  // Method to get correct form for thousands based on number
  private getThousandForm(unitIndex: number, num: number): string {
    if (!unitIndex) {
      return STRING.EMPTY;
    }
    const unitNames = unitIndexToNumberGrades[unitIndex - 1];

    if (num % NUMBER_CONSTANTS.TEN === 1) {
      return unitNames[NUMBER_CONSTANTS.ONE];
    }

    if (num % NUMBER_CONSTANTS.TEN >= NUMBER_CONSTANTS.TWO && num % NUMBER_CONSTANTS.TEN <= NUMBER_CONSTANTS.FOUR) {
      return unitNames[NUMBER_CONSTANTS.TWO];
    }

    return unitNames[NUMBER_CONSTANTS.THREE];
  }
}
