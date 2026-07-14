import { PROZORRO_TEMPLATE_CODES } from "@/types/pq/TemplateCodes.enum";
import { generalTitlesConfig } from "@/modules/pq//configs/pqTitles";
import { foodTitlesConfig } from "@/modules/pq/templates/food/configs/foodTitles.config";
import { medicineV2titlesConfig } from "@/modules/pq/templates/medicine2/config/medicineV2titles.config";
import { softwareTitlesConfig } from "@/modules/pq/templates/software/configs/softwareTitles.config";
import { genericTitlesConfig } from "@/modules/pq/templates/generic/configs/genericTitles.config";
import { fuelTitlesConfig } from "@/modules/pq/templates/fuel/configs/fuelTitles.config";
import { medicineTitlesConfig } from "@/modules/pq/templates/medicine/configs/medicineTitlesConfig";
import { pharm2TitlesConfig } from "@/modules/pq/templates/pharm2/configs/pharm2Titles.config";
import { fuel2TitlesConfig } from "@/modules/pq/templates/fuel2/configs/fuel2Titles.config";
import { nushTitlesConfig } from "@/modules/pq/templates/nush/configs/nushTitles.config";
import { aozTitlesConfig } from "@/modules/pq/templates/aoz/configs/aozTitles.config.ts";

export const TemplateToPqTitlesMap = new Map<PROZORRO_TEMPLATE_CODES, Record<string, string>>()
  .set(PROZORRO_TEMPLATE_CODES.FRUIT, generalTitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.FRUIT2, generalTitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.COMPUTER, generalTitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.SOFTWARE, softwareTitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.OTHER, generalTitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.MEDICINE, medicineTitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.PHARM, medicineTitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.PHARM2, pharm2TitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.GAS, fuelTitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.GAS2, fuel2TitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.GENERIC, genericTitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.MEDICINE2, medicineV2titlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.FOOD, foodTitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.NUSH, nushTitlesConfig)
  .set(PROZORRO_TEMPLATE_CODES.DPA, aozTitlesConfig);
