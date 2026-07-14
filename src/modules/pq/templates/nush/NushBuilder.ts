import type { IPQBuilder } from "@/modules/pq/PQBuilderInterface.ts";
import type { PQContractType } from "@/types/pq/PQTypes.ts";
import { PROZORRO_TEMPLATE_CODES } from "@/types/pq/TemplateCodes.enum.ts";
import type { TenderOfferType } from "@/types/TenderOffer/Tender.ts";
import { TemplateBuildHelper } from "@/modules/pq/templates/TemplateBuildHelper.ts";

export class NushBuilder implements IPQBuilder {
  build(
    contractObject: PQContractType | Record<string, never>,
    contractTemplate: PROZORRO_TEMPLATE_CODES,
    tender: TenderOfferType | Record<string, any>
  ): Record<string, any>[] {
    return TemplateBuildHelper.nushBuilder(contractObject, contractTemplate, tender);
  }
}
