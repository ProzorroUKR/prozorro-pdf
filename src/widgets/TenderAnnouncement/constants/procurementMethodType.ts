export const PROCUREMENT_METHOD_TYPE: Record<string, any> = {
  open: {
    closeFrameworkAgreementUA: "про проведення відкритих торгів",
    competitiveDialogueUA: "про проведення конкурентного діалогу",
    competitiveDialogueEU: "про проведення конкурентного діалогу",
    esco: "про проведення відкритих торгів із закупівлі енергосервісу",
    belowThreshold: "про проведення спрощеної/допорогової закупівлі",
    simple: {
      defense: "про проведення спрощених торгів із застосуванням електронної системи закупівель",
    },
  },
  selective: {
    competitiveDialogueUA: {
      stage2: "про проведення конкурентного діалогу \n 2-ий етап",
    },
    competitiveDialogueEU: {
      stage2: "про проведення конкурентного діалогу \n 2-ий етап",
    },
  },
  limited: {
    reporting: "Звіт про укладений договір",
    priceQuotation: "Звіт про укладений договір",
  },
};
