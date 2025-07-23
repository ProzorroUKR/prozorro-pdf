import { pqBase, pqSpecificationTexts } from "@/widgets/pq/configs/pqTexts";
import {
  pqGenericAddition1Texts,
  pqGenericBase,
  pqGenericTexts,
} from "@/widgets/pq/templates/generic/configs/pqGenericTexts";
import { PdfItemEnum } from "@/widgets/pq/types/TextConfigType";
import type { TextConfigType } from "@/widgets/pq/types/TextConfigType";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { DEFAULT_TEXT_FIELDS, STRING } from "@/constants/string";
import { FormattingFunctionsEnum } from "@/widgets/pq/services/Formating/config/FormattingFunctions.enum";

export const genericContractConfig: TextConfigType = {
  subject: [
    // 1
    {
      text: [pqGenericTexts.subject.obligationsToBuyer, pqGenericTexts.subject.productClassificationID, 0],
      paths: ["items[0].classification.id"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_16],
      pdfType: PdfItemEnum.LIST_ITEM,
    },
    pqGenericTexts.subject.ownership,
    pqGenericTexts.subject.terms,
    pqGenericTexts.subject.supply,
    {
      text: [pqGenericTexts.subject.tender, 0, STRING.DELIMITER.DOT_NEW_LINE, pqGenericTexts.subject.note],
      paths: ["tenderID"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_40],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.TENDER_ID],
    },
  ],
  assortment: [
    // 2
    pqGenericTexts.assortment.quantity,
    pqGenericTexts.assortment.buyerRights,
  ],
  guarantee: [
    // 3
    pqGenericTexts.guarantee.correspondentQuality,
    pqGenericTexts.guarantee.qualityRequirements,
    [pqGenericTexts.guarantee.penalty, pqGenericTexts.guarantee.rejection, pqGenericTexts.guarantee.lowQualityGood],
    pqGenericTexts.guarantee.improvement,
    pqGenericTexts.guarantee.period,
    pqGenericTexts.guarantee.warrantyPeriodLength,
    pqGenericTexts.guarantee.duration,
    pqGenericTexts.guarantee.replacement,
    pqGenericTexts.guarantee.implementationTerms,
  ],
  price: [
    // 4
    {
      text: [pqGenericTexts.price.amountDefinition, 0],
      paths: ["value.amount"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_68],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.PRICE_WITH_TAX_TO_TEXT],
    },
    pqGenericTexts.price.perProduct,
    pqGenericTexts.price.expensesList,
  ],
  paymentOrder: [
    // 5
    pqGenericTexts.paymentOrder.cashless,
    {
      text: [pqGenericTexts.paymentOrder.buyerPays, 0],
      paths: ["items"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_16],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.PAYMENT_DETAILS],
    },
    pqGenericTexts.paymentOrder.bankDays,
    pqGenericTexts.paymentOrder.budgetFunding, // 5.4 term
    [
      pqGenericTexts.paymentOrder.prepayment,
      pqGenericTexts.paymentOrder.tillDelivery,
      pqGenericTexts.paymentOrder.additionalAgreement,
      pqGenericTexts.paymentOrder.buyerRejection,
      pqGenericTexts.paymentOrder.supplierRejection,
    ],
    pqGenericTexts.paymentOrder.notCredit,
  ],
  package: [
    // 6
    pqGenericTexts.package.safety,
    pqGenericTexts.package.quality,
    pqGenericTexts.package.refund,
    pqGenericTexts.package.price,
    pqGenericTexts.package.requirements,
  ],
  deliveryTerms: [
    // 7
    pqGenericTexts.deliveryTerms.underTermDelivery,
    pqGenericTexts.deliveryTerms.place,
    pqGenericTexts.deliveryTerms.partly, // 7.3
    pqGenericTexts.deliveryTerms.emailInfo,
    pqGenericTexts.deliveryTerms.legacy,
    pqGenericTexts.deliveryTerms.location,
    pqGenericTexts.deliveryTerms.period, // 7.7
    pqGenericTexts.deliveryTerms.signing,
    pqGenericTexts.deliveryTerms.notMeetRequirements, // 7.9
    pqGenericTexts.deliveryTerms.excessiveGoods,
    pqGenericTexts.deliveryTerms.requiredDocumentation,
    [
      pqGenericTexts.deliveryTerms.improperDocumentation,
      pqGenericTexts.deliveryTerms.supplierAuthority,
      pqGenericTexts.deliveryTerms.notSufficientAuthority,
    ],
    pqGenericTexts.deliveryTerms.deficiencies, // 7.13
    pqGenericTexts.deliveryTerms.deficienciesDocumentation, // 7.14
    pqGenericTexts.deliveryTerms.examination,
    pqGenericTexts.deliveryTerms.lesserQuantityOfGoods,
    pqGenericTexts.deliveryTerms.lesserAssortmentOfGoods,
    pqGenericTexts.deliveryTerms.signingRequirements,
    pqGenericTexts.deliveryTerms.education, // 7.19
    {
      // 7.20
      text: [pqGenericTexts.deliveryTerms.educationPrice, 0, pqGenericTexts.deliveryTerms.educationLimit],
      paths: ["value.amount"],
      defaults: [pqGenericBase.educationPrice],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.EDUCATION_PRICE],
    },
  ],
  responsibilities: [
    // 8
    pqGenericTexts.responsibilities.definition,
    pqGenericTexts.responsibilities.periodViolation,
    pqGenericTexts.responsibilities.hugePeriodViolation, // 8.3 term
    pqGenericTexts.responsibilities.rejection,
    pqGenericTexts.responsibilities.qualityViolation,
    pqGenericTexts.responsibilities.penalties,
    pqGenericTexts.responsibilities.additionalPenalties,
  ],
  forceMajeure: [
    // 9
    pqGenericTexts.forceMajeure.definition,
    pqGenericTexts.forceMajeure.martialLaw,
    pqGenericTexts.forceMajeure.notForceMajeure,
    pqGenericTexts.forceMajeure.delay,
    pqGenericTexts.forceMajeure.resumeObligations,
    pqGenericTexts.forceMajeure.notificationTerm,
    pqGenericTexts.forceMajeure.tradeChamber,
    pqGenericTexts.forceMajeure.significantlyComplicated,
    pqGenericTexts.forceMajeure.alreadyDelayed,
    pqGenericTexts.forceMajeure.bothKnowThereIsAWar,
  ],
  disputes: [
    // 10
    pqGenericTexts.disputes.communication,
    pqGenericTexts.disputes.court,
    pqGenericTexts.disputes.violator,
  ],
  anticorruption: [
    // 11
    pqGenericTexts.anticorruption.definition,
    pqGenericTexts.anticorruption.precedent,
    pqGenericTexts.anticorruption.criminal,
    pqGenericTexts.anticorruption.factsConsideration,
    pqGenericTexts.anticorruption.confidentiality,
    pqGenericTexts.anticorruption.civilCodeOfUkraine,
  ],
  sanction: [
    // 12
    pqGenericTexts.sanction.supplierRejectionList,
    pqGenericTexts.sanction.manufacturerRejectionList,
    pqGenericTexts.sanction.productOrigins,
    pqGenericTexts.sanction.supplierLegalEntity,
  ],
  contractAction: [
    // 13
    {
      text: [
        pqGenericTexts.contractAction.agreementValidTermStart,
        0,
        pqGenericTexts.contractAction.agreementValidTermEnd,
      ],
      paths: ["period.endDate"],
      defaults: [pqBase.year],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.CONVERT_DATE],
    },
    pqGenericTexts.contractAction.extension,
    pqGenericTexts.contractAction.sufficientExtensionPeriod,
  ],
  messaging: [
    // 14
    pqGenericTexts.messaging.termsNotDiffer,
    pqGenericTexts.messaging.stability,
    pqGenericTexts.messaging.changesCompromise,
    [pqGenericTexts.messaging.changesInitiative, pqGenericTexts.messaging.enhancedQuality],
    pqGenericTexts.messaging.detailChanges,
    pqGenericTexts.messaging.termination,
    pqGenericTexts.messaging.obligations,
    pqGenericTexts.messaging.settleDebts,
  ],
  confidential: [
    // 15
    pqGenericTexts.confidential.define,
    pqGenericTexts.confidential.secure,
    pqGenericTexts.confidential.notifyAboutConfidentiality,
    pqGenericTexts.confidential.necessaryInformation,
  ],
  otherTerms: [
    // 16
    pqGenericTexts.otherTerms.procurementLaw,
    pqGenericTexts.otherTerms.countryLaw,
    pqGenericTexts.otherTerms.warrants,
    {
      text: [
        pqGenericTexts.otherTerms.messages,
        STRING.DELIMITER.NEW_LINE,
        pqGenericBase.fromSupplier,
        0,
        STRING.DELIMITER.NEW_LINE,
        pqGenericBase.fromBuyer,
        1,
        STRING.DELIMITER.NEW_LINE,
        pqGenericTexts.otherTerms.messagesDetailsInAgreement,
      ],
      paths: ["suppliers[0].signerInfo.email", "buyer.signerInfo.email"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_40, DEFAULT_TEXT_FIELDS.UNDERSCORES_40],
      pdfType: PdfItemEnum.LIST_ITEM,
    },
    pqGenericTexts.otherTerms.eDocumentValidity,
    pqGenericTexts.otherTerms.agreementQuantity,
    pqGenericTexts.otherTerms.factoring,
    pqGenericTexts.otherTerms.transferObligations,
    pqGenericTexts.otherTerms.integralAppendices,
  ],
};

export const genericTableItemsHeader = [
  {
    text: pqSpecificationTexts.productName,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
  {
    text: pqSpecificationTexts.amount,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
  {
    text: pqSpecificationTexts.packing,
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

export const genericTableAddressHeader = [
  {
    text: pqGenericAddition1Texts.productName,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
  {
    text: pqGenericAddition1Texts.addressColumn,
    style: PDF_FILED_KEYS.BOLD_TEXT,
  },
];
