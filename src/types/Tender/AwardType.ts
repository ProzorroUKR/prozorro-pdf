import type { MoneyType } from "@/types/Tender/MoneyType";
import type { OrganizationType } from "@/types/Tender/OrganizationType";
import type { AwardItemType } from "@/types/Tender/AwardItemType";
import type { DocumentType } from "@/types/Tender/DocumentType";

export type AwardType = {
  id: string;
  title?: string;
  description?: string;
  status?: (typeof AwardStatus)[keyof typeof AwardStatus];
  date: string;
  value?: MoneyType;
  lotID?: string;
  suppliers?: OrganizationType[];
  items?: AwardItemType[];
  documents: DocumentType[];
  qualified?: boolean;
  eligible?: boolean;
  bid_id?: string;
};
export const AwardStatus = {
  UNSUCCESSFUL: "unsuccessful",
  ACTIVE: "active",
  CANCELLED: "cancelled",
  PENDING: "pending",
};
