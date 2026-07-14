import { PROZORRO_TEMPLATE_CODES } from "@/types/pq/TemplateCodes.enum";
import type { PQspecificationListItem } from "@/types/pq/PQTypes";
import { generalListConfig } from "@/modules/pq/templates/other/configs/generalListConfig";
import { fuelListConfig } from "@/modules/pq/templates/fuel/configs/fuelListConfig";
import { medicineListConfig } from "@/modules/pq/templates/medicine/configs/medicineListConfig";

export const TemplateToSpecificationListMap = new Map<string, PQspecificationListItem[][]>()
  .set(PROZORRO_TEMPLATE_CODES.FRUIT, generalListConfig)
  .set(PROZORRO_TEMPLATE_CODES.COMPUTER, generalListConfig)
  .set(PROZORRO_TEMPLATE_CODES.OTHER, generalListConfig)
  .set(PROZORRO_TEMPLATE_CODES.MEDICINE, medicineListConfig)
  .set(PROZORRO_TEMPLATE_CODES.PHARM, medicineListConfig)
  .set(PROZORRO_TEMPLATE_CODES.GAS, fuelListConfig);
