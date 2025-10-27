import { DEFAULT_TEXT_FIELDS } from "@/constants/string";
import { MILESTONE_TYPE } from "@/constants/tender/milestones";

export const PQ_RELATED_MILESTONES_TYPE: string[] = ["financing", "delivery"];

export const MILESTONES_PAYMENT_TYPE: Record<string, string> = {
  prepayment: "Аванс",
  postpayment: "Пiсляоплата",
  standard: "Одноразова поставка",
  recurring: "Повторювана поставка",
};

export const MILESTONES_DURATION_TYPE: Record<string, Record<MILESTONE_TYPE, string>> = {
  single: {
    [MILESTONE_TYPE.WORKING]: "робочого дня",
    [MILESTONE_TYPE.BANKING]: "банківського дня",
    [MILESTONE_TYPE.CALENDAR]: "календарного дня",
  },
  few: {
    [MILESTONE_TYPE.WORKING]: "робочих днів",
    [MILESTONE_TYPE.BANKING]: "банківських днів",
    [MILESTONE_TYPE.CALENDAR]: "календарних днів",
  },
};

export const MILESTONE_EVENT_TITLE: Record<string, string> = {
  executionOfWorks: "виконання робіт",
  deliveryOfGoods: "поставки товару",
  submittingServices: "надання послуг",
  signingTheContract: "підписання договору",
  submissionDateOfApplications: "подання заявки",
  submittingPayment: "здійснення оплати",
  dateOfInvoicing: "дати виставлення рахунку",
  endDateOfTheReportingPeriod: "дати закінчення звітного періоду",
  anotherEvent: "іншої події " + DEFAULT_TEXT_FIELDS.UNDERSCORES_32, // виводимо пропуск для заповнення клієнтом "іншої події"
};
