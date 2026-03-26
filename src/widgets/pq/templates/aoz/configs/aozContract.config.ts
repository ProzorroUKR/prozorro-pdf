import { DEFAULT_TEXT_FIELDS } from "@/constants/string";
import { PdfItemEnum } from "@/widgets/pq/types/TextConfigType";
import type { TextConfigType } from "@/widgets/pq/types/TextConfigType";
import { FormattingFunctionsEnum } from "@/widgets/pq/services/Formating/config/FormattingFunctions.enum";
import { pqBase, pqSpecificationTexts } from "@/widgets/pq/configs/pqTexts";
import { aozTextsConfig } from "@/widgets/pq/templates/aoz/configs/aozTexts.config.ts";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys.ts";
import { pqGenericAddition1Texts } from "@/widgets/pq/templates/generic/configs/pqGenericTexts.ts";
import { pqAozTexts } from "@/widgets/pq/templates/aoz/configs/pqAozTexts.ts";

export const aozContractConfig: TextConfigType = {
  subject: [
    aozTextsConfig.subject.obligationsToSupplier,
    {
      text: [aozTextsConfig.subject.contractId, 0, aozTextsConfig.subject.isEProcSystem],
      paths: ["tenderID"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_16],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.TENDER_ID],
    },
    aozTextsConfig.subject.ownership,
    aozTextsConfig.subject.quality,
    aozTextsConfig.subject.guarantee,
  ],
  price: [
    aozTextsConfig.price.unitPrice,
    aozTextsConfig.price.supplierConfirm,
    aozTextsConfig.price.supplierResponsibilities,
    {
      text: [aozTextsConfig.price.totalPrice, 0, aozTextsConfig.price.totalPriceEnd],
      paths: ["value.amount"],
      defaults: [DEFAULT_TEXT_FIELDS.DPA_PRICE],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.PRICE_WITH_TAX_TO_TEXT],
    },
    {
      text: [aozTextsConfig.price.totalBudget, 0],
      paths: ["value.amount"],
      defaults: [DEFAULT_TEXT_FIELDS.DPA_PRICE],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.PRICE_WITH_TAX_TO_TEXT],
    },
    ...(aozTextsConfig.price.additionalIncluded as string[]),
  ],
  delivery: aozTextsConfig.delivery,
  terms: aozTextsConfig.terms,
  guarantee: aozTextsConfig.guarantee,
  rulesAndDuties: aozTextsConfig.rulesAndDuties,
  responsibilities: aozTextsConfig.responsibilities as any,
  differences: aozTextsConfig.differences,
  privacyProtection: [
    ...aozTextsConfig.privacyProtection.partOne,
    {
      text: [
        aozTextsConfig.privacyProtection.partTwoStart,
        {
          text: aozTextsConfig.privacyProtection.link,
          link: aozTextsConfig.privacyProtection.link,
          color: "blue",
          decoration: "underline",
        },
        aozTextsConfig.privacyProtection.partTwoEnd,
      ],
      pdfType: PdfItemEnum.FORMATTED_LIST_ITEM,
    },
  ],
  reservation: aozTextsConfig.reservation,
  contractTerm: [
    {
      text: [aozTextsConfig.contractTerm.termPartStart, 0, aozTextsConfig.contractTerm.termPartEnd],
      paths: ["period.endDate"],
      defaults: [pqBase.year],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.CONVERT_DATE],
    },
    ...aozTextsConfig.contractTerm.last,
  ],
  cancelContract: aozTextsConfig.cancelContract,
  forceMajeure: aozTextsConfig.forceMajeure,
  otherConditions: [
    ...aozTextsConfig.otherConditions.mainParts,
    [
      ...aozTextsConfig.otherConditions.partsConfirmStart,
      {
        text: [
          aozTextsConfig.otherConditions.partsConfirmLinkedStart,
          {
            text: aozTextsConfig.otherConditions.partsConfirmLink,
            link: aozTextsConfig.otherConditions.partsConfirmLink,
            color: "blue",
            decoration: "underline",
          },
          aozTextsConfig.otherConditions.partsConfirmLinkedEnd,
        ],
        pdfType: PdfItemEnum.FORMATTED_LIST_ITEM,
      },
      ...aozTextsConfig.otherConditions.partsConfirmEnd,
    ],
    aozTextsConfig.otherConditions.mainPartsEnd,
  ] as any,
  additionals: aozTextsConfig.additionals,
};

export const aozTableItemsHeader = [
  {
    text: pqAozTexts.number,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
  {
    text: pqSpecificationTexts.productName,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
  {
    text: pqSpecificationTexts.amount,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
  {
    text: pqAozTexts.unit,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
  {
    text: pqGenericAddition1Texts.singlePrice,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
  {
    text: pqGenericAddition1Texts.totalPriceItem,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
];

export const aozItemTermsTableHeader = [
  {
    text: pqAozTexts.number,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
  {
    text: pqGenericAddition1Texts.productName,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
  {
    text: pqAozTexts.goodTerms,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
];

export const aozItemQuantityTableHeader = [
  {
    text: pqAozTexts.number,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
  {
    text: pqAozTexts.nomenclature,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
  {
    text: pqAozTexts.quantity,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
];

export const aozActOfAcceptanceAndTransferTableHeader = [
  {
    text: "№\n з/п",
    style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
  },
  {
    text: "Найменування",
    style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
  },
  {
    text: "Код NSN / \n Технічний \n код **",
    style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
  },
  {
    text: "Код \nУКТ ЗЕД",
    style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
  },
  {
    text: "Одиниця виміру",
    style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
  },
  {
    text: "Кількість",
    style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
  },
  {
    text: "Ціна без ПДВ, \nгрн",
    style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
  },
  {
    text: "Сума без ПДВ, \nгрн",
    style: PDF_FILED_KEYS.TITLE_MEDIUM_BOLD,
  },
];
