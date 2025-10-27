export const KVT_SELECTORS_LIST: string[] = [
  "HDOCNAME",
  "HRESULT",
  "HDATE",
  "HTIME",
];

export const XML_SELECTORS_LIST: string[] = [
  "HNAME", // Найменування
  "HTIN", // Код згідно з ЄДРПОУ
  "HKSTI", // Код територіального органу ДФС
  "HSTI", // Назва територіального органу ДФС
  "R0201G1S", // Код згідно з ЄДРПОУ/реєстраційний номер
  "R0202G1S", // Найменування - optional
  "R0203G1S", // Прізвище     - optional
  "R0204G1S", // Ім’я         - optional
  "R0301G1S", // Результат обробки запиту
  "R0401G1S", // Позначка про відсутність / наявність заборгованості
  "HFILL", // Дата формування відповіді
  "HTIME", // Час формування відповіді
];

export const CONCLUSION_PROCURING_ENTITY_KEYS = [
  "procuringEntity.name",
  "procuringEntity.identifier",
  "procuringEntity.address.country-name",
  "procuringEntity.address.locality",
  "procuringEntity.address.street-address",
];

export const CONCLUSION_SUBJECT_PURCHASE_KEYS = [
  "description",
  "value",
  "classification-id",
  "classification-scheme",
  "quantity",
  "unit-name",
];

export const CONCLUSION_INFO_ABOUT_DISCLOSURE = ["id", "date-created"];
