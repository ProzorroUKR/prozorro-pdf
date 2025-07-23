import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import { TemplateCodesEnum } from "@/widgets/pq/types/TemplateCodes.enum";

export interface IPQBuilder {
  build(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: TemplateCodesEnum,
    tender: any
  ): Record<string, any>[];
}
