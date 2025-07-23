import axios from "axios";
import type { AxiosResponse } from "axios";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";
import type { PQContractType, PQDataComplexType } from "@/widgets/pq/types/PQTypes";
import { API_TENDER_URL } from "@/constants/env.ts";

export class FetchTender {
  static async load(tenderID: string): Promise<TenderOfferType> {
    if (!tenderID) {
      return {} as TenderOfferType;
    }
    const url = `${API_TENDER_URL}/${tenderID}`;
    try {
      const {
        data: { data },
      }: AxiosResponse = await axios.get(url);
      return data as TenderOfferType;
    } catch (e) {
      return {} as TenderOfferType;
    }
  }

  static async getTenderForContract(contract: PQContractType): Promise<PQDataComplexType> {
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
