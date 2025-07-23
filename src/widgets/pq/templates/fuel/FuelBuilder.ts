import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import { TemplateCodesEnum } from "@/widgets/pq/types/TemplateCodes.enum";
import type { IPQBuilder } from "@/widgets/pq/PQBuilderInterface";
import { TemplateBuildHelper } from "@/widgets/pq/templates/TemplateBuildHelper";

export class FuelBuilder implements IPQBuilder {
  build(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: TemplateCodesEnum,
    _tender: any
  ): Record<string, any>[] {
    return TemplateBuildHelper.fruitBuilder(contractObject, contractTemplate, _tender);
  }
}
