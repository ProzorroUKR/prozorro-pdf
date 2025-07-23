import { TemplateCodesEnum } from "@/widgets/pq/types/TemplateCodes.enum";
import { TemplateVersionsEnum } from "@/widgets/pq/types/TemplateVersions.enum";

export const TemplateVersionsMap = new Map<TemplateVersionsEnum, TemplateCodesEnum[]>()
  .set(TemplateVersionsEnum.VERSION_1, [
    TemplateCodesEnum.OTHER,
    TemplateCodesEnum.GAS,
    TemplateCodesEnum.PHARM,
    TemplateCodesEnum.MEDICINE,
    TemplateCodesEnum.COMPUTER,
    TemplateCodesEnum.FRUIT,
  ])
  .set(TemplateVersionsEnum.VERSION_2, [
    TemplateCodesEnum.GENERIC,
    TemplateCodesEnum.FOOD,
    TemplateCodesEnum.FRUIT2,
    TemplateCodesEnum.GAS2,
    TemplateCodesEnum.PHARM2,
    TemplateCodesEnum.MEDICINE2,
    TemplateCodesEnum.SOFTWARE,
  ]);
