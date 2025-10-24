import axios from "axios";
import type { AxiosResponse } from "axios";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";
import type { PQContractType, PQDataComplexType } from "@/widgets/pq/types/PQTypes";

export class FetchTender {
  constructor(private readonly apiUrl: string) {}

  async load(tenderID: string): Promise<TenderOfferType> {
    try {
      if (!tenderID) {
        return {} as TenderOfferType;
      }

      const {
        data: { data },
      }: AxiosResponse = await axios.get(`${this.apiUrl}/${tenderID}`);
      return data as TenderOfferType;
    } catch (e) {
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
    } catch (err) {
      return {
        tender: {} as TenderOfferType,
        contract,
      };
    }
  }
}
