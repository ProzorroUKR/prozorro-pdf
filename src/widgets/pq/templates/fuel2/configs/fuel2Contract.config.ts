import { pqBase, pqTexts } from "@/widgets/pq/configs/pqTexts";
import { PdfItemEnum } from "@/widgets/pq/types/TextConfigType";
import type { TextConfigType } from "@/widgets/pq/types/TextConfigType";
import { pqGenericTexts } from "@/widgets/pq/templates/generic/configs/pqGenericTexts";
import { DEFAULT_TEXT_FIELDS, STRING } from "@/constants/string";
import { FormattingFunctionsEnum } from "@/widgets/pq/services/Formating/config/FormattingFunctions.enum";

export const fuel2ContractConfig: TextConfigType = {
  subject: [pqTexts.subject.fuelObligations, pqTexts.subject.talons, pqTexts.subject.fuelProcurement],
  price: [pqTexts.price.fuelTotalPrice, pqTexts.price.noPriceRaise, pqTexts.price.allowAmountDecrease],
  paymentOrder: [pqTexts.paymentOrder.article23, pqTexts.paymentOrder.financing, pqTexts.paymentOrder.fuelFundFreeze],
  deliveryTerms: [
    {
      text: [pqGenericTexts.paymentOrder.buyerPays, 0],
      paths: ["items"],
      defaults: [DEFAULT_TEXT_FIELDS.UNDERSCORES_16],
      pdfType: PdfItemEnum.LIST_ITEM,
      functionName: [FormattingFunctionsEnum.PAYMENT_DETAILS],
    },
    pqTexts.deliveryTerms.fuelTalonDeliveryTime,
    pqTexts.deliveryTerms.fuelRelease,
    pqTexts.deliveryTerms.fuelSupplier,
  ],
  guarantee: [
    pqTexts.guarantee.fuelQuality,
    pqTexts.guarantee.fuelClaim,
    pqTexts.guarantee.fuelTalonSubstituion,
    pqTexts.guarantee.talonEndDate,
  ],
  acceptanceOrder: [
    pqTexts.acceptanceOrder.talonTransfer,
    pqTexts.acceptanceOrder.actualReceipt,
    pqTexts.acceptanceOrder.deliveryPlace,
    pqTexts.acceptanceOrder.gasOperator,
    pqTexts.acceptanceOrder.talonDueDate,
  ],
  rights: [
    pqTexts.rights.fuelSupplierHasRight,
    pqTexts.rights.fuelSupplierUndertakes,
    pqTexts.rights.fuelBuyerHasRight,
    pqTexts.rights.fuelBuyerUndertakes,
  ],
  responsibilities: [
    pqTexts.responsibilities.sidesResponsibilities,
    pqTexts.responsibilities.fuelQualityViolation,
    pqTexts.responsibilities.fuelReplacement,
    pqTexts.responsibilities.fuelPeriodViolation,
    pqTexts.responsibilities.fuelPaymentViolation,
    pqTexts.responsibilities.penalties,
    pqTexts.responsibilities.rejection,
    pqTexts.responsibilities.fuelPaymentDecrease,
  ],
  disputes: [pqTexts.disputes.communication, pqTexts.disputes.court],
  forceMajeure: [
    pqTexts.forceMajeure.onset,
    pqTexts.forceMajeure.statement,
    pqTexts.forceMajeure.events,
    pqTexts.forceMajeure.notification,
    pqTexts.forceMajeure.noNotification,
    pqTexts.forceMajeure.continuePeriod,
    pqTexts.forceMajeure.contractExtension,
    pqTexts.forceMajeure.tradeChamber,
  ],
  anticorruption: [
    pqTexts.anticorruption.noStimulation,
    pqTexts.anticorruption.immediateNotification,
    pqTexts.anticorruption.anticorruptionLaw,
    pqTexts.anticorruption.confidentiality,
  ],
  messaging: [
    pqTexts.messaging.electronic,
    pqTexts.messaging.addresses,
    {
      text: [pqTexts.messaging.fromSupplier, 0, STRING.DELIMITER.DOUBLE_NEWLINE],
      paths: ["suppliers[0].signerInfo.email"],
      defaults: [pqBase.eAddress],
      pdfType: PdfItemEnum.TEXT,
    },
    {
      text: [pqTexts.messaging.fromBuyer, 0, STRING.DELIMITER.DOUBLE_NEWLINE],
      paths: ["buyer.signerInfo.email"],
      defaults: [pqBase.eAddress],
      pdfType: PdfItemEnum.TEXT,
    },
    pqTexts.messaging.authorizedPerson,
  ],
  signOrder: [
    pqTexts.signOrder.electronicTrust,
    pqTexts.signOrder.deedOfTermination,
    pqTexts.signOrder.lossOfDocument,
    pqTexts.signOrder.fullPower,
  ],
  contractAction: [
    [pqTexts.contractAction.takesEffect, pqTexts.contractAction.takesEffectSub],
    pqTexts.contractAction.computerElongation,
    pqTexts.contractAction.refusal,
    pqTexts.contractAction.additionals,
  ],
  finalStatements: [
    pqTexts.finalStatements.conditionsChange,
    pqTexts.finalStatements.byAgreement,
    pqTexts.finalStatements.thirdParties,
    pqTexts.finalStatements.changeOfLocation,
    pqTexts.finalStatements.unRegulated,
    pqTexts.finalStatements.taxStatus,
    pqTexts.finalStatements.personalData,
    pqTexts.finalStatements.noChangeAfterSign,
  ],
  additionals: [
    pqTexts.additionals.additionalContracts,
    [pqTexts.additionals.integralPart, pqTexts.additionals.specification],
  ],
};
