import type { QualificationsType } from "@/types/ProtocolConsiderationTenderOffers/Qualifications";
import type { DocumentType } from "@/types/Tender/DocumentType";

export type ProtocolConsiderationTenderOffers = {
  qualifications: QualificationsType[];
  procuringEntity: {
    name?: string;
    edrpou?: string;
    address?: Record<string, string>;
    kind: string;
    identifier: {
      scheme?: string;
      id: string;
      legalName?: string;
    };
  };
  documents: DocumentType[];
  lots?: LotsType[];
  bids?: BidsType[];
};
export type LotsType = {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: (typeof LotsStatusType)[keyof typeof LotsStatusType];
  value: {
    amount: number;
    currency: string;
    valueAddedTaxIncluded?: boolean;
  };
};
export const LotsStatusType = {
  ACTIVE: "active",
  CANCELLED: "cancelled",
  UNSUCCESSFUL: "unsuccessful",
  COMPLETE: "complete",
};
export type BidsType = {
  id: string;
  date?: string;
  status: string;
};
