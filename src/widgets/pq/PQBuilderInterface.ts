import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";

export interface IPQBuilder {
  build(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: PROZORRO_TEMPLATE_CODES,
    tender?: any
  ): Record<string, any>[];
}
