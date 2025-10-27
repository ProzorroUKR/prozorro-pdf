import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import type { PQspecificationListItem } from "@/widgets/pq/types/PQTypes";
import { generalListConfig } from "@/widgets/pq/templates/other/configs/generalListConfig";
import { fuelListConfig } from "@/widgets/pq/templates/fuel/configs/fuelListConfig";
import { medicineListConfig } from "@/widgets/pq/templates/medicine/configs/medicineListConfig";

export const TemplateToSpecificationListMap = new Map<string, PQspecificationListItem[][]>()
  .set(PROZORRO_TEMPLATE_CODES.FRUIT, generalListConfig)
  .set(PROZORRO_TEMPLATE_CODES.COMPUTER, generalListConfig)
  .set(PROZORRO_TEMPLATE_CODES.OTHER, generalListConfig)
  .set(PROZORRO_TEMPLATE_CODES.MEDICINE, medicineListConfig)
  .set(PROZORRO_TEMPLATE_CODES.PHARM, medicineListConfig)
  .set(PROZORRO_TEMPLATE_CODES.GAS, fuelListConfig);
