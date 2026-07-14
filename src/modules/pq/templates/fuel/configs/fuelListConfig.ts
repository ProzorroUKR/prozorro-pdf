import { pqSpecificationTexts } from "@/modules/pq/configs/pqTexts";
import type { PQspecificationListItem } from "@/types/pq/PQTypes";
import { STRING } from "@/constants/string";
import { FormattingFunctionsEnum } from "@/modules/pq/services/Formating/config/FormattingFunctions.enum";

export const fuelListConfig: PQspecificationListItem[][] = [
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
    { text: pqSpecificationTexts.talonDeliveryPeriod },
    {
      path: "period.endDate",
      default: "___",
      functionName: FormattingFunctionsEnum.DELIVERY_DATE_DIFF,
    },
    { text: pqSpecificationTexts.taloncalendarDays },
  ],
  [
    { text: pqSpecificationTexts.fuelDeliveryPlace },
    {
      path: "items[0].deliveryAddress",
      default: "",
      functionName: FormattingFunctionsEnum.CUSTOMER_LOCATION,
    },
    { text: STRING.DOT },
  ],
  [{ text: pqSpecificationTexts.talonLimitDueDate }],
  [
    { text: pqSpecificationTexts.expirationDateFuel },
    {
      path: "period.endDate",
      default: pqSpecificationTexts.endDate,
      functionName: FormattingFunctionsEnum.FORMAT_DATE,
    },
    { text: STRING.DOT },
  ],
];
