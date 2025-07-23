import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import { TemplateCodesEnum } from "@/widgets/pq/types/TemplateCodes.enum";
import type { IPQBuilder } from "@/widgets/pq/PQBuilderInterface";
import { TemplateBuildHelper } from "@/widgets/pq/templates/TemplateBuildHelper";

export class Fuel2Builder implements IPQBuilder {
  build(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: TemplateCodesEnum,
    tender: any
  ): Record<string, any>[] {
    return TemplateBuildHelper.fruit2Builder(contractObject, contractTemplate, tender);
  }
}
