import type { OlConfigType } from "@/widgets/pq/types/TextConfigType";
import { PdfItemEnum } from "@/widgets/pq/types/TextConfigType";
import { DEFAULT_TEXT_FIELDS, STRING } from "@/constants/string";
import { pqGenericAddition2Texts } from "@/widgets/pq/templates/generic/configs/pqGenericTexts";
import { FormattingFunctionsEnum } from "@/widgets/pq/services/Formating/config/FormattingFunctions.enum";

export const ensuringTextsConfig: OlConfigType[] = [
  pqGenericAddition2Texts.enforcementObligation, // 1
  {
    // 2
    text: [pqGenericAddition2Texts.enforcementFormIs, 0],
    paths: ["requirement.title"],
    defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_16],
    pdfType: PdfItemEnum.LIST_ITEM,
    functionName: [FormattingFunctionsEnum.GET_ENSURING_TYPE],
  },
  {
    // 3
    text: [pqGenericAddition2Texts.enforcementAmount, 0, pqGenericAddition2Texts.percentFromTotal],
    paths: ["value"],
    defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_3],
    pdfType: PdfItemEnum.LIST_ITEM,
    functionName: [FormattingFunctionsEnum.GET_PERCENT],
  },
  pqGenericAddition2Texts.costsOnSupplier, // 4
  [
    // 5
    pqGenericAddition2Texts.optionGuaranteesConditions, // 5
    pqGenericAddition2Texts.guaranteeIndicate, // 5.1
    pqGenericAddition2Texts.guaranteeForm, // 5.2
    {
      // 5.3
      text: [pqGenericAddition2Texts.guaranteeTerm, 0, pqGenericAddition2Texts.calendarDays],
      paths: ["value"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_3],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.GET_GUARANTEE_PERIOD],
    },
    pqGenericAddition2Texts.ifInsolvent, // 5.4
    {
      // 5.5
      text: [0],
      paths: ["value"],
      defaults: [STRING.EMPTY],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.GET_ENSURING_OPTIONAL_FIELD],
    },
  ],
  pqGenericAddition2Texts.moneyReturnTerms, // 9
  pqGenericAddition2Texts.moneyNoReturn, // 10
  pqGenericAddition2Texts.notExemptFromLiability, // 11
];
