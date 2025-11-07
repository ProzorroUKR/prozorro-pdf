import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import { generalTitlesConfig } from "@/widgets/pq//configs/pqTitles";
import { foodTitlesConfig } from "@/widgets/pq/templates/food/configs/foodTitles.config";
import { medicineV2titlesConfig } from "@/widgets/pq/templates/medicine2/config/medicineV2titles.config";
import { softwareTitlesConfig } from "@/widgets/pq/templates/software/configs/softwareTitles.config";
import { genericTitlesConfig } from "@/widgets/pq/templates/generic/configs/genericTitles.config";
import { fuelTitlesConfig } from "@/widgets/pq/templates/fuel/configs/fuelTitles.config";
import { medicineTitlesConfig } from "@/widgets/pq/templates/medicine/configs/medicineTitlesConfig";
import { pharm2TitlesConfig } from "@/widgets/pq/templates/pharm2/configs/pharm2Titles.config";
import { fuel2TitlesConfig } from "@/widgets/pq/templates/fuel2/configs/fuel2Titles.config";
import { nushTitlesConfig } from "@/widgets/pq/templates/nush/configs/nushTitles.config";

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
  .set(PROZORRO_TEMPLATE_CODES.NUSH, nushTitlesConfig);
