import { TemplateCodesEnum } from "@/widgets/pq/types/TemplateCodes.enum";
import type { PQspecificationListItem } from "@/widgets/pq/types/PQTypes";
import { generalListConfig } from "@/widgets/pq/templates/other/configs/generalListConfig";
import { fuelListConfig } from "@/widgets/pq/templates/fuel/configs/fuelListConfig";
import { medicineListConfig } from "@/widgets/pq/templates/medicine/configs/medicineListConfig";

export const TemplateToSpecificationListMap = new Map<string, PQspecificationListItem[][]>()
  .set(TemplateCodesEnum.FRUIT, generalListConfig)
  .set(TemplateCodesEnum.COMPUTER, generalListConfig)
  .set(TemplateCodesEnum.OTHER, generalListConfig)
  .set(TemplateCodesEnum.MEDICINE, medicineListConfig)
  .set(TemplateCodesEnum.PHARM, medicineListConfig)
  .set(TemplateCodesEnum.GAS, fuelListConfig);
