import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";

// margin: [left, top, right, bottom]
export const ANNOUNCEMENT_PAGE_MARGIN = [
  PDF_HELPER_CONST.MARGIN_40,
  PDF_HELPER_CONST.MARGIN_40,
  PDF_HELPER_CONST.MARGIN_40,
  PDF_HELPER_CONST.MARGIN_70,
];

export const DEFAULT_PAGE_MARGIN = [
  PDF_HELPER_CONST.MARGIN_40,
  PDF_HELPER_CONST.MARGIN_40,
  PDF_HELPER_CONST.MARGIN_40,
  PDF_HELPER_CONST.MARGIN_40,
];

export const FOOTER_MARGIN = [PDF_HELPER_CONST.MARGIN_40, 0, PDF_HELPER_CONST.MARGIN_40, 0];

export const FOOTER_COLUMN_MARGIN = [0, PDF_HELPER_CONST.MARGIN_15, 0, PDF_HELPER_CONST.MARGIN_15];

export const FOOTER_QR_MARGIN = [PDF_HELPER_CONST.MARGIN_20, PDF_HELPER_CONST.MARGIN_5, 0, 0];

export const TABLE_COLUMN_LEFT_MARGIN = [
  0,
  PDF_HELPER_CONST.MARGIN_5,
  PDF_HELPER_CONST.MARGIN_20,
  PDF_HELPER_CONST.MARGIN_5,
];

export const TABLE_COLUMN_RIGHT_MARGIN = [0, PDF_HELPER_CONST.MARGIN_5, 0, PDF_HELPER_CONST.MARGIN_5];

export const TABLE_COLUMN_MARGIN = [0, 0, PDF_HELPER_CONST.MARGIN_20, 0];

export const TIME_NAMES = {
  Years: ["рік", "роки", "років"],
  Months: ["місяць", "місяці", "місяців"],
  Days: ["день", "дні", "днів"],
  Hours: ["година", "години", "годин"],
  Minutes: ["хвилина", "хвилини", "хвилин"],
  Seconds: ["секунда", "секунди", "секунд"],
};
