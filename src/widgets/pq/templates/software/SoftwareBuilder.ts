import type { IPQBuilder } from "@/widgets/pq/PQBuilderInterface";
import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import { TemplateCodesEnum } from "@/widgets/pq/types/TemplateCodes.enum";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";
import { TemplateBuildHelper } from "@/widgets/pq/templates/TemplateBuildHelper";

export class SoftwareBuilder implements IPQBuilder {
  build(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: TemplateCodesEnum,
    tender: TenderOfferType | Record<string, any>
  ): Record<string, any>[] {
    return TemplateBuildHelper.foodBuilder(contractObject, contractTemplate, tender);
  }
}
