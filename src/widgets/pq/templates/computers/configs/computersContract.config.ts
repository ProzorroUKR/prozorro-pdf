import { pqBase, pqSpecificationTexts, pqTexts } from "@/widgets/pq/configs/pqTexts";
import { PdfItemEnum } from "@/widgets/pq/types/TextConfigType";
import type { TextConfigType } from "@/widgets/pq/types/TextConfigType";
import { STRING } from "@/constants/string";

export const computersContractConfig: TextConfigType = {
  subject: [
    pqTexts.subject.obligationsToBuyer,
    pqTexts.subject.meetSpecification,
    pqTexts.subject.ownership,
    pqTexts.subject.procurementAmount,
    pqTexts.subject.noLawContradiction,
    pqTexts.subject.licenseCopy,
  ],
  price: [
    pqTexts.price.currencyComputers,
    pqTexts.price.complectation,
    pqTexts.price.noPriceRaise,
    pqTexts.price.allowAmountDecrease,
  ],
  paymentOrder: [
    pqTexts.paymentOrder.cashless,
    pqTexts.paymentOrder.bankDays,
    pqTexts.paymentOrder.article23,
    pqTexts.paymentOrder.financing,
    pqTexts.paymentOrder.temporalFundFreeze,
  ],
  deliveryTerms: [
    pqTexts.deliveryTerms.underTermDelivery,
    pqTexts.deliveryTerms.place,
    pqTexts.deliveryTerms.undeclaredGoods,
    pqTexts.deliveryTerms.onComputersDelivery,
    pqTexts.deliveryTerms.improperComputerDocumentation,
  ],
  guarantee: [
    pqTexts.guarantee.correspondentComputerQuality,
    [
      pqTexts.guarantee.computerSupplierGuarantee,
      pqTexts.guarantee.defectedComputer,
      pqTexts.guarantee.replacementTerm,
    ],
    pqTexts.guarantee.assortment,
    [
      pqTexts.guarantee.computerProperPacking,
      pqTexts.guarantee.computerSpecificationResponse,
      pqTexts.guarantee.computerPreventDestroy,
      pqTexts.guarantee.computerProperMarking,
      pqTexts.guarantee.computerMarkingLeak,
      pqTexts.guarantee.computerDueDate,
    ],
  ],
  acceptanceOrder: [
    pqTexts.acceptanceOrder.unload,
    pqTexts.acceptanceOrder.specificationCompliance,
    pqTexts.acceptanceOrder.transfer,
    pqTexts.acceptanceOrder.transferDecline,
    pqTexts.acceptanceOrder.ownershipRights,
    pqTexts.acceptanceOrder.packing,
    pqTexts.acceptanceOrder.shortage,
    pqTexts.acceptanceOrder.defected,
  ],
  rights: [
    pqTexts.rights.supplierUndertakes,
    pqTexts.rights.supplierHasRight,
    pqTexts.rights.buyerUndertakes,
    pqTexts.rights.buyerHasRight,
    pqTexts.rights.sidesUndertake,
  ],
  responsibilities: [
    pqTexts.responsibilities.sidesResponsibilities,
    pqTexts.responsibilities.qualityViolation,
    pqTexts.responsibilities.periodViolation,
    pqTexts.responsibilities.paymentViolation,
    pqTexts.responsibilities.penalties,
    pqTexts.responsibilities.rejection,
    pqTexts.responsibilities.paymentDecrease,
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

export const generalTableHeader = [
  {
    text: pqSpecificationTexts.productName,
  },
  {
    text: pqSpecificationTexts.technicalCharacteristics,
  },
  {
    text: pqSpecificationTexts.amount,
  },
  {
    text: pqSpecificationTexts.packing,
  },
  {
    text: pqSpecificationTexts.singlePrice,
  },
  {
    text: pqSpecificationTexts.totalPrice,
  },
];
