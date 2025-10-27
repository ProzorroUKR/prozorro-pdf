import { STRING } from "@/constants/string";
import { TIME_NAMES } from "@/config/pdf/announcementConstants";
import type { ContractPeriod } from "@/widgets/pq/types/PQTypes";
import { MONTHS_LIST, MONTHS_LIST_DEFAULT } from "@/constants/monthList";

export class DateHandler {
  static dateIntervalDecode(dateInterval: string): string {
    const [period, timeStamp] = dateInterval.split("T");

    let timeStr = "";
    let lastIndex = 1;

    if (period) {
      if (period.indexOf("Y") > 0) {
        timeStr +=
          this.timeToStr(
            Number(period.slice(lastIndex, period.indexOf("Y"))),
            TIME_NAMES.Years
          ) + STRING.WHITESPACE;
        lastIndex = period.indexOf("Y") + 1;
      }

      if (period.indexOf("M") > 0) {
        timeStr +=
          this.timeToStr(
            Number(period.slice(lastIndex, period.indexOf("M"))),
            TIME_NAMES.Months
          ) + STRING.WHITESPACE;
        lastIndex = period.indexOf("M") + 1;
      }

      if (period.indexOf("D") > 0) {
        timeStr +=
          this.timeToStr(
            Number(period.slice(lastIndex, period.indexOf("D"))),
            TIME_NAMES.Days
          ) + STRING.WHITESPACE;
      }
    }
    if (timeStamp) {
      lastIndex = 0;
      if (timeStamp.indexOf("H") > 0) {
        timeStr +=
          this.timeToStr(
            Number(timeStamp.slice(lastIndex, timeStamp.indexOf("H"))),
            TIME_NAMES.Hours
          ) + STRING.WHITESPACE;
        lastIndex = timeStamp.indexOf("H") + 1;
      }

      if (timeStamp.indexOf("I") > 0) {
        timeStr +=
          this.timeToStr(
            Number(timeStamp.slice(lastIndex, timeStamp.indexOf("I"))),
            TIME_NAMES.Minutes
          ) + STRING.WHITESPACE;
        lastIndex = timeStamp.indexOf("I") + 1;
      }

      if (timeStamp.indexOf("S") > 0) {
        timeStr +=
          this.timeToStr(
            Number(timeStamp.slice(lastIndex, timeStamp.indexOf("S"))),
            TIME_NAMES.Seconds
          ) + STRING.WHITESPACE;
      }
    }
    return timeStr;
  }

  static timeToStr(timeNumber: number, timeLabel: Array<string>): string {
    let txt: string;
    const timeDevider = 100;
    const minCount = 5;
    const maxCount = 20;
    const timeDeviderS = 10;
    const minCountS = 2;
    const maxCountS = 4;

    let count = timeNumber % timeDevider;

    if (count >= minCount && count <= maxCount) {
      [, , txt] = timeLabel;
    } else {
      count = timeNumber % timeDeviderS;
      if (count === 1) {
        [txt] = timeLabel;
      } else if (count >= minCountS && count <= maxCountS) {
        [, txt] = timeLabel;
      } else {
        [, , txt] = timeLabel;
      }
    }
    return timeNumber + STRING.WHITESPACE + txt;
  }

  static phpDateFormat(preparedValue: string): string {
    const date = new Date(preparedValue);
    return date.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  }

  static deliveryDateDiff(
    { startDate, endDate }: ContractPeriod,
    defaultValue = ""
  ): string {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const firstDateInMs = DateHandler.resetTimeToMidnight(start).getTime();
    const secondDateInMs = DateHandler.resetTimeToMidnight(end).getTime();
    const differenceBtwDates = secondDateInMs - firstDateInMs;

    const aDayInMs = 86400000;
    const daysOfSigning = 1; // additional, to include calendar days of contract signing to this Diff
    const dateDiffResult = Math.round(differenceBtwDates / aDayInMs);

    return dateDiffResult >= 0
      ? String(dateDiffResult + daysOfSigning)
      : defaultValue;
  }

  static dateModifiedDiff(
    a: { dateModified?: string },
    b: { dateModified?: string }
  ): number {
    const dateA = new Date(a.dateModified || STRING.EMPTY);
    const dateB = new Date(b.dateModified || STRING.EMPTY);

    return dateA.getTime() - dateB.getTime();
  }

  /**
   * Prepare date for displaying
   * Формат травень, 2024
   * @param date
   */
  static prepareDate(date: string): string {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime())
      ? `${MONTHS_LIST_DEFAULT[dateObj.getMonth()]}, ${dateObj.getFullYear()}`
      : STRING.DASH;
  }

  /**
   * Prepare PQ dateSigned for displaying
   * Формат «01» травня 2024 року
   * @param date
   * @param yearSuffix
   */
  static prepareDateSigned(date: string, yearSuffix = "p."): string {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime())
      ? `«${dateObj.getDate()}» ${MONTHS_LIST[dateObj.getMonth()]} ${dateObj.getFullYear()} ${yearSuffix}`
      : `«___»_________ 202_ ${yearSuffix}`;
  }

  /**
   * "2025-02-10T09:47:13+00:00" => "2025-02-10 09:47:13"
   * @param date
   */
  static formatISODate(date: string): string {
    const DATE_LENGTH = 19;
    return date.replace("T", " ").substring(0, DATE_LENGTH);
  }

  private static resetTimeToMidnight(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
    return newDate;
  }
}
