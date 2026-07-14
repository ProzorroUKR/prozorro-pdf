import type { PQContractType } from "@/types/pq/PQTypes";
import { PROZORRO_TEMPLATE_CODES } from "@/types/pq/TemplateCodes.enum";
import type { IPQBuilder } from "@/modules/pq/PQBuilderInterface";
import { TemplateBuildHelper } from "@/modules/pq/templates/TemplateBuildHelper";

export class AozBuilder implements IPQBuilder {
  build(
    contractObject: PQContractType | Record<string, never>,
    _: PROZORRO_TEMPLATE_CODES,
    tender: any
  ): Record<string, any>[] {
    return TemplateBuildHelper.aozBuilder(contractObject, tender);
  }
}
