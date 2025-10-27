export const PQ_REQUIREMENTS: Record<string, string> = {
  percent: "Сума забезпечення виконання Договору про закупівлю становить % від ціни цього Договору про закупівлю",
  guaranteePeriodMin: "Строк дії гарантії повинен перевищувати строк дії цього Договору про закупівлю не менше ніж",
  guaranteePeriod: "Строк дії гарантії перевищує строк дії Договору про закупівлю на",
  supplierConfirms: "Постачальник підтверджує, що зарахує суму гарантії на реквізити",
  guaranteeType: "Форма забезпечення",
  guaranteeTypeDetailed: "Форма забезпечення - (текст вказати замовником)",
  other: "Інші вимоги до забезпечення",
};

export const ENSURING_CLASSIFICATION = "CRITERION.OTHER.CONTRACT.GUARANTEE";

export const ENSURING_PERCENT_REQUIREMENTS = [PQ_REQUIREMENTS.percent];

export const ENSURING_PERIOD_REQUIREMENTS = [PQ_REQUIREMENTS.guaranteePeriod, PQ_REQUIREMENTS.guaranteePeriodMin];

export const ENSURING_TYPE_REQUIREMENTS = [PQ_REQUIREMENTS.guaranteeType, PQ_REQUIREMENTS.guaranteeTypeDetailed];

export const ENSURING_TYPE_VALUE = "Гарантія фінансової установи";
