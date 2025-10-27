export const complaintPostPerson = new Map()
  .set("tender_owner", "Замовник")
  .set("complaint_owner", "Скаржник")
  .set("aboveThresholdReviewers", "АМКУ");

export const POST_HEADING = {
  requisites: "АНТИМОНОПОЛЬНИЙ КОМІТЕТ УКРАЇНИ",
  address: "03680, м. Київ, вул. Митрополита В. Липківського, 45",
  complaintName: "Ім’я (найменування) суб’єкта оскарження",
  edrpou: "ЄДРПОУ суб’єкта оскарження",
  location: "Місце проживання (місцезнаходження) суб’єкта оскарження",
  legalName: "Найменування замовника рішення, дії або бездіяльність якого оскаржуються",
  edrpouProcuring: "ЄДРПОУ замовника",
  tenderId: "Ідентифікатор закупівлі",
  complaintId: "Ідентифікатор скарги",
};

export const POST_TITLES = {
  heading: "Заголовок",
  sequenceNumber: "Пункт скарги №",
  author: "Автор",
  receiver: "Кому направлено",
  date: "Дата",
  content: "Зміст",
  documents: "Документи",
};
