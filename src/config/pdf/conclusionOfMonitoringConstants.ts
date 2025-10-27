import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { STRING } from "@/constants/string";
import * as CONCLUSION_OF_MONITORING_CONST from "@/config/pdf/conclusionOfMonitoringConstants";
import { CONCLUSION_OF_MONITORING_TEXTS_LIST } from "@/config/pdf/texts/CONCLUSION_OF_MONITORING";

export const TEXT_FIELD = {
  style: PDF_FILED_KEYS.FIELD_TEXT,
};

export const MARGIN_TOP_10 = [
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_10,
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_0,
];

export const MARGIN_TOP_30 = [
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_30,
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_0,
];

export const MARGIN_TOP_30__BOTTOM_15 = [
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_30,
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_15,
];

export const MARGIN_TOP_10__BOTTOM_15 = [
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_10,
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_15,
];

export const MARGIN_TOP_5__BOTTOM_5__LEFT_MINUS_5 = [
  PDF_HELPER_CONST.MARGIN_MINUS_5,
  PDF_HELPER_CONST.MARGIN_5,
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_5,
];

export const MARGIN_BOTTOM_3 = [
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_3,
];

export const MARGIN_TOP_3 = [
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_3,
  PDF_HELPER_CONST.MARGIN_0,
  PDF_HELPER_CONST.MARGIN_0,
];

export const beforeXDate = new Map<string, string | Record<string, any>>()
  .set("human-id", STRING.EMPTY)
  .set("resultText", PDF_FILED_KEYS.TITLE_MEDIUM)
  .set("signSpace", PDF_HELPER_CONST.EMPTY_FIELD)
  .set("signTitle", PDF_HELPER_CONST.EMPTY_FIELD)
  .set("afterText", PDF_HELPER_CONST.EMPTY_FIELD)
  .set("fullName", CONCLUSION_OF_MONITORING_TEXTS_LIST.full_name_old)
  .set("signFullName", CONCLUSION_OF_MONITORING_TEXTS_LIST.sign_full_name_old)
  .set("customerInfo", CONCLUSION_OF_MONITORING_TEXTS_LIST.customer_info_new)
  .set("infoAboutSubject", CONCLUSION_OF_MONITORING_TEXTS_LIST.info_about_subject_old)
  .set("conclusionOnPresence", CONCLUSION_OF_MONITORING_TEXTS_LIST.conclusion_on_presence)
  .set("position2", CONCLUSION_OF_MONITORING_TEXTS_LIST.position_2);

export const afterXDate = new Map<string, string | Record<string, any>>()
  .set("human-id", "№ ")
  .set("resultText", PDF_FILED_KEYS.TITLE_MEDIUM_BOLD)
  .set("signSpace", {
    margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_BOTTOM_3,
    text: CONCLUSION_OF_MONITORING_TEXTS_LIST.underline_spaces,
    style: PDF_FILED_KEYS.UNDERLINE,
  })
  .set("signTitle", [
    PDF_HELPER_CONST.EMPTY_FIELD,
    {
      text: CONCLUSION_OF_MONITORING_TEXTS_LIST.sign,
      style: PDF_FILED_KEYS.FIELD_DESCRIPTION_TEXT,
    },
  ])
  .set("afterText", {
    margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_3,
    text: CONCLUSION_OF_MONITORING_TEXTS_LIST.article_351,
    style: PDF_FILED_KEYS.ITALIC_TEXT,
  })
  .set("signFullName", CONCLUSION_OF_MONITORING_TEXTS_LIST.sign_full_name_new)
  .set("fullName", CONCLUSION_OF_MONITORING_TEXTS_LIST.full_name_new)
  .set("customerInfo", CONCLUSION_OF_MONITORING_TEXTS_LIST.customer_info_new)
  .set("infoAboutSubject", CONCLUSION_OF_MONITORING_TEXTS_LIST.info_about_subject_new)
  .set("conclusionOnPresence", CONCLUSION_OF_MONITORING_TEXTS_LIST.conclusion_on_presence)
  .set("position2", CONCLUSION_OF_MONITORING_TEXTS_LIST.position_2);

export const afterYDate = new Map<string, string | Record<string, any>>()
  .set("human-id", "№ ")
  .set("resultText", PDF_FILED_KEYS.TITLE_MEDIUM_BOLD)
  .set("signSpace", {
    margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_BOTTOM_3,
    text: CONCLUSION_OF_MONITORING_TEXTS_LIST.underline_spaces,
    style: PDF_FILED_KEYS.UNDERLINE,
  })
  .set("signTitle", [
    PDF_HELPER_CONST.EMPTY_FIELD,
    {
      text: CONCLUSION_OF_MONITORING_TEXTS_LIST.sign,
      style: PDF_FILED_KEYS.FIELD_DESCRIPTION_TEXT,
    },
  ])
  .set("afterText", {
    margin: CONCLUSION_OF_MONITORING_CONST.MARGIN_TOP_3,
    text: CONCLUSION_OF_MONITORING_TEXTS_LIST.article_351_y,
    style: PDF_FILED_KEYS.ITALIC_TEXT,
  })
  .set("signFullName", CONCLUSION_OF_MONITORING_TEXTS_LIST.sign_full_name_new)
  .set("fullName", CONCLUSION_OF_MONITORING_TEXTS_LIST.full_name_new)
  .set("customerInfo", CONCLUSION_OF_MONITORING_TEXTS_LIST.customer_info_y)
  .set("infoAboutSubject", CONCLUSION_OF_MONITORING_TEXTS_LIST.info_about_subject_new)
  .set("conclusionOnPresence", CONCLUSION_OF_MONITORING_TEXTS_LIST.conclusion_on_presence_y)
  .set("position2", CONCLUSION_OF_MONITORING_TEXTS_LIST.position_2_y);
