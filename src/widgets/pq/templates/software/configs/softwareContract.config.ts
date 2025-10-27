import { PdfItemEnum } from "@/widgets/pq/types/TextConfigType";
import type { TextConfigType } from "@/widgets/pq/types/TextConfigType";
import { pqGenericBase, pqGenericTexts } from "@/widgets/pq/templates/generic/configs/pqGenericTexts";
import { pqBase } from "@/widgets/pq/configs/pqTexts";
import { DEFAULT_TEXT_FIELDS, STRING } from "@/constants/string";
import { softwareTextsConfig } from "@/widgets/pq/templates/software/configs/softwareTexts.config";
import { FormattingFunctionsEnum } from "@/widgets/pq/services/Formating/config/FormattingFunctions.enum";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";

export const softwareContractConfig: TextConfigType = {
  terms: [
    // 1 !
    softwareTextsConfig.terms.definition,
    softwareTextsConfig.terms.software,
    softwareTextsConfig.terms.component,
    softwareTextsConfig.terms.certificate, // 1.4
    softwareTextsConfig.terms.hardware,
    softwareTextsConfig.terms.owner,
    softwareTextsConfig.terms.requestPriority, // 1.7
    softwareTextsConfig.terms.supplier,
    softwareTextsConfig.terms.serviceDesk,
    softwareTextsConfig.terms.support,
  ],
  subject: [
    // 2 !
    {
      text: [
        softwareTextsConfig.subject.obligationsToBuyer,
        softwareTextsConfig.subject.productClassificationID,
        0,
        STRING.DOT,
      ],
      paths: ["items[0].classification.id"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_16],
      pdfType: PdfItemEnum.LIST_ITEM,
    },
    softwareTextsConfig.subject.list, // 2.2
    softwareTextsConfig.subject.installation, // 2.3
    softwareTextsConfig.subject.eula, // 2.4
    softwareTextsConfig.subject.support, // 2.5
    softwareTextsConfig.subject.update, // 2.6
    softwareTextsConfig.subject.ownership, // 2.7
    softwareTextsConfig.subject.rights, // 2.8
    softwareTextsConfig.subject.credentials,
    softwareTextsConfig.subject.hardware,
    {
      // 2.11
      text: [softwareTextsConfig.subject.tender, 0, STRING.DELIMITER.DOT_NEW_LINE, softwareTextsConfig.subject.note],
      paths: ["tenderID"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_40],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.TENDER_ID],
    },
    softwareTextsConfig.subject.terms, // 2.12
    softwareTextsConfig.subject.guarantee, // 2.13
  ],
  assortment: [
    // 3 !
    softwareTextsConfig.assortment.quantity,
    softwareTextsConfig.assortment.buyerRights,
  ],
  guarantee: [
    // 4 !
    softwareTextsConfig.guarantee.correspondentQuality,
    softwareTextsConfig.guarantee.qualityRequirements,
    softwareTextsConfig.guarantee.asIs,
    softwareTextsConfig.guarantee.acceptance,
    softwareTextsConfig.guarantee.modernization,
    softwareTextsConfig.guarantee.modernizationLimitation,
  ],
  price: [
    // 5 !
    softwareTextsConfig.price.amountDefinition,
    softwareTextsConfig.price.perProduct,
    softwareTextsConfig.price.expensesList,
  ],
  paymentOrder: [
    // 6 !
    softwareTextsConfig.paymentOrder.cashless, // 6.1
    {
      // 6.2
      text: [softwareTextsConfig.paymentOrder.buyerPays, 0],
      paths: ["items"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_16],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.PAYMENT_DETAILS],
    },
    softwareTextsConfig.paymentOrder.bankDays, // 6.3
    softwareTextsConfig.paymentOrder.budgetFunding,
    [
      softwareTextsConfig.paymentOrder.prepayment,
      softwareTextsConfig.paymentOrder.tillDelivery, // 6.5.1
      softwareTextsConfig.paymentOrder.additionalAgreement, // 6.5.2
      softwareTextsConfig.paymentOrder.buyerRejection, // 6.5.3
      softwareTextsConfig.paymentOrder.supplierRejection, // 6.5.4
    ],
    softwareTextsConfig.paymentOrder.notCredit, // 6.6
  ],
  deliveryTerms: [
    // 7 !
    softwareTextsConfig.deliveryTerms.underTermDelivery,
    softwareTextsConfig.deliveryTerms.place,
    softwareTextsConfig.deliveryTerms.quality, // 7.3
    softwareTextsConfig.deliveryTerms.contract, // 7.4
    softwareTextsConfig.deliveryTerms.date, // 7.5
    softwareTextsConfig.deliveryTerms.right,
    softwareTextsConfig.deliveryTerms.notMeetRequirements, // 7.7
    softwareTextsConfig.deliveryTerms.requiredDocumentation,
    [
      softwareTextsConfig.deliveryTerms.improperDocumentation, // 7.9
      softwareTextsConfig.deliveryTerms.supplierAuthority,
      softwareTextsConfig.deliveryTerms.notSufficientAuthority,
    ],
    softwareTextsConfig.deliveryTerms.deficiencies, // 7.10
    softwareTextsConfig.deliveryTerms.deficienciesDocumentation, // 7.11
    softwareTextsConfig.deliveryTerms.sign, // 7.12
    softwareTextsConfig.deliveryTerms.copies, // 7.13
    softwareTextsConfig.deliveryTerms.examination, // 7.14
    softwareTextsConfig.deliveryTerms.lesserQuantityOfGoods,
    softwareTextsConfig.deliveryTerms.lesserAssortmentOfGoods, // 7.16
    softwareTextsConfig.deliveryTerms.partly, // 7.17
    softwareTextsConfig.deliveryTerms.signingRequirements, // 7.18
  ],
  intellectualProperty: [
    // 8
    [
      softwareTextsConfig.intellectualProperty.included, // 8.1
      softwareTextsConfig.intellectualProperty.copy, // 8.1.1
      softwareTextsConfig.intellectualProperty.decompile, // 8.1.2
    ],
    softwareTextsConfig.intellectualProperty.changes, // 8.2
    softwareTextsConfig.intellectualProperty.usage, // 8.3
    softwareTextsConfig.intellectualProperty.violation, // 8.4
  ],
  technicalSupport: [
    // 9
    [
      softwareTextsConfig.technicalSupport.included,
      softwareTextsConfig.technicalSupport.consultation,
      softwareTextsConfig.technicalSupport.update,
      softwareTextsConfig.technicalSupport.incidents,
    ],
    softwareTextsConfig.technicalSupport.malfunction, // 9.2
    softwareTextsConfig.technicalSupport.malfunctionList,
    softwareTextsConfig.technicalSupport.period, // 9.4
    softwareTextsConfig.technicalSupport.credentials,
    softwareTextsConfig.technicalSupport.request, // 9.6
    softwareTextsConfig.technicalSupport.priority, // 9.7
    softwareTextsConfig.technicalSupport.priorityDefinition, // 9.8
    {
      // 9.8
      header: [...softwareTextsConfig.priority.header], // array of 3 strings
      text: [
        ...softwareTextsConfig.priority.critical,
        ...softwareTextsConfig.priority.high,
        ...softwareTextsConfig.priority.low,
        ...softwareTextsConfig.priority.request,
      ],
      paths: [STRING.EMPTY],
      defaults: [STRING.EMPTY],
      widths: [PDF_HELPER_CONST.ROW_WIDTH_90, PDF_HELPER_CONST.ROW_WIDTH_90, PDF_HELPER_CONST.ROW_ALL_WIDTH],
      pdfType: PdfItemEnum.TABLE,
    },
  ],
  responsibilities: [
    // 10 !
    softwareTextsConfig.responsibilities.definition,
    softwareTextsConfig.responsibilities.periodViolation,
    softwareTextsConfig.responsibilities.hugePeriodViolation,
    softwareTextsConfig.responsibilities.rejection,
    softwareTextsConfig.responsibilities.qualityViolation, // 10.5
    softwareTextsConfig.responsibilities.penalties,
    softwareTextsConfig.responsibilities.additionalPenalties,
  ],
  forceMajeure: [
    // 11 !
    softwareTextsConfig.forceMajeure.definition,
    softwareTextsConfig.forceMajeure.martialLaw,
    softwareTextsConfig.forceMajeure.notForceMajeure,
    softwareTextsConfig.forceMajeure.delay,
    softwareTextsConfig.forceMajeure.resumeObligations,
    softwareTextsConfig.forceMajeure.notificationTerm,
    softwareTextsConfig.forceMajeure.tradeChamber,
    softwareTextsConfig.forceMajeure.significantlyComplicated,
    softwareTextsConfig.forceMajeure.alreadyDelayed,
    softwareTextsConfig.forceMajeure.bothKnowThereIsAWar,
  ],
  disputes: [
    // 12 !
    pqGenericTexts.disputes.communication,
    pqGenericTexts.disputes.court,
    pqGenericTexts.disputes.violator,
  ],
  anticorruption: [
    // 13 !
    pqGenericTexts.anticorruption.definition,
    pqGenericTexts.anticorruption.precedent,
    pqGenericTexts.anticorruption.criminal,
    pqGenericTexts.anticorruption.factsConsideration,
    pqGenericTexts.anticorruption.confidentiality,
    pqGenericTexts.anticorruption.civilCodeOfUkraine,
  ],
  sanction: [
    // 14 !
    pqGenericTexts.sanction.supplierRejectionList,
    pqGenericTexts.sanction.manufacturerRejectionList,
    softwareTextsConfig.sanction.productOrigins,
    pqGenericTexts.sanction.supplierLegalEntity,
  ],
  contractAction: [
    // 15 !
    {
      text: [
        softwareTextsConfig.contractAction.agreementValidTermStart,
        0,
        softwareTextsConfig.contractAction.agreementValidTermEnd,
      ],
      paths: ["period.endDate"],
      defaults: [pqBase.year],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.CONVERT_DATE],
    },
    softwareTextsConfig.contractAction.extension,
    softwareTextsConfig.contractAction.sufficientExtensionPeriod,
  ],
  messaging: [
    // 16 !
    softwareTextsConfig.messaging.termsNotDiffer,
    softwareTextsConfig.messaging.stability,
    softwareTextsConfig.messaging.changesCompromise,
    [
      softwareTextsConfig.messaging.changesInitiative, // 16.4
      softwareTextsConfig.messaging.enhancedQuality, // 16.4.1
    ],
    softwareTextsConfig.messaging.detailChanges,
    softwareTextsConfig.messaging.termination,
    softwareTextsConfig.messaging.obligations,
    softwareTextsConfig.messaging.settleDebts,
  ],
  confidential: [
    // 17 !
    softwareTextsConfig.confidential.define,
    softwareTextsConfig.confidential.secure,
    softwareTextsConfig.confidential.notifyAboutConfidentiality,
    pqGenericTexts.confidential.necessaryInformation,
  ],
  otherTerms: [
    // 18 !
    softwareTextsConfig.otherTerms.procurementLaw,
    softwareTextsConfig.otherTerms.countryLaw,
    softwareTextsConfig.otherTerms.warrants,
    {
      text: [
        softwareTextsConfig.otherTerms.messages,
        STRING.DELIMITER.NEW_LINE,
        pqGenericBase.fromSupplier,
        0,
        STRING.DELIMITER.NEW_LINE,
        pqGenericBase.fromBuyer,
        1,
        STRING.DELIMITER.NEW_LINE,
        softwareTextsConfig.otherTerms.messagesDetailsInAgreement,
      ],
      paths: ["suppliers[0].signerInfo.email", "buyer.signerInfo.email"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_40, DEFAULT_TEXT_FIELDS.UNDERSCORES_40],
      pdfType: PdfItemEnum.LIST_ITEM,
    },
    softwareTextsConfig.otherTerms.eDocumentValidity,
    softwareTextsConfig.otherTerms.agreementQuantity,
    softwareTextsConfig.otherTerms.factoring,
    softwareTextsConfig.otherTerms.transferObligations,
    softwareTextsConfig.otherTerms.integralAppendices,
  ],
};
