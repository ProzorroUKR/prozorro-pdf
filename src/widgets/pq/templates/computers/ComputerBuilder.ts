import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import type { IPQBuilder } from "@/widgets/pq/PQBuilderInterface";
import { TemplateBuildHelper } from "@/widgets/pq/templates/TemplateBuildHelper";

export class ComputersBuilder implements IPQBuilder {
  build(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: PROZORRO_TEMPLATE_CODES
  ): Record<string, any>[] {
    return TemplateBuildHelper.fruitBuilder(contractObject, contractTemplate);
  }
}
