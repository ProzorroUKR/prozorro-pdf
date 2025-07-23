import { EnsuringTypeCodesEnum } from "@/widgets/pq/services/ContractEnsuring/types/EnsuringTypeCodes.enum";
import { pqGenericAddition2Texts } from "@/widgets/pq/templates/generic/configs/pqGenericTexts";

export const EnsuringOptionToTextMap = new Map<string, string>()
  .set(EnsuringTypeCodesEnum.OPTION_1, pqGenericAddition2Texts.option1Guarantees)
  .set(EnsuringTypeCodesEnum.OPTION_2, pqGenericAddition2Texts.option2Other);
