import { get } from "lodash";
import type { AwardType } from "@/types/Tender/AwardType";
import { PQFormattingService } from "@/widgets/pq/services/Formating/PQFormattingService";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import type { BidType, RequirementResponseType, TenderOfferType } from "@/types/TenderOffer/Tender";
import { ensuringTextsConfig } from "@/widgets/pq/services/ContractEnsuring/config/ensuringTextsConfig";
import type { ContractEnsuringInterface } from "@/widgets/pq/services/ContractEnsuring/ContractEnsuringInterface";

export class ContractEnsuring implements ContractEnsuringInterface {
  private readonly tender: TenderOfferType;
  private readonly requirementResponses: RequirementResponseType[];

  constructor(tender: TenderOfferType, awardID: string) {
    this.tender = tender;

    const awardObject = this.getAwardObject(awardID);

    const contractedBid = this.getContractedBid(get(awardObject, "bid_id"));

    this.requirementResponses = DocumentExtractionService.getField(contractedBid, "requirementResponses", []);
  }

  public createEnsuringList(): Record<string, any>[] {
    return PQFormattingService.createCompoundItemFromConfig(ensuringTextsConfig, this.requirementResponses);
  }

  /*
   * Отримати з тендера авард, що зазначений в awardID контракту
   */
  private getAwardObject(awardID: string): AwardType | Record<string, any> {
    return (
      DocumentExtractionService.getField<AwardType[]>(this.tender, "awards", []).find(
        (award: AwardType) => award.id === awardID
      ) ?? {}
    );
  }

  /*
   * Отримати з тендера бід, який відноситься до контракту
   */
  private getContractedBid(contractedBidID: string): BidType | Record<string, any> {
    return (
      DocumentExtractionService.getField<BidType[]>(this.tender, "bids", []).find(
        (bid: BidType) => bid.id === contractedBidID
      ) ?? {}
    );
  }
}
