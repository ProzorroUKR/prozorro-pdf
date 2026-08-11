export enum procurementMethodTypes {
  BELOW_THRESHOLD = "belowThreshold",
  ABOVE_THRESHOLD = "aboveThreshold",
  ABOVE_THRESHOLD_UA = "aboveThresholdUA",
  ABOVE_THRESHOLD_EU = "aboveThresholdEU",
  ABOVE_THRESHOLD_UA_DEFENSE = "aboveThresholdUA.defense",
  CLOSE_FRAMEWORK_AGREEMENT_UA = "closeFrameworkAgreementUA",
  CLOSE_FRAMEWORK_AGREEMENT_SELECTION_UA = "closeFrameworkAgreementSelectionUA",
  COMPETITIVE_DIALOGUE_UA = "competitiveDialogueUA",
  COMPETITIVE_DIALOGUE_UA_STAGE_2 = "competitiveDialogueUA.stage2",
  COMPETITIVE_DIALOGUE_EU = "competitiveDialogueEU",
  COMPETITIVE_DIALOGUE_EU_STAGE_2 = "competitiveDialogueEU.stage2",
  ESCO = "esco",
  SIMPLE_DEFENSE = "simple.defense",
}

export const procurementMethodTypeEU = [
  procurementMethodTypes.ABOVE_THRESHOLD_EU,
  procurementMethodTypes.ABOVE_THRESHOLD_UA_DEFENSE,
  procurementMethodTypes.CLOSE_FRAMEWORK_AGREEMENT_UA,
  procurementMethodTypes.COMPETITIVE_DIALOGUE_EU,
];

export const noSecurement = [
  procurementMethodTypes.BELOW_THRESHOLD,
  procurementMethodTypes.ABOVE_THRESHOLD,
  procurementMethodTypes.ABOVE_THRESHOLD_UA,
  procurementMethodTypes.ABOVE_THRESHOLD_EU,
];

export const noAuction = [
  procurementMethodTypes.COMPETITIVE_DIALOGUE_UA,
  procurementMethodTypes.COMPETITIVE_DIALOGUE_EU,
];

export const closeFrame = [procurementMethodTypes.CLOSE_FRAMEWORK_AGREEMENT_UA];
