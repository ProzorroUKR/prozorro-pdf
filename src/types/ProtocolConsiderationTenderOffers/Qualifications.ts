import type { DocumentType } from "@/types/Tender/DocumentType";
import type { ComplaintType } from "@/types/complaints";

export type QualificationsType = {
  id: string;
  title?: string;
  description?: string;
  bidID?: string;
  lotID?: string;
  status: (typeof QualificationsStatusType)[keyof typeof QualificationsStatusType];
  date: string;
  documents: DocumentType[];
  complaints?: ComplaintType[];
  qualified?: boolean;
  eligible?: boolean;
};
export const QualificationsStatusType = {
  CANCELLED: "cancelled",
  PENDING: "pending",
  ACTIVE: "active",
  UNSUCCESSFUL: "unsuccessful",
};
