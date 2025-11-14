import type { ComplaintType } from "@/types/complaints";
import type { DocumentType } from "@/types/Tender/DocumentType";
import type { Milestone } from "@/types/Announcement/AnnouncementTypes";

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
  milestones?: Milestone[];
};

export const QualificationsStatusType = {
  CANCELLED: "cancelled",
  PENDING: "pending",
  ACTIVE: "active",
  UNSUCCESSFUL: "unsuccessful",
};
