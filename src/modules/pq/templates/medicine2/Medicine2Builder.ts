import type { PQContractType } from "@/types/pq/PQTypes";
import { PROZORRO_TEMPLATE_CODES } from "@/types/pq/TemplateCodes.enum";
import type { IPQBuilder } from "@/modules/pq/PQBuilderInterface";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";
import { TemplateBuildHelper } from "@/modules/pq/templates/TemplateBuildHelper";

export class Medicine2Builder implements IPQBuilder {
  build(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: PROZORRO_TEMPLATE_CODES,
    tender: TenderOfferType | Record<string, any>
  ): Record<string, any>[] {
    return TemplateBuildHelper.foodBuilder(contractObject, contractTemplate, tender);
  }
}
