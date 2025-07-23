export enum procurementMethodTypes {
  BELOW_THRESHOLD = "belowThreshold",
  ABOVE_THRESHOLD = "aboveThreshold",
  ABOVE_THRESHOLD_UA = "aboveThresholdUA",
  ABOVE_THRESHOLD_EU = "aboveThresholdEU",
}

export const procurementMethodTypeEU = [
  procurementMethodTypes.ABOVE_THRESHOLD_EU,
  "aboveThresholdUA.defense",
  "closeFrameworkAgreementUA",
  "competitiveDialogueEU",
];

export const noSecurement = [
  procurementMethodTypes.BELOW_THRESHOLD,
  procurementMethodTypes.ABOVE_THRESHOLD,
  procurementMethodTypes.ABOVE_THRESHOLD_UA,
  procurementMethodTypes.ABOVE_THRESHOLD_EU,
];

export const noAuction = ["competitiveDialogueUA", "competitiveDialogueEU"];

export const closeFrame = ["closeFrameworkAgreementUA"];

export const qualificationPeriodTypes = [
  ...noAuction,
  "aboveThresholdEU",
  "competitiveDialogueUA.stage2",
  "competitiveDialogueEU.stage2",
];
