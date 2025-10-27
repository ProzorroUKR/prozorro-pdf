import type { DocumentType } from "@/types/Tender/DocumentType";

export type CancellationType = {
  id: string;
  documents?: DocumentType[];
  status: (typeof CancellationStatusType)[keyof typeof CancellationStatusType];
  reason: string;
  reasonType: string;
  relatedLot?: string;
  cancellationOf?: (typeof CancellationOfStatuses)[keyof typeof CancellationOfStatuses];
};
export const CancellationStatusType = {
  DRAFT: "draft",
  PENDING: "pending",
  ACTIVE: "active",
  UNSUCCESSFUL: "unsuccessful",
};
export const CancellationOfStatuses = {
  LOT: "lot",
  TENDER: "tender",
};
