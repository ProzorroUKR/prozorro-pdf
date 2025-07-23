import { TemplateCodesEnum } from "@/widgets/pq/types/TemplateCodes.enum";
import { generalTitlesConfig } from "@/widgets/pq//configs/pqTitles";
import { foodTitlesConfig } from "@/widgets/pq/templates/food/configs/foodTitles.config";
import { medicineV2titlesConfig } from "@/widgets/pq/templates/medicine2/config/medicineV2titles.config";
import { softwareTitlesConfig } from "@/widgets/pq/templates/software/configs/softwareTitles.config";
import { genericTitlesConfig } from "@/widgets/pq/templates/generic/configs/genericTitles.config";
import { fuelTitlesConfig } from "@/widgets/pq/templates/fuel/configs/fuelTitles.config";
import { medicineTitlesConfig } from "@/widgets/pq/templates/medicine/configs/medicineTitlesConfig";
import { pharm2TitlesConfig } from "@/widgets/pq/templates/pharm2/configs/pharm2Titles.config";
import { fuel2TitlesConfig } from "@/widgets/pq/templates/fuel2/configs/fuel2Titles.config";

export const TemplateToPqTitlesMap = new Map<TemplateCodesEnum, Record<string, string>>()
  .set(TemplateCodesEnum.FRUIT, generalTitlesConfig)
  .set(TemplateCodesEnum.FRUIT2, generalTitlesConfig)
  .set(TemplateCodesEnum.COMPUTER, generalTitlesConfig)
  .set(TemplateCodesEnum.SOFTWARE, softwareTitlesConfig)
  .set(TemplateCodesEnum.OTHER, generalTitlesConfig)
  .set(TemplateCodesEnum.MEDICINE, medicineTitlesConfig)
  .set(TemplateCodesEnum.PHARM, medicineTitlesConfig)
  .set(TemplateCodesEnum.PHARM2, pharm2TitlesConfig)
  .set(TemplateCodesEnum.GAS, fuelTitlesConfig)
  .set(TemplateCodesEnum.GAS2, fuel2TitlesConfig)
  .set(TemplateCodesEnum.GENERIC, genericTitlesConfig)
  .set(TemplateCodesEnum.MEDICINE2, medicineV2titlesConfig)
  .set(TemplateCodesEnum.FOOD, foodTitlesConfig);
