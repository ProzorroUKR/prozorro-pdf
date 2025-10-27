import type { AddressType } from "@/types/Tender/AddressType";
import type { ClassificationType } from "@/types/Tender/ClassificationType";
import type { IdentifierType } from "@/types/Tender/IdentifierType";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import type { TenderOfferType } from "@/types/TenderOffer/Tender";

export type PQDataComplexType = {
  tender: TenderOfferType;
  contract: PQContractType;
};

export type PQContractType = {
  awardID: string;
  contractID: string;
  period: ContractPeriod;
  dateSigned: string;
  dateModified: string;
  dateCreated: string;
  tender_id: string;
  owner: string;
  value: PQvalue;
  status: string;
  buyer: PQsupplier;
  suppliers: PQsupplier[];
  items: PQItem[];
  contractTemplateName: PROZORRO_TEMPLATE_CODES;
  bid_owner: string;
  date: string;
  id: string;
};

export type PQItem = {
  attributes?: PQattribute[];
  classification: ClassificationType;
  deliveryAddress: AddressType;
  deliveryDate: {
    endDate: string;
  };
  description: string;
  id: string;
  quantity: number;
  unit: {
    code: string;
    name: string;
    value?: PQvalue;
  };
  relatedLot?: string;
};

export type PQattribute = {
  name: string;
  unit: {
    name: string;
    code: string;
  };
  values: (number | boolean)[];
};

export type PQsupplier = {
  identifier: IdentifierType;
  address: AddressType;
  name: string;
  name_en: string;
  signerInfo?: PQsupplierSignerInfo;
  authorizedBy?: string;
};

export type PQsupplierSignerInfo = {
  name?: string;
  position?: string;
  telephone?: string;
  iban?: string;
  email?: string;
  basisOf?: string;
  authorizedBy?: string;
};

export type PQvalue = {
  amount: number;
  currency: string;
  valueAddedTaxIncluded?: boolean;
  amountNet?: number;
};

export type TextListItem = { text: string };

export type CompoundStringListItem = { path: string; default: string; functionName: string };

export type PQspecificationListItem = TextListItem | CompoundStringListItem;

export type ContractPeriod = {
  startDate: string;
  endDate: string;
};
