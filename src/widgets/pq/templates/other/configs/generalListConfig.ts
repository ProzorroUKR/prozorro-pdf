import { STRING } from "@/constants/string";
import { pqSpecificationTexts } from "@/widgets/pq/configs/pqTexts";
import type { PQspecificationListItem } from "@/widgets/pq/types/PQTypes";
import { FormattingFunctionsEnum } from "@/widgets/pq/services/Formating/config/FormattingFunctions.enum";

export const generalListConfig: PQspecificationListItem[][] = [
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
    { text: pqSpecificationTexts.deliveryPlace },
    {
      path: "items[0].deliveryAddress",
      default: STRING.EMPTY,
      functionName: FormattingFunctionsEnum.CUSTOMER_LOCATION,
    },
    { text: STRING.DOT },
  ],
  [
    { text: pqSpecificationTexts.expirationDate },
    {
      path: "period.endDate",
      default: pqSpecificationTexts.endDate,
      functionName: FormattingFunctionsEnum.FORMAT_DATE,
    },
    { text: STRING.DOT },
  ],
];
