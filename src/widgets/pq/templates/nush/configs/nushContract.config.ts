import { DEFAULT_TEXT_FIELDS, STRING } from "@/constants/string";
import { PdfItemEnum } from "@/widgets/pq/types/TextConfigType";
import type { TextConfigType } from "@/widgets/pq/types/TextConfigType";
import { pqGenericBase, pqGenericTexts } from "@/widgets/pq/templates/generic/configs/pqGenericTexts";
import { FormattingFunctionsEnum } from "@/widgets/pq/services/Formating/config/FormattingFunctions.enum";
import { nushTextsConfig } from "@/widgets/pq/templates/nush/configs/nushTexts.config";
import { pqBase } from "@/widgets/pq/configs/pqTexts";

export const nushContractConfig: TextConfigType = {
  subject: [
    {
      text: [nushTextsConfig.subject.obligationsToBuyer, nushTextsConfig.subject.productClassificationID, 0],
      paths: ["items[0].classification.id"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_16],
      pdfType: PdfItemEnum.LIST_ITEM,
    },
    nushTextsConfig.subject.ownership,
    nushTextsConfig.subject.guarantee,
  ],
  assortment: [nushTextsConfig.assortment.specification],
  guarantee: [
    nushTextsConfig.guarantee.specification,
    nushTextsConfig.guarantee.securityMeasures,
    nushTextsConfig.guarantee.substandard,
    nushTextsConfig.guarantee.acceptanceQuality,
    nushTextsConfig.guarantee.supplierGuarantees,
    nushTextsConfig.guarantee.guarantees,
    nushTextsConfig.guarantee.term,
    nushTextsConfig.guarantee.contractTime,
    nushTextsConfig.guarantee.qualityPeriod,
  ],
  price: [nushTextsConfig.price.totalPrice, nushTextsConfig.price.unitPrice, nushTextsConfig.price.additionalIncluded],
  paymentOrder: [
    nushTextsConfig.paymentOrder.cashless,
    [
      pqGenericTexts.paymentOrder.buyerPays,
      {
        text: [0],
        paths: ["milestones"],
        defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_16],
        pdfType: PdfItemEnum.LIST_ITEM,
        functionName: [FormattingFunctionsEnum.GET_FINANCING_MILESTONES],
      },
    ],
    nushTextsConfig.paymentOrder.term,
    nushTextsConfig.paymentOrder.nonWorkingPayment,
    nushTextsConfig.paymentOrder.customersRights,
  ],
  package: [
    pqGenericTexts.package.safety,
    pqGenericTexts.package.quality,
    nushTextsConfig.package.prepacked,
    nushTextsConfig.package.packedPrice,
    nushTextsConfig.package.marked,
  ],
  deliveryTerms: [
    nushTextsConfig.deliveryTerms.term,
    nushTextsConfig.deliveryTerms.deliveryPayment,
    [
      nushTextsConfig.deliveryTerms.conditions,
      {
        text: [0],
        paths: ["milestones"],
        defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_16],
        pdfType: PdfItemEnum.LIST_ITEM,
        functionName: [FormattingFunctionsEnum.GET_DELIVERY_MILESTONES],
      },
    ],
    ...nushTextsConfig.deliveryTerms.deliveryDetails,
  ],
  responsibilities: [
    nushTextsConfig.responsibilities.improperExecution,
    nushTextsConfig.responsibilities.violationOfDeliveryFee,
    nushTextsConfig.responsibilities.violationOfDeliveryDays,
    nushTextsConfig.responsibilities.agreementTermination,
    nushTextsConfig.responsibilities.poorQualityFees,
    nushTextsConfig.responsibilities.applicationOfFines,
  ],
  forceMajeure: [
    nushTextsConfig.forceMajeure.onset,
    nushTextsConfig.forceMajeure.martialLaw,
    nushTextsConfig.forceMajeure.significantChanges,
    nushTextsConfig.forceMajeure.delayPeriod,
    nushTextsConfig.forceMajeure.mitigation,
    nushTextsConfig.forceMajeure.forceMajorMessage,
    nushTextsConfig.forceMajeure.sufficientEvidence,
    nushTextsConfig.forceMajeure.mutuallyAcceptableSolution,
    nushTextsConfig.forceMajeure.delayedExecution,
    nushTextsConfig.forceMajeure.circumstancesOfWar,
  ],
  disputes: [nushTextsConfig.disputes.parley, nushTextsConfig.disputes.court, nushTextsConfig.disputes.claim],
  anticorruption: [
    nushTextsConfig.anticorruption.undueAdvantages,
    nushTextsConfig.anticorruption.notificationOnUndueAdvantages,
    nushTextsConfig.anticorruption.violationOfRequirements,
    nushTextsConfig.anticorruption.dueDiligence,
    nushTextsConfig.anticorruption.fullConfidentiality,
    nushTextsConfig.anticorruption.civilCodex,
  ],
  sanction: [...nushTextsConfig.sanction.staticText],
  contractAction: [
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
  ],
  messaging: [...nushTextsConfig.messaging.staticText],
  confidential: [...nushTextsConfig.confidential.staticText],
  otherTerms: [
    nushTextsConfig.otherTerms.currentLegislation,
    nushTextsConfig.otherTerms.interpretedInAccordance,
    nushTextsConfig.otherTerms.warrantsToOtherParty,
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
        pqGenericTexts.otherTerms.messagesDetailsInAgreement +
          nushTextsConfig.otherTerms.additionalMessagesDetailsInAgreement,
      ],
      paths: ["suppliers[0].signerInfo.email", "buyer.signerInfo.email"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_40, DEFAULT_TEXT_FIELDS.UNDERSCORES_40],
      pdfType: PdfItemEnum.LIST_ITEM,
    },
    nushTextsConfig.otherTerms.transferRights,
    nushTextsConfig.otherTerms.integralPartOfAgreement,
    nushTextsConfig.otherTerms.originalCopies,
    nushTextsConfig.otherTerms.factoring,
    nushTextsConfig.otherTerms.confirmParts,
  ],
};
