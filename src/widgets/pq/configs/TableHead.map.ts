import type { TableHeadConfigType } from "@/widgets/pq/types/TextConfigType";
import { TemplateCodesEnum } from "@/widgets/pq/types/TemplateCodes.enum";
import { generalTableHeader } from "@/widgets/pq/templates/computers/configs/computersContract.config";
import { fuelTableHeader } from "@/widgets/pq/templates/fuel/configs/fuelContract.config";
import { genericTableItemsHeader } from "@/widgets/pq/templates/generic/configs/genericContract.config";

export const TemplateToTableHead = new Map<string, TableHeadConfigType>()
  .set(TemplateCodesEnum.FRUIT, generalTableHeader)
  .set(TemplateCodesEnum.COMPUTER, generalTableHeader)
  .set(TemplateCodesEnum.SOFTWARE, genericTableItemsHeader)
  .set(TemplateCodesEnum.OTHER, generalTableHeader)
  .set(TemplateCodesEnum.MEDICINE, generalTableHeader)
  .set(TemplateCodesEnum.PHARM, generalTableHeader)
  .set(TemplateCodesEnum.GAS, fuelTableHeader)
  .set(TemplateCodesEnum.GENERIC, genericTableItemsHeader);
