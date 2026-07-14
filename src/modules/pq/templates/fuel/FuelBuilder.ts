import type { PQContractType } from "@/types/pq/PQTypes";
import { PROZORRO_TEMPLATE_CODES } from "@/types/pq/TemplateCodes.enum";
import type { IPQBuilder } from "@/modules/pq/PQBuilderInterface";
import { TemplateBuildHelper } from "@/modules/pq/templates/TemplateBuildHelper";

export class FuelBuilder implements IPQBuilder {
  build(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: PROZORRO_TEMPLATE_CODES
  ): Record<string, any>[] {
    return TemplateBuildHelper.fruitBuilder(contractObject, contractTemplate);
  }
}
