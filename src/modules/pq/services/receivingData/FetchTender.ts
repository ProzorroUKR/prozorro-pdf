import { HttpClient } from "@/services/Http/HttpClient";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";
import type { PQContractType, PQDataComplexType } from "@/types/pq/PQTypes";

export class FetchTender {
  constructor(private readonly apiUrl: string) {}

  async load(tenderID: string): Promise<TenderOfferType> {
    try {
      if (!tenderID) {
        return {} as TenderOfferType;
      }

      const { data } = await HttpClient.get(`${this.apiUrl}/${tenderID}`);
      return data as TenderOfferType;
    } catch {
      return {} as TenderOfferType;
    }
  }

  async getTenderForContract(contract: PQContractType): Promise<PQDataComplexType> {
    try {
      const tender = await this.load(contract?.tender_id);

      return {
        tender,
        contract,
      };
    } catch {
      return {
        tender: {} as TenderOfferType,
        contract,
      };
    }
  }
}
