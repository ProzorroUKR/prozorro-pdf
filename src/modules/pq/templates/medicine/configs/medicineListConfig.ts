import { pqSpecificationTexts } from "@/modules/pq/configs/pqTexts";
import type { PQspecificationListItem } from "@/types/pq/PQTypes";
import { STRING } from "@/constants/string";
import { FormattingFunctionsEnum } from "@/modules/pq/services/Formating/config/FormattingFunctions.enum";

export const medicineListConfig: PQspecificationListItem[][] = [
  [
    { text: pqSpecificationTexts.refersTo },
    {
      path: "items[0].classification",
      default: pqSpecificationTexts.dkCode,
      functionName: FormattingFunctionsEnum.FORMAT_CLASSIFICATION,
    },
    { text: STRING.DOT },
  ],
  [
    { text: pqSpecificationTexts.contractTotalPrice },
    {
      path: "value.amount",
      default: "",
      functionName: "",
    },
    { text: pqSpecificationTexts.includingTax },
  ],
  [{ text: pqSpecificationTexts.customerBudget }],
  [
    { text: pqSpecificationTexts.deliveryPlace },
    {
      path: "items[0].deliveryAddress",
      default: "",
      functionName: FormattingFunctionsEnum.CUSTOMER_LOCATION,
    },
    { text: STRING.DOT },
  ],
  [
    { text: pqSpecificationTexts.deliveryPeriod },
    {
      path: "period.endDate",
      default: "___",
      functionName: FormattingFunctionsEnum.DELIVERY_DATE_DIFF,
    },
    { text: pqSpecificationTexts.calendarDays },
  ],
  [
    { text: pqSpecificationTexts.expirationDateMedicine },
    {
      path: "period.endDate",
      default: pqSpecificationTexts.endDate,
      functionName: FormattingFunctionsEnum.FORMAT_DATE,
    },
    { text: pqSpecificationTexts.expirationDateMedicineFinish },
  ],
];
