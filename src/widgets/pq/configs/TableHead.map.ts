import type { TableHeadConfigType } from "@/widgets/pq/types/TextConfigType";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import { generalTableHeader } from "@/widgets/pq/templates/computers/configs/computersContract.config";
import { fuelTableHeader } from "@/widgets/pq/templates/fuel/configs/fuelContract.config";
import { genericTableItemsHeader } from "@/widgets/pq/templates/generic/configs/genericContract.config";

export const TemplateToTableHead = new Map<string, TableHeadConfigType>()
  .set(PROZORRO_TEMPLATE_CODES.FRUIT, generalTableHeader)
  .set(PROZORRO_TEMPLATE_CODES.COMPUTER, generalTableHeader)
  .set(PROZORRO_TEMPLATE_CODES.SOFTWARE, genericTableItemsHeader)
  .set(PROZORRO_TEMPLATE_CODES.OTHER, generalTableHeader)
  .set(PROZORRO_TEMPLATE_CODES.MEDICINE, generalTableHeader)
  .set(PROZORRO_TEMPLATE_CODES.PHARM, generalTableHeader)
  .set(PROZORRO_TEMPLATE_CODES.GAS, fuelTableHeader)
  .set(PROZORRO_TEMPLATE_CODES.GENERIC, genericTableItemsHeader);
