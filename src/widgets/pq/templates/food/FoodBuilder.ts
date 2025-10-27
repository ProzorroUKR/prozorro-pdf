import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import type { IPQBuilder } from "@/widgets/pq/PQBuilderInterface";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";
import { TemplateBuildHelper } from "@/widgets/pq/templates/TemplateBuildHelper";

export class FoodBuilder implements IPQBuilder {
  build(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: PROZORRO_TEMPLATE_CODES,
    tender: TenderOfferType | Record<string, any>
  ): Record<string, any>[] {
    return TemplateBuildHelper.foodBuilder(contractObject, contractTemplate, tender);
  }
}
