import type { AddressType } from "@/types/Tender/AddressType";
import { ADDRESS_ORDER } from "@/config/pdf/addressOrder";

const DATE_LENGTH_SHORT = 2;
const DATE_LENGTH_FULL = 4;
const DAY_START = 0;
const MONTH_START = 2;
const YEAR_START = 4;

export class StringHandler {
  /**
   * "03032021" => "03.03.2021"
   */
  static formatToDate(str: string): string {
    const day: string = str.substr(DAY_START, DATE_LENGTH_SHORT);
    const month: string = str.substr(MONTH_START, DATE_LENGTH_SHORT);
    const year: string = str.substr(YEAR_START, DATE_LENGTH_FULL);
    return `${day}.${month}.${year}`;
  }

  static customerLocation(address?: AddressType, defaultValue = "", parts = ADDRESS_ORDER.COUNTRY_TO_STREET): string {
    const collectedAddress = parts
      .map(key => (address || {})[key]?.toString()?.trim())
      .filter(Boolean)
      .join(", ");
    return collectedAddress || defaultValue;
  }

  static cutLongString(str: string, length: number): string {
    return str.length > length ? `${str.substring(0, length)}...` : str;
  }
}
