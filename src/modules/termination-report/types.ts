import type { AddressType } from "@/types/Tender/AddressType";
import type { IdentifierType } from "@/types/Tender/IdentifierType";
import type { ClassificationType } from "@/types/Tender/ClassificationType";
import type { DocumentType } from "@/types/Tender/DocumentType";
import type { PQsupplierSignerInfo } from "@/types/pq/PQTypes";
import type { DataSchemaType } from "@/types/TenderOffer/Tender";

/** A money value as it comes from the contract — every field may be absent. */
export interface TerminationValue {
  amount?: number;
  currency?: string;
  amountNet?: number;
  valueAddedTaxIncluded?: boolean;
}

/** Contract validity / item delivery window — either bound may be missing. */
export interface TerminationPeriod {
  startDate?: string;
  endDate?: string;
}

export interface TerminationUnit {
  code?: string;
  name?: string;
}

/** One procurement-item attribute (product requirement response). */
export interface TerminationAttribute {
  name?: string;
  value?: string | number | boolean;
  values?: (string | number | boolean)[];
  unit?: TerminationUnit;
  dataSchema?: DataSchemaType;
}

export interface TerminationItem {
  description?: string;
  /** Product id — builds the `.../product/<id>` link on the item name. */
  product?: string;
  quantity?: number | string;
  classification?: ClassificationType;
  additionalClassifications?: ClassificationType[];
  unit?: TerminationUnit;
  deliveryAddress?: AddressType;
  deliveryDate?: TerminationPeriod;
  attributes?: TerminationAttribute[];
}

/** Buyer or supplier party on the contract. */
export interface TerminationParty {
  name?: string;
  kind?: string;
  identifier?: Partial<IdentifierType>;
  address?: AddressType;
  signerInfo?: PQsupplierSignerInfo;
}

/** The termination decision — decoded `data` object of the signature. */
export interface TerminationDetails {
  reasonType?: string;
  reason?: string;
  amountPaid?: TerminationValue;
  documents?: DocumentType[];
}

/** Contract snapshot — decoded `context.contract` object of the signature. */
export interface TerminationContract {
  contractID?: string;
  tenderID?: string;
  mainProcurementCategory?: string;
  period?: TerminationPeriod;
  value?: TerminationValue;
  buyer?: TerminationParty;
  suppliers?: TerminationParty[];
  items?: TerminationItem[];
  terminationDetails?: TerminationDetails;
}

export interface TerminationReportFile {
  terminationDetails: TerminationDetails;
  contract: TerminationContract;
}

/** A loaded dictionary map keyed by the local dictionary name. */
export type TerminationDictionaries = Map<string, Record<string, any>>;
