import type { PQContractType } from "@/widgets/pq/types/PQTypes";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { QualificationsStatusType } from "@/types/ProtocolConsiderationTenderOffers/Qualifications";

export class ContractPendingChecker {
  static isReadyToFillContract(contractObject: PQContractType | Record<any, any>): boolean {
    // check if this a contract object or a tender with pending contracts object
    return (
      DocumentExtractionService.getField<string>(contractObject, "contractID").length > 0 ||
      DocumentExtractionService.getField<Record<string, any>[]>(contractObject, "contracts", []).some(
        contract => contract.status === QualificationsStatusType.PENDING
      )
    );
  }
}
